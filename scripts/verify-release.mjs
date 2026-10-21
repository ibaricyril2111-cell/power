import { spawnSync } from 'node:child_process'

function run(args, env = process.env) {
  const result = spawnSync(process.execPath, args, { stdio: 'inherit', env })
  if (result.status !== 0) process.exit(result.status || 1)
}
// Tests never receive production credentials, even when the build runs on Vercel.
const testEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) =>
  !/(?:SECRET|TOKEN|PASSWORD|DATABASE|POSTGRES|PGHOST|PGUSER|RESEND|ADMIN_PASSWORD|OWNER_EMAIL)/i.test(key)))
Object.assign(testEnv, { NODE_ENV: 'test', DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
  AUTH_SECRET: 'POWER_PRIVATE_ENV_CANARY_auth', RESEND_API_KEY: 'POWER_PRIVATE_ENV_CANARY_email' })
run(['scripts/check-public-env.mjs'])
run(['node_modules/typescript/bin/tsc', '--noEmit'], testEnv)
run(['node_modules/vitest/vitest.mjs', 'run', '--maxWorkers=2'], testEnv)
run(['node_modules/next/dist/bin/next', 'build'])
run(['scripts/check-public-env.mjs', '--bundle'])
