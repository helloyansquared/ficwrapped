# FicWrapped: AO3 Wrapped 2026, made from your own History

**FicWrapped makes your AO3 Wrapped (a Spotify-Wrapped-style year in review) from your Archive of Our Own History, inside your own browser. It never asks for your AO3 password and uploads nothing.** Try it at **https://ficwrapped.pages.dev/**.

AO3 has no official Wrapped. Fan-made tools get your History in one of three ways: by asking for your password or session cookie, by running in your logged-in browser, or by having you paste pages. FicWrapped uses the last two.

## How it works

1. A bookmarklet loads [`c.js`](src/c.js) on archiveofourown.org.
2. `c.js` fetches only `/users/<you>/readings?page=N` (plus `?show=to-read` if you ask for Marked for Later), about one page every 1.1 seconds, and stops at the start of the chosen year. It waits when AO3 answers 429 / "Retry later".
3. [`core.js`](public/core.js) parses each History entry: title, authors, fandoms, rating, categories, warnings, relationships, characters, additional tags, words, chapters, kudos, hits, last visited date, visit count.
4. You click **Open my Wrapped**; the list goes to the FicWrapped tab with `postMessage` (origin-checked both ways). No server receives it.
5. [`cards.js`](public/cards.js) draws 1080×1920 cards on a canvas: totals, top fandoms, ships, characters, tags, ratings, most-visited fic, longest fic, months, reader type and a summary card.

On phones, the bookmarklet works from Safari and Chrome bookmarks, or you can paste History pages (HTML or plain text) into the page.

## What the numbers mean

| | |
|---|---|
| Year | A work counts for 2026 if you **last** visited it in 2026 (AO3 keeps only the latest visit). |
| Fics | Each work once. Opened, not necessarily finished. |
| Words | The work's full word count. |
| Visits | AO3's "Visited N times" counter. |
| Reading time | words ÷ 250 per minute. |

## Supporter Pack

The Wrapped is free. An optional $3.99 Supporter Pack (Dodo Payments, license key checked by the Pages Function in `functions/api/license.js`) adds a printable A4 poster (PDF/PNG), cards without the web address, and a CSV plus searchable offline page of your loaded History.

## Development

```
python3 build.py https://ficwrapped.pages.dev/ pdt_PRODUCTID   # writes public/
node test/core.test.js                                          # parser + stats
NODE_PATH=$(npm root -g) node test/e2e.js                       # bookmarklet against a mocked AO3 (Playwright)
```

Copy and FAQ live in `src/content.py`. Cloudflare Pages: no build command, output directory `public`.

By [yesyanyan](https://www.tumblr.com/yesyanyan) (YanSquared), who also makes [FicToEpub](https://fictoepub.pages.dev/), the free AO3 HTML to EPUB converter. Not affiliated with the Organization for Transformative Works or the Archive of Our Own. Contact: hello@yansquared.com
