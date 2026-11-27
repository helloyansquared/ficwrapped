#!/usr/bin/env python3
"""Build the public site.
Usage: python3 build.py https://ficwrapped.yansquared.com/ [pdt_PRODUCTID]
- public/index.html from src/index.html (+ FAQ, facts table, JSON-LD from src/content.py)
- public/c.js (the bookmark's collector) from src/c.js
- one page per guide in src/content.py, plus /privacy/
- robots.txt, sitemap.xml, llms.txt, 404.html
Puts the Dodo product id into the page and functions/api/license.js when given."""
import sys, re, json, pathlib, hashlib, html as H, datetime
sys.path.insert(0, str(pathlib.Path(__file__).parent / 'src'))
import content as C

site = sys.argv[1].rstrip('/') + '/'
product = sys.argv[2] if len(sys.argv) > 2 else None
root = pathlib.Path(__file__).parent
pub = root / 'public'
esc = lambda s: H.escape(s, quote=True)
tx = lambda s: H.escape(s, quote=False)
U = lambda slug='': site + (slug + '/' if slug else '')
upd_human = datetime.date.fromisoformat(C.LAST_UPDATED).strftime('%-d %B %Y')
version = hashlib.sha1(b''.join((pub / f).read_bytes() for f in ['core.js', 'cards.js', 'found.js']) + (root / 'src/c.js').read_bytes()).hexdigest()[:8]

FONT_FACES = ''.join(f'@font-face{{font-family:"{fam}";src:url(/fonts/{f}.woff2) format("woff2");font-weight:{w};font-style:{st};font-display:swap}}\n'
  for fam, f, w, st in [("Bricolage Grotesque", "bricolage-grotesque-latin-400-normal", 400, "normal"), ("Bricolage Grotesque", "bricolage-grotesque-latin-600-normal", "500 700", "normal"),
                        ("Bricolage Grotesque", "bricolage-grotesque-latin-800-normal", 800, "normal"), ("Literata", "literata-latin-400-normal", 400, "normal"),
                        ("Literata", "literata-latin-600-normal", 600, "normal"), ("Literata", "literata-latin-400-italic", "400 600", "italic")])
PRELOAD = '<link rel="preload" href="/fonts/bricolage-grotesque-latin-800-normal.woff2" as="font" type="font/woff2" crossorigin>\n'
ORG = {"@type": "Organization", "@id": U() + "#org", "name": "FicWrapped", "url": U(), "logo": {"@type": "ImageObject", "url": U() + "logo.png", "width": 512, "height": 512}, "email": C.EMAIL,
       "sameAs": [C.GITHUB, "https://www.tumblr.com/yesyanyan", "https://x.com/yesyanyan"]}
AUTHOR = {"@type": "Person", "@id": U() + "#author", "name": "yesyanyan", "url": "https://www.tumblr.com/yesyanyan",
          "sameAs": ["https://www.tumblr.com/yesyanyan", "https://x.com/yesyanyan", "https://github.com/helloyansquared"]}
EX = lambda n, w=540: f"{U()}img/examples/{n}-{w}.webp"
EXAMPLES = ["ficwrapped-example-1-cover", "ficwrapped-example-2-fandoms", "ficwrapped-example-3-tags", "ficwrapped-example-4-reader-type", "ficwrapped-example-5-summary"]
human = lambda iso: datetime.date.fromisoformat(iso).strftime('%-d %B %Y')

def faq_html(keys):
    return '\n'.join(f'  <details{" open" if i == 0 else ""}><summary>{tx(C.QA[k][0])}</summary><p>{tx(C.QA[k][1])}</p></details>' for i, k in enumerate(keys))
