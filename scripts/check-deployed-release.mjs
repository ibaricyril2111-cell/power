const expected = process.argv[2]
if (!/^[a-f0-9]{40}$/.test(expected || '')) throw new Error('Expected commit SHA required')
const url = 'https://powerprimeur.com/api/release'
for (let attempt = 0; attempt < 72; attempt++) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(10000), cache: 'no-store' })
    if (response.ok) {
      const data = await response.json()
      if (data.project === 'power' && data.commit === expected) {
        console.log('Production POWER serves the verified commit.'); process.exit(0)
      }
    }
  } catch {}
  await new Promise(resolve => setTimeout(resolve, 5000))
}
throw new Error('Production POWER did not serve the expected commit within the deployment window')
