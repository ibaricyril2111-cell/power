const base = (process.env.SEO_BASE_URL || 'https://powerprimeur.com').replace(/\/$/, '')
const failures = []

async function get(path) {
  const response = await fetch(base + path, { signal: AbortSignal.timeout(15000) })
  const body = await response.text()
  if (!response.ok) failures.push(path + ': HTTP ' + response.status)
  return { response, body }
}

function check(label, condition) {
  console.log((condition ? 'OK' : 'FAIL') + ' ' + label)
  if (!condition) failures.push(label)
}

try {
  const [home, pros, robots, sitemap] = await Promise.all([
    get('/'), get('/professionnels'), get('/robots.txt'), get('/sitemap.xml'),
  ])
  check('HTTPS and primary domain', home.response.url.startsWith('https://powerprimeur.com/') || process.env.SEO_BASE_URL != null)
  check('Home canonical', /<link[^>]+rel=["']canonical["'][^>]+href=["']https:\/\/powerprimeur\.com\/?["']/i.test(home.body))
  check('Google verification retained', home.body.includes('1KOJaBLd_oa4Z8ePRSGeHxczLAFYL3s781AYso9Twfc'))
  check('Business structured data', home.body.includes('schema.org') && home.body.includes('GroceryStore'))
  check('Professional page canonical', /<link[^>]+rel=["']canonical["'][^>]+href=["']https:\/\/powerprimeur\.com\/professionnels["']/i.test(pros.body))
  check('Private routes excluded', robots.body.includes('Disallow: /admin/') && robots.body.includes('Disallow: /api/'))
  check('Sitemap announced', robots.body.includes('https://powerprimeur.com/sitemap.xml'))
  check('Professional page in sitemap', sitemap.body.includes('https://powerprimeur.com/professionnels'))
  check('No Vercel URLs in sitemap', !sitemap.body.includes('power-ecru-pi.vercel.app'))
} catch (error) {
  failures.push(error.message)
}

if (failures.length) {
  console.error('SEO checks failed:', failures.join('; '))
  process.exitCode = 1
} else {
  console.log('SEO checks passed for ' + base)
}
