// End-to-end: fake AO3 (fixture pages) + local site, run the real bookmarklet, open Wrapped in a popup.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const { page: ao3page, SAMPLE } = require('./fixture.js');
const PUB = path.join(__dirname, '..', 'public');
const mime = f => ({ '.js': 'application/javascript', '.html': 'text/html', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png' })[path.extname(f)] || 'text/plain';
(async () => {
  const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome' });
  const ctx = await b.newContext({ viewport: { width: 1200, height: 900 } });
  const errs = [];
  // 3 pages of history; page 3 holds a 2025 entry so the year cut-off stops there
  const many = Array.from({ length: 20 }, (_, i) => ({ ...SAMPLE[0], id: 500 + i, t: 'Fic ' + i, lv: '1' + (i % 9) + ' Oct 2026', v: 1 + (i % 3) }));
  const pages = { 1: ao3page(many, { pageNo: 1, last: 3 }), 2: ao3page(SAMPLE.slice(0, 4), { pageNo: 2, last: 3 }), 3: ao3page(SAMPLE.slice(4), { pageNo: 3, last: 3 }) };
  let hits = 0, page429 = true;
  await ctx.route('https://archiveofourown.org/**', async route => {
    const u = new URL(route.request().url());
    if (u.pathname.endsWith('/readings')) {
      hits++;
      const n = +(u.searchParams.get('page') || 1);
      if (n === 2 && page429) { page429 = false; return route.fulfill({ status: 429, headers: { 'Retry-After': '1' }, body: 'Retry later' }); }
      return route.fulfill({ status: 200, contentType: 'text/html', body: pages[n] || ao3page([], { pageNo: n, last: 3 }) });
    }
    return route.fulfill({ status: 200, contentType: 'text/html', body: '<html><body><ul><li id="greeting"><a href="/users/me">Hi, me!</a></li></ul><h1>AO3 home</h1></body></html>' });
  });
  await ctx.route('https://ficwrapped.pages.dev/**', async route => {
    const u = new URL(route.request().url());
    let f = path.join(PUB, decodeURIComponent(u.pathname));
    if (u.pathname.startsWith('/api/')) return route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":false,"error":"not_found"}' });
    if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
    if (!fs.existsSync(f)) return route.fulfill({ status: 404, body: 'nf' });
    return route.fulfill({ status: 200, contentType: mime(f), body: fs.readFileSync(f) });
  });
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push('ao3: ' + e.message));
  await p.goto('https://archiveofourown.org/');
  // what the bookmark does
  await p.evaluate(() => { var s = document.createElement('script'); s.src = 'https://ficwrapped.pages.dev/c.js?t=' + Date.now(); document.body.appendChild(s); });
  await p.waitForFunction(() => document.querySelector('#ficwrapped-panel') && document.querySelector('#ficwrapped-panel').shadowRoot.getElementById('start'));
  await p.evaluate(() => document.querySelector('#ficwrapped-panel').shadowRoot.getElementById('start').click());
  await p.waitForFunction(() => document.querySelector('#ficwrapped-panel').shadowRoot.getElementById('open'), null, { timeout: 30000 });
  const doneText = await p.evaluate(() => document.querySelector('#ficwrapped-panel').shadowRoot.querySelector('h2').textContent);
  const [pop] = await Promise.all([ctx.waitForEvent('page'), p.evaluate(() => document.querySelector('#ficwrapped-panel').shadowRoot.getElementById('open').click())]);
  pop.on('pageerror', e => errs.push('site: ' + e.message));
  await pop.waitForFunction(() => document.getElementById('wrapped').classList.contains('on'), null, { timeout: 15000 });
  const res = await pop.evaluate(() => ({ title: document.getElementById('wTitle').textContent, works: STATS.works, ids: IDS.length, saved: !!localStorage.getItem('fw-data') }));
  await pop.screenshot({ path: '/tmp/e2e-wrapped.png' });
  console.log(JSON.stringify({ doneText, hits, res, errs }));
  if (res.works !== 23 || errs.length) process.exit(1);
  await b.close();
})();
