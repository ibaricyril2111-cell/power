import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const publicAllowed = new Set(['NEXT_PUBLIC_APP_URL', 'NEXT_PUBLIC_GA_MEASUREMENT_ID', 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'])
export function inspectPublicSource(source, filename = '') {
  const issues = []
  for (const match of source.matchAll(/\bNEXT_PUBLIC_[A-Z0-9_]+\b/g)) {
    if (!publicAllowed.has(match[0])) issues.push('Variable publique non autorisée')
  }
  if (/^[\s;]*["']use client["']/.test(source)) {
    for (const match of source.matchAll(/process\.env(?:\.([A-Za-z_][\w]*)|\[([^\]]+)\])/g)) {
      if (!match[1] || (match[1] !== 'NODE_ENV' && !publicAllowed.has(match[1]))) issues.push('Lecture privée/dynamique dans un composant client')
    }
  }
  if (/next\.config\./.test(filename) && /\benv\s*:/.test(source)) issues.push('Injection globale env dans Next.js interdite')
  return [...new Set(issues)]
}

export function inspectPublicBundle(source) {
  const patterns = [
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
    /\b(?:sk_live_|sk_test_|whsec_)[A-Za-z0-9]{16,}/,
    /postgres(?:ql)?:\/\/[^\s"']+:[^\s"']+@/,
    /POWER_PRIVATE_ENV_CANARY_[A-Za-z0-9]+/,
  ]
  return patterns.some(pattern => pattern.test(source))
}

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name)
    return entry.isDirectory() ? walk(file) : [file]
  })
}

export function checkRepository(root = process.cwd(), bundle = false) {
  const failures = []
  const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean)
  for (const file of tracked) {
    if (/(^|\/)\.env(?:\.|$)/.test(file) && !/\.example$/.test(file)) failures.push(`${file}: fichier d'environnement suivi`)
    if (/\.(?:ts|tsx|js|jsx|mjs)$/.test(file) && !file.startsWith('__tests__/') && file !== 'scripts/check-public-env.mjs') {
      const source = fs.readFileSync(path.join(root, file), 'utf8')
      for (const reason of inspectPublicSource(source, file)) failures.push(`${file}: ${reason}`)
    }
  }
  if (bundle) {
    const directory = path.join(root, '.next/static')
    if (!fs.existsSync(directory)) failures.push('Bundle absent : lancer le build avant ce contrôle')
    else for (const file of walk(directory)) {
      if (/\.(?:js|json|map|html)$/.test(file) && inspectPublicBundle(fs.readFileSync(file, 'utf8'))) {
        failures.push(`${path.relative(root, file)}: motif sensible détecté (valeur masquée)`)
      }
    }
  }
  return failures
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const failures = checkRepository(process.cwd(), process.argv.includes('--bundle'))
  if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1 }
  else console.log('Contrôles env publics réussis (liste autorisée + fichiers suivis' + (process.argv.includes('--bundle') ? ' + bundle' : '') + ').')
}
