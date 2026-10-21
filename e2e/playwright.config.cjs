const { defineConfig } = require('@playwright/test')
module.exports = defineConfig({
  testDir: __dirname, testMatch: '*.spec.cjs', timeout: 60000, retries: 1, workers: 1,
  reporter: 'list', use: { baseURL: 'https://powerprimeur.com', actionTimeout:15000, trace: 'off', screenshot: 'off' },
  projects: [
    { name: 'mobile-320', use: { viewport: { width: 320, height: 740 } } },
    { name: 'mobile-390', use: { viewport: { width: 390, height: 844 } } },
    { name: 'tablet', use: { viewport: { width: 768, height: 1024 } } },
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
  ],
})
