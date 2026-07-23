/**
 * Cross-browser + mobile smoke QA.
 *
 *   npm run build && npm start   # or a running dev server
 *   npm run test:qa              # QA_BASE_URL defaults to http://localhost:3000
 *
 * Loads each public route across chromium/firefox/webkit at mobile/tablet/desktop,
 * capturing screenshots + horizontal-overflow + page errors. Exits non-zero on any issue,
 * so it can gate a pre-launch check. Not a substitute for a final human pass on a real device.
 */
const { chromium, firefox, webkit } = require('@playwright/test')
const fs = require('fs')
const path = require('path')

const BASE = process.env.QA_BASE_URL || 'http://localhost:3000'
const OUT = path.join(__dirname, 'screenshots')

const ENGINES = [['chromium', chromium], ['firefox', firefox], ['webkit', webkit]]
const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844, mobile: true },
  { name: 'tablet', width: 768, height: 1024, mobile: false },
  { name: 'desktop', width: 1440, height: 900, mobile: false },
]
// dev-server console noise to ignore (safe on `next dev`)
const IGNORE = [/React DevTools/i, /Fast Refresh/i, /\[HMR\]/i, /favicon/i, /Download the React/i]
const isNoise = (t) => IGNORE.some((r) => r.test(t))
const slug = (r) => (r === '/' ? 'home' : r.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, ''))

async function discoverAppRoute() {
  const b = await chromium.launch()
  const p = await b.newPage()
  await p.goto(BASE + '/', { waitUntil: 'load', timeout: 30000 })
  const href = await p.$$eval('a[href^="/app/"]', (as) => (as[0] ? new URL(as[0].href).pathname : null)).catch(() => null)
  await b.close()
  return href
}

;(async () => {
  fs.mkdirSync(OUT, { recursive: true })
  const appRoute = await discoverAppRoute()
  const ROUTES = ['/', '/about', '/privacy', '/account', ...(appRoute ? [appRoute] : [])]
  console.log('base:', BASE, '| routes:', ROUTES.join(', '))

  const results = []
  for (const [ename, etype] of ENGINES) {
    const browser = await etype.launch()
    for (const vp of VIEWPORTS) {
      const opts = { viewport: { width: vp.width, height: vp.height } }
      if (vp.mobile && ename !== 'firefox') { opts.isMobile = true; opts.hasTouch = true; opts.deviceScaleFactor = 3 }
      const ctx = await browser.newContext(opts)
      for (const route of ROUTES) {
        const page = await ctx.newPage()
        const errors = []
        page.on('console', (m) => { if (m.type() === 'error' && !isNoise(m.text())) errors.push('console: ' + m.text().slice(0, 160)) })
        page.on('pageerror', (e) => errors.push('PAGEERROR: ' + String(e.message).slice(0, 160)))
        let status = 0, overflow = null, ok = true, note = ''
        try {
          const resp = await page.goto(BASE + route, { waitUntil: 'load', timeout: 30000 })
          status = resp ? resp.status() : 0
          await page.waitForTimeout(1400)
          const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth }))
          overflow = m.sw - m.cw
          await page.screenshot({ path: path.join(OUT, `${ename}_${vp.name}_${slug(route)}.png`) })
        } catch (e) { ok = false; note = String(e.message).slice(0, 120) }
        results.push({ engine: ename, vp: vp.name, route, status, overflow, errors, ok, note })
        await page.close()
      }
      await ctx.close()
    }
    await browser.close()
  }

  const issues = []
  let md = `# Cross-browser + mobile QA — ${BASE}\n\n| engine | viewport | route | status | h-overflow | errors |\n|---|---|---|---|---|---|\n`
  for (const r of results) {
    const ov = r.overflow == null ? '—' : r.overflow > 1 ? `⚠ +${r.overflow}px` : 'ok'
    md += `| ${r.engine} | ${r.vp} | ${r.route} | ${r.ok ? r.status : 'FAIL'} | ${ov} | ${r.errors.length ? '⚠ ' + r.errors.length : 'ok'} |\n`
    if (!r.ok) issues.push(`${r.engine}/${r.vp}${r.route}: load FAILED — ${r.note}`)
    if (r.overflow > 1) issues.push(`${r.engine}/${r.vp}${r.route}: horizontal overflow +${r.overflow}px`)
    for (const e of r.errors) issues.push(`${r.engine}/${r.vp}${r.route}: ${e}`)
  }
  md += `\n## Issues (${issues.length})\n` + (issues.length ? issues.map((i) => '- ' + i).join('\n') : '- none') + '\n'
  fs.writeFileSync(path.join(OUT, 'report.md'), md)
  console.log(`\n=== ISSUES (${issues.length}) ===\n` + (issues.length ? issues.join('\n') : 'none'))
  console.log(`\n${results.length} cells · screenshots + report in ${OUT}`)
  process.exit(issues.length ? 1 : 0)
})().catch((e) => { console.error('FATAL', e); process.exit(1) })