def faq_ld(keys):
    return {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": C.QA[k][0], "acceptedAnswer": {"@type": "Answer", "text": C.QA[k][1]}} for k in keys]}
def ld(nodes):
    return '<script type="application/ld+json">\n' + json.dumps(nodes, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/') + '\n</script>'

FOOTLINKS = '<nav class="foot" aria-label="Guides"><a href="/">FicWrapped</a>' + ''.join(f'<a href="/{p["slug"]}/">{esc(p["crumb"])}</a>' for p in C.PAGES) + '<a href="/privacy/">Privacy &amp; refunds</a><a href="https://fictoepub.yansquared.com/">FicToEpub</a><a href="https://bottobook.yansquared.com/">BotToBook</a></nav>'
GUIDES = '<ul>' + ''.join(f'<li><a href="/{p["slug"]}/">{tx(p["h1"])}</a></li>' for p in C.PAGES) + '</ul>'

# ── Home ──────────────────────────────────────────────────────────────────────
s = (root / 'src/index.html').read_text()
s = s.replace('<style>\n', '<style>\n' + FONT_FACES, 1)
head = (PRELOAD + f'<link rel="canonical" href="{site}">\n<link rel="icon" href="/favicon.svg" type="image/svg+xml">\n'
        f'<meta property="og:url" content="{site}">\n<meta property="og:image" content="{site}og.png">\n'
        '<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">\n<meta name="twitter:card" content="summary_large_image">\n'
        f'<link rel="preload" as="image" href="/img/examples/ficwrapped-example-4-reader-type-540.webp" type="image/webp" fetchpriority="high">\n'
        '<meta name="msvalidate.01" content="__MSVALIDATE__">')
app = {"@type": "WebApplication", "@id": U() + "#app", "name": "FicWrapped", "alternateName": ["FicWrapped AO3 Wrapped", "AO3 Wrapped 2026"], "url": U(),
       "description": "Fan-made AO3 Wrapped: reads your Archive of Our Own History in your own browser and turns it into shareable year-in-review cards. No password, nothing uploaded.",
       "applicationCategory": "EntertainmentApplication", "operatingSystem": "Windows, macOS, Linux, ChromeOS, iOS, Android", "browserRequirements": "Requires JavaScript. Current Chrome, Edge, Firefox or Safari.",
       "image": U() + "og.png", "isAccessibleForFree": True, "inLanguage": "en", "datePublished": C.PUBLISHED, "dateModified": C.LAST_UPDATED,
       "publisher": {"@id": U() + "#org"}, "author": {"@id": U() + "#author"}, "isPartOf": {"@id": U() + "#site"},
       "screenshot": [EX(n) for n in EXAMPLES],
       "featureList": ["Reads AO3 History with a bookmark, no password", "Paste mode for phones", "Top fandoms, ships, characters and tags",
                       "Most-reread fic, longest fic and reading by month", "Reader type", "Shareable 1080×1920 cards",
                       "Free History CSV and offline History page", "Printable poster (Supporter Pack)"],
       "offers": [{"@type": "Offer", "name": "AO3 Wrapped cards", "price": "0", "priceCurrency": "USD"},
                  {"@type": "Offer", "name": "FicWrapped Supporter Pack", "price": "3.99", "priceCurrency": "USD", "url": U()}]}
home_ld = ld([{"@context": "https://schema.org", **ORG}, {"@context": "https://schema.org", **AUTHOR},
              {"@context": "https://schema.org", "@type": "WebSite", "@id": U() + "#site", "name": "FicWrapped", "url": U(), "inLanguage": "en", "publisher": {"@id": U() + "#org"}},
              {"@context": "https://schema.org", **app}, faq_ld(C.HOME_FAQ)])
for k, v in {'<!--SEO-HEAD-->': head, '<!--LDJSON-->': home_ld, '<!--HOME-FAQ-->': faq_html(C.HOME_FAQ), '<!--FACTS-->': C.facts_table(),
             '<!--GUIDES-->': GUIDES, '{HOME_TITLE}': tx(C.HOME_TITLE), '{HOME_DESC}': esc(C.HOME_DESC),
             '{DEFINITION_REST}': tx(C.DEFINITION.split('AO3 Wrapped ', 1)[1]), '<!--FOOTLINKS-->': FOOTLINKS, '<!--UPDATED-->': upd_human}.items():
    assert k in s, k
    s = s.replace(k, v)

def finish(text):
    text = text.replace('{GITHUB}', C.GITHUB).replace('{EMAIL}', C.EMAIL).replace('__SITE__', site).replace('__VERSION__', version)
    text = text.replace('__MSVALIDATE__', MSVALIDATE)
    if product:
        text = text.replace('__PRODUCT_ID__', product)
    return text
MSVALIDATE = (root / 'src/msvalidate.txt').read_text().strip() if (root / 'src/msvalidate.txt').exists() else ''
if not MSVALIDATE:
    s = s.replace('\n<meta name="msvalidate.01" content="__MSVALIDATE__">', '')
if product:
    assert re.fullmatch(r'pdt_[A-Za-z0-9]+', product)
    fn = root / 'functions/api/license.js'
    fn.write_text(re.sub(r'const PRODUCT_ID = "[^"]*";', f'const PRODUCT_ID = "{product}";', fn.read_text()))
(pub / 'index.html').write_text(finish(s))
(pub / 'c.js').write_text(finish((root / 'src/c.js').read_text()))

# ── userscript (Greasy Fork): core.js + collector inlined, nothing loaded from elsewhere ──
USERSCRIPT_VERSION = '1.0.' + str(int(hashlib.sha1((pub / 'core.js').read_bytes() + (root / 'src/c.js').read_bytes()).hexdigest()[:6], 16) % 100000)
collector = finish((root / 'src/c.js').read_text())
collector = (collector.replace('tap the FicWrapped bookmark again', 'click “Make my AO3 Wrapped” again')
                      .replace('then tap the bookmark again', 'then click "Make my AO3 Wrapped" again')
                      .replace('and tap the bookmark again', 'and click "Make my AO3 Wrapped" again')
                      .replace('Log in again and tap the bookmark.', 'Log in again and click “Make my AO3 Wrapped”.'))
collector = collector.replace('(function () {\n  "use strict";', 'function ficwrappedStart() {\n  "use strict";', 1)
assert collector.rstrip().endswith('})();'), 'collector wrapper changed'
collector = collector.rstrip()[:-len('})();')] + '}\n'
(pub / 'ficwrapped.user.js').write_text(f"""// ==UserScript==
// @name         AO3 Wrapped by FicWrapped (no password)
// @namespace    {site}
// @version      {USERSCRIPT_VERSION}
// @description  Make a Spotify-Wrapped-style year in review of your AO3 reading. Reads your own History pages in this tab, never asks for your password, and opens your cards on FicWrapped.
// @author       yesyanyan (YanSquared)
// @license      MIT
// @homepageURL  {site}
// @supportURL   {C.GITHUB}/issues
// @match        https://archiveofourown.org/*
// @match        https://www.archiveofourown.org/*
// @match        https://ao3.org/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

/* What this script does
   - Adds a "Make my AO3 Wrapped" link to your AO3 user menu and to your History page.
   - When you click it, it reads your own History pages (/users/YOU/readings) in this tab, about one page a second,
     and pauses if AO3 asks it to slow down.
   - When it's done, "Open my Wrapped" opens {site} in a new tab and hands the list to that tab with postMessage.
     Nothing is sent to any server, and it never reads your password or cookies.
   The same code runs as the FicWrapped bookmark: {site}c.js and {site}core.js. Source: {C.GITHUB} */

{(pub / 'core.js').read_text()}

{collector}
(function () {{
  var g = document.querySelector('#greeting a[href^="/users/"]');
  if (!g) return; // logged out: AO3 History is only visible to you while logged in
  function link(text) {{
    var a = document.createElement("a"); a.href = "#"; a.textContent = text;
    a.addEventListener("click", function (e) {{ e.preventDefault(); ficwrappedStart(); }});
    return a;
  }}
  var menu = document.querySelector('#greeting ul.menu, #greeting .dropdown-menu');
  if (menu) {{ var li = document.createElement("li"); li.appendChild(link("Make my AO3 Wrapped")); menu.appendChild(li); }}
  if (/^\\/users\\/[^/]+\\/readings/.test(location.pathname)) {{
    var h = document.querySelector('#main h2.heading, #main h2');
    if (h) {{ var p = document.createElement("p"); p.appendChild(link("✦ Make my AO3 Wrapped")); h.insertAdjacentElement("afterend", p); }}
  }}
}})();
""")


# ── Sub-pages ─────────────────────────────────────────────────────────────────
PAGE_CSS = FONT_FACES + """:root{--ink:#1d1b36;--paper:#fffefa;--violet:#7b5cff;--sun:#ffd23f;--coral:#ff6b57;--mint:#3ddc97;--lilac:#e9e4ff;--soft:#55506e;--bg:#f2efff}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:18px/1.7 Literata,Georgia,serif}
a{color:#4b2fd6;text-underline-offset:3px}h1,h2{font-family:"Bricolage Grotesque",system-ui,sans-serif;line-height:1.1;text-wrap:balance}
.wrap{max-width:760px;margin:0 auto;padding:0 max(4vw,18px)}
.top{background:var(--violet);color:#fff;padding:18px 0 40px;border-bottom:3px solid var(--ink)}.top a{color:#fff}
.brand{font:800 20px "Bricolage Grotesque",system-ui,sans-serif;text-decoration:none;display:inline-flex;gap:10px;align-items:center}
.mark{display:grid;grid-template-columns:repeat(2,10px);gap:3px}.mark i{width:10px;height:10px;border:2px solid var(--ink)}
.mark i:nth-child(1){background:var(--mint)}.mark i:nth-child(2){background:var(--sun)}.mark i:nth-child(3){background:var(--coral)}.mark i:nth-child(4){background:var(--paper)}
.crumbs{font:15px "Bricolage Grotesque",system-ui,sans-serif;margin:22px 0 8px;color:#efeaff}
.top h1{font-size:clamp(32px,5vw,50px);font-weight:800;margin:0}
main{padding:30px 0 50px}
.answer{font-size:20px;background:var(--paper);border:3px solid var(--ink);border-radius:14px;padding:18px 20px;box-shadow:6px 6px 0 var(--ink);margin:0 0 24px}
.cta{display:inline-flex;align-items:center;min-height:50px;padding:0 22px;border:3px solid var(--ink);border-radius:12px;background:var(--sun);color:var(--ink);font:700 17px "Bricolage Grotesque",system-ui,sans-serif;text-decoration:none;box-shadow:5px 5px 0 var(--ink)}
.meta{font:15px "Bricolage Grotesque",system-ui,sans-serif;color:var(--soft);margin:18px 0 28px}
h2{font-size:clamp(24px,3.2vw,32px);font-weight:800;margin:38px 0 10px}li{margin:6px 0}
code{font:.85em ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;background:var(--lilac);padding:1px 6px;border-radius:6px;word-break:break-all}
.facts{border-collapse:collapse;width:100%;margin:14px 0;background:var(--paper);border:3px solid var(--ink);font:16px/1.55 "Bricolage Grotesque",system-ui,sans-serif}
.facts th,.facts td{padding:11px 14px;border-top:2px solid var(--lilac);text-align:left;vertical-align:top}.facts th{width:34%}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
details{border-bottom:2px solid var(--ink);padding:4px 0}summary{cursor:pointer;font:700 18px "Bricolage Grotesque",system-ui,sans-serif;min-height:50px;display:flex;align-items:center}details p{margin:0 0 16px}
.related{background:var(--paper);border:3px solid var(--ink);border-radius:14px;padding:16px 20px;margin-top:34px;font-family:"Bricolage Grotesque",system-ui,sans-serif}.related ul{margin:6px 0 0;padding-left:20px}
footer{background:var(--ink);color:#d9d4ee;font:15px/1.6 "Bricolage Grotesque",system-ui,sans-serif;padding:28px 0}footer a{color:#fff}.foot{display:flex;flex-wrap:wrap;gap:6px 18px;margin-bottom:12px}
:focus-visible{outline:3px solid var(--coral);outline-offset:3px}
.tablewrap{overflow-x:auto;margin:14px 0;clear:both}.methods{min-width:720px;font-size:15px}.methods th,.methods td{min-width:120px}.methods caption{text-align:left;font:600 14px "Bricolage Grotesque",system-ui,sans-serif;color:var(--soft);padding:0 0 8px}.methods th[scope=col]{background:var(--lilac)}
.shot{float:right;width:200px;margin:0 0 16px 22px}.shot img{width:100%;height:auto;border:3px solid var(--ink);border-radius:14px;box-shadow:5px 5px 0 var(--ink);display:block}.shot figcaption{font:13px "Bricolage Grotesque",system-ui,sans-serif;color:var(--soft);margin-top:8px}
@media (max-width:640px){.shot{float:none;width:140px;margin:0 0 18px}}"""

def shell(title, desc, canon, h1, crumb, body_html, ldnodes, robots=None, updated=None, ogimg=None):
    upd = human(updated or C.LAST_UPDATED)
    oi, ow, oh, oa = ogimg or (f"{site}og.png", 1200, 630, "FicWrapped: AO3 Wrapped 2026 example cards")
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{tx(title)}</title>
<meta name="description" content="{esc(desc)}">
{f'<meta name="robots" content="{robots}">' if robots else f'<link rel="canonical" href="{canon}">'}
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="article"><meta property="og:site_name" content="FicWrapped"><meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(desc)}">
<meta property="og:url" content="{canon}"><meta property="og:image" content="{oi}"><meta property="og:image:width" content="{ow}"><meta property="og:image:height" content="{oh}"><meta property="og:image:alt" content="{esc(oa)}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{esc(title)}"><meta name="twitter:description" content="{esc(desc)}">
<meta name="theme-color" content="#7b5cff">
{PRELOAD}{ld(ldnodes) if ldnodes else ''}
<style>{PAGE_CSS}</style>
<script src="/found.js" defer></script>
</head>
<body>
<header class="top"><div class="wrap">
  <a class="brand" href="/"><span class="mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>FicWrapped</a>
  <nav class="crumbs" aria-label="Breadcrumb"><a href="/">FicWrapped</a> › {tx(crumb)}</nav>
  <h1>{tx(h1)}</h1>
</div></header>
<main class="wrap">
{body_html}
</main>
<footer><div class="wrap">{FOOTLINKS}FicWrapped is an independent fan-made tool. It is not affiliated with, endorsed by or connected to the Organization for Transformative Works or the Archive of Our Own. Questions: <a href="mailto:{C.EMAIL}">{C.EMAIL}</a>. Last updated: {upd}.</div></footer>
</body>
</html>
"""

def crumbs_ld(name, url):
    return {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "FicWrapped", "item": U()},
        {"@type": "ListItem", "position": 2, "name": name, "item": url}]}

PAGES = {p['slug']: p for p in C.PAGES}
for p in C.PAGES:
    url = U(p['slug'])
    img = p.get('image')
    fig = (f'<figure class="shot"><img loading="lazy" src="/img/examples/{img[0]}-270.webp" srcset="/img/examples/{img[0]}-540.webp 2x" width="270" height="480" alt="{esc(img[1])}"><figcaption>Example card, made from sample data</figcaption></figure>\n') if img else ''
    body = (f'<p class="answer">{tx(p["answer"])}</p>\n<a class="cta" href="/">{p.get("cta", "Make my AO3 Wrapped")}</a>\n'
            f'<p class="meta">Last updated: <time datetime="{p["updated"]}">{human(p["updated"])}</time>. Free, no password, nothing uploaded.</p>\n'
            + fig + p['body'].replace('{FACTS}', '<h2>How the numbers are counted</h2>' + C.facts_table()).replace('{METHODS}', C.methods_table()).replace('{TOOLS}', C.tools_table())
            + f'\n<h2>Questions</h2>\n{faq_html(p["faq"])}\n'
            + '<aside class="related"><b>Related guides</b><ul>' + ''.join(f'<li><a href="/{s2}/">{tx(PAGES[s2]["h1"])}</a></li>' for s2 in p['links'])
            + '<li><a href="/">FicWrapped: make your AO3 Wrapped</a></li></ul></aside>')
    article = {"@context": "https://schema.org", "@type": "Article", "headline": p['h1'], "description": p['description'], "url": url,
               "inLanguage": "en", "datePublished": C.PUBLISHED, "dateModified": p['updated'], "image": EX(img[0]) if img else U() + "og.png",
               "author": AUTHOR, "publisher": {"@type": "Organization", "@id": U() + "#org", "name": "FicWrapped", "url": U()},
               "isPartOf": {"@id": U() + "#site"}, "mainEntityOfPage": url}
    out = pub / p['slug']; out.mkdir(exist_ok=True)
    og = (EX(img[0]), 540, 960, img[1]) if img else None
    (out / 'index.html').write_text(finish(shell(p['title'], p['description'], url, p['h1'], p['crumb'], body, [crumbs_ld(p['crumb'], url), article, faq_ld(p['faq'])], updated=p['updated'], ogimg=og)))

priv = f"""<p class="answer">FicWrapped reads your AO3 History and makes your Wrapped inside your own browser. Your History is never uploaded to us, stored by us or seen by us. This page lists the few things that do leave your device.</p>
<p class="meta">Last updated: <time datetime="{C.LAST_UPDATED}">{upd_human}</time></p>
<h2>Your AO3 History</h2><p>The bookmark runs in your AO3 tab, fetches your own History pages from AO3, and passes the list straight to the FicWrapped tab with the browser's postMessage. Pasted or dropped pages are read by JavaScript on this page. Your latest Wrapped data is kept in your browser's local storage so it's still there after a reload; clear it by clearing this site's data in your browser.</p>
<h2>Your AO3 login</h2><p>FicWrapped never asks for your AO3 password and the bookmark doesn't read your cookies. You stay logged in to AO3 the normal way.</p>
<h2>License keys</h2><p>When you activate the Supporter Pack, your license key is sent to a small checking service (a Cloudflare Pages Function) that asks Dodo Payments whether the key is valid for FicWrapped. The key and an activation ID are saved in your browser's local storage. The checking service doesn't keep the key and never receives your History.</p>
<h2>Payments</h2><p>Payments are processed by Dodo Payments, the merchant of record, which handles your card details, sales tax and receipts under its own privacy policy. We never see your card number.</p>
<h2>Hosting and logs</h2><p>The site is hosted on Cloudflare Pages. Like any web host, Cloudflare processes standard request data such as IP addresses to deliver and protect the site. FicWrapped uses no cookies, ads or third-party analytics. To learn which sites and AI assistants send readers, the first page you open sends one anonymous note to a database we keep with our host, Cloudflare: the name of the site you came from (such as “tumblr” or “chatgpt”, never the full address), the page and your country. The first time in a visit that your Wrapped opens, and the first time you save or share a card, it sends one more note of the same kind (just “made”, “saved” or “shared”, with the same site name and page; never your numbers, year or what's on the cards). Clicking the Supporter Pack button and unlocking it are counted the same way. After you save or share a card, a small optional card asks how you found the site; if you answer, your choice and anything you type in the optional box are stored the same way. Cloudflare works out the country from the connection; your IP address is used only briefly, in memory, to stop spam and is never stored, and these notes are deleted after 180 days. None of this includes your AO3 History, username, IP address or any ID.</p>
<h2>Refunds</h2><p>If the Supporter Pack doesn't work for you, email <a href="mailto:{C.EMAIL}">{C.EMAIL}</a> within 14 days of buying and you'll get a refund.</p>
<h2>Contact</h2><p>FicWrapped is an independent tool by YanSquared. Email <a href="mailto:{C.EMAIL}">{C.EMAIL}</a>.</p>"""
(pub / 'privacy').mkdir(exist_ok=True)
(pub / 'privacy/index.html').write_text(finish(shell('Privacy & Refunds | FicWrapped', 'How FicWrapped handles your AO3 History (it stays in your browser), license keys, payments and refunds.',
                                              U('privacy'), 'Privacy & refunds', 'Privacy & refunds', priv, [crumbs_ld('Privacy & refunds', U('privacy'))])))
(pub / '404.html').write_text(finish(shell('Page not found | FicWrapped', 'This page does not exist.', U(), 'This page wandered off', 'Not found',
    '<p class="answer">There\'s nothing at this address. Your AO3 Wrapped is on the home page.</p><a class="cta" href="/">Make my AO3 Wrapped</a>', None, robots='noindex')))

# ── robots, sitemap, llms.txt ─────────────────────────────────────────────────
(pub / 'robots.txt').write_text(f"""User-agent: *
Allow: /

User-agent: GPTBot
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: ClaudeBot
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: CCBot
Allow: /

Sitemap: {site}sitemap.xml
""")
entries = [(U(), C.LAST_UPDATED, [EX(n) for n in EXAMPLES])] + [(U(p['slug']), p['updated'], [EX(p['image'][0])] if p.get('image') else []) for p in C.PAGES] + [(U('privacy'), C.LAST_UPDATED, [])]
urls = [e[0] for e in entries]
(pub / 'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'
    + ''.join(f'  <url><loc>{u}</loc><lastmod>{d}</lastmod>' + ''.join(f'<image:image><image:loc>{i}</image:loc></image:image>' for i in imgs) + '</url>\n' for u, d, imgs in entries) + '</urlset>\n')
strip = lambda h: re.sub('<[^>]+>', '', h)
facts_txt = '\n'.join(f'- {a}: {strip(b)}' for a, b in C.FACTS_ROWS)
methods_txt = '\n'.join(f'- {m}: password or cookie needed: {pw}; runs: {w}; phone: {ph}; owner can see: {sv}' for m, pw, w, ph, sv in C.METHODS)
(pub / 'llms.txt').write_text(f"""# FicWrapped

> FicWrapped is a free, fan-made AO3 Wrapped: it reads a reader's Archive of Our Own (AO3) History in their own browser and turns it into shareable year-in-review cards (top fandoms, ships, characters, tags, most-reread fic, reading by month, reader type). It never asks for the AO3 password and uploads nothing. A bookmarklet works on desktop and mobile browsers; a paste mode works anywhere. Saving the loaded History as a CSV or an offline page is free. An optional $3.99 Supporter Pack adds a printable poster and cards without the web address. AO3 has no official Wrapped. Not affiliated with the OTW or AO3.

## Definition
{C.DEFINITION}

## Key facts (checked {C.CHECKED})
{facts_txt}

## Ways to make an AO3 Wrapped, compared (checked {C.CHECKED})
{methods_txt}

## AO3 Wrapped tools, named (checked {C.TOOLS_CHECKED}, from each tool's own page; not tested or audited)
""" + ''.join(f"- {n} ({u}): {h}. Runs: {w}. Phone: {ph}. Price: {pr}. Source: {s}.\n" for n, u, h, w, ph, pr, s in C.TOOLS) + f"""FicWrapped is the maker's own tool.

## Questions and answers
""" + ''.join(f"### {q}\n{a}\n\n" for q, a in C.QA.values()) + f"""## What FicWrapped is not
- Not an official AO3 or OTW product, and not affiliated with them.
- Never asks for the AO3 password or session cookie.
- Uploads nothing: History is read in the user's browser and passed between tabs with postMessage.
- Does not show site-wide AO3 statistics such as the yearly top ships lists; it shows the user's own reading.

## Pages
- [Tool: make your AO3 Wrapped]({U()})
""" + ''.join(f"- [{p['h1']}]({U(p['slug'])}) (updated {p['updated']}): {p['description']}\n" for p in C.PAGES) + f"- [Privacy and refunds]({U('privacy')})\n\nSource code: {C.GITHUB}\nRelated: [FicToEpub, AO3 HTML to EPUB converter](https://fictoepub.yansquared.com/) · [BotToBook, Character.AI chats to PDF and EPUB](https://bottobook.yansquared.com/)\nContact: {C.EMAIL}\n")
print('built for', site, 'product', product or '(none yet)', 'version', version, '·', len(urls), 'urls')
