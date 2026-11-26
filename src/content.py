# All FicWrapped page copy lives here. FAQ text is used for both the visible FAQ and FAQPage JSON-LD.
# Facts about AO3 checked against the otwarchive source (readings controller, Pagy limit = ITEMS_PER_PAGE 25,
# "Turn on History" preference text) on 25 November 2026.
PUBLISHED = "2026-11-25"
LAST_UPDATED = "2026-11-25"   # home page; each guide has its own "updated"
CHECKED = "25 November 2026"
EMAIL = "hello@yansquared.com"
GITHUB = "https://github.com/helloyansquared/ficwrapped"

HOME_TITLE = "AO3 Wrapped 2026: Free, No Password Needed | FicWrapped"
HOME_DESC = "Free fan-made AO3 Wrapped 2026. A bookmark reads your AO3 History in your own browser and makes shareable cards: top fandoms, ships, tags, reader type. No password."

DEFINITION = ("AO3 Wrapped is a fan-made, Spotify-Wrapped-style year in review of your reading on Archive of Our Own (AO3). "
              "AO3 has no official one. FicWrapped builds it from your AO3 History, inside your own browser.")

FACTS_ROWS = [
    ("Official AO3 Wrapped", f"None. As of {CHECKED}, AO3 has no official Wrapped or personal year-in-review feature."),
    ("Where the data comes from", "Your AO3 History, at <code>archiveofourown.org/users/your-name/readings</code>. It shows 25 works per page, most recently visited first, and only you can open it, while logged in."),
    ("Which fics count for 2026", "A fic counts for 2026 if you last opened it in 2026. AO3 stores only the most recent visit date for each work, so a fic read in March and reopened in October counts in October."),
    ("Fics", "Each work counts once, however many times you opened it. Works you opened but didn't finish still count: AO3 records visits, not finished reads."),
    ("Words", "The work's full word count as shown on AO3, not the chapters you actually read."),
    ("Visits", "AO3's own \"Visited N times\" counter for each work, which is how the most-reread card is chosen."),
    ("Deleted works", "Counted separately. AO3 keeps only the date for them, so they aren't in the fandom or tag totals."),
    ("Reading time", "Total words ÷ 250 words a minute."),
    ("Speed", "The bookmark reads about one History page (25 fics) a second. If AO3 asks it to slow down, it waits and carries on."),
    ("What you need", "An AO3 account, logged in, with History switched on (AO3 Preferences → Turn on History)."),
    ("FicWrapped", "A free, open-source fan tool first published on 25 November 2026. It never asks for your AO3 password and uploads nothing."),
]

def facts_table():
    rows = "".join(f"<tr><th scope=\"row\">{a}</th><td>{b}</td></tr>" for a, b in FACTS_ROWS)
    return f'<table class="facts"><caption class="sr">How FicWrapped counts your AO3 History (checked {CHECKED})</caption>{rows}</table>'

# Ways people make an AO3 Wrapped. Described by method, not by naming tools. (checked 25 November 2026)
METHODS = [
    ("Website that logs in for you", "Yes, your AO3 password", "Their server", "Yes", "Everything your account can see, until you change your password"),
    ("Colab notebook", "Usually your username and password, or a session cookie", "Google's servers", "Awkward", "Depends on the code; the notebook runs with your login"),
    ("Browser extension", "No", "Your browser", "Only where the browser supports extensions (e.g. Firefox for Android)", "Whatever its permissions allow"),
    ("Bookmarklet (FicWrapped)", "No", "Your own AO3 tab", "Yes, Safari and Chrome", "Nothing: the list goes from your AO3 tab to the FicWrapped tab"),
    ("Paste History pages (FicWrapped)", "No", "The FicWrapped page", "Yes", "Only what you paste"),
]

def methods_table():
    head = "<tr><th scope=\"col\">Method</th><th scope=\"col\">Needs your AO3 password or cookie?</th><th scope=\"col\">Where it runs</th><th scope=\"col\">Works on a phone</th><th scope=\"col\">What the tool's owner can see</th></tr>"
    rows = "".join(f"<tr><th scope=\"row\">{m}</th><td>{p}</td><td>{w}</td><td>{ph}</td><td>{s}</td></tr>" for m, p, w, ph, s in METHODS)
    return f'<div class="tablewrap"><table class="facts methods"><caption>Ways to make an AO3 Wrapped, compared (checked {CHECKED})</caption>{head}{rows}</table></div>'

QA = {
    "official": ("Is there an official AO3 Wrapped?",
        "No. AO3 doesn't make a personal year-in-review. Every AO3 Wrapped is fan-made from your AO3 History. FicWrapped is one of them: it reads your History in your own browser and turns it into shareable cards, without asking for your password."),
    "how": ("How do I do AO3 Wrapped?",
        "Drag the AO3 Wrapped bookmark from ficwrapped.yansquared.com to your bookmarks bar, open AO3 while logged in and click it. It reads your History pages for the year, then you click Open my Wrapped to see and save your cards. It takes about a minute for most readers."),
    "password": ("Does FicWrapped need my AO3 password?",
        "No. You log in to AO3 yourself, on AO3, as usual. The bookmark runs in that AO3 tab, reads only your History pages and passes the list to the FicWrapped tab you open. It never sees your password or cookies, and nothing is uploaded to a server."),
    "nopass": ("Is there an AO3 Wrapped that doesn't need my password?",
        "Yes. Tools that run in your own logged-in browser, like bookmarklets and some extensions, or that read History pages you paste, never receive your AO3 password. FicWrapped works both ways. Websites and most Colab notebooks that log in for you do need it."),
    "phone": ("Can I make my AO3 Wrapped on my phone?",
        "Yes. On iPhone Safari and Android Chrome you can save the bookmark code as a bookmark and tap it on AO3; the steps are on the home page. If that's fiddly, copy your History pages one at a time and paste them into FicWrapped instead."),
    "unfinished": ("Why does my Wrapped count fics I didn't finish?",
        "AO3 History records every work you open, not every work you finish, and it shows each work's full word count. So the totals are fics and words you opened. Most AO3 Wrapped tools count the same way."),
    "months": ("Why do some months look empty?",
        "AO3 keeps only the last time you visited each work. If you read a fic in February and reopened it in November, it shows up in November. Fics you removed from your History, or read while logged out or with History off, aren't counted."),
    "empty": ("Why is my AO3 History empty?",
        "AO3 only saves History while it's switched on. Check Preferences on AO3 and turn on History. If you cleared your History, those visits are gone and no tool can get them back."),
    "slow": ("How long does it take?",
        "About one second per History page of 25 fics, so 400 fics take around 20 seconds. If AO3 asks it to slow down, FicWrapped waits and continues on its own. You can also stop early and use what's loaded."),
    "free": ("Is FicWrapped free?",
        "Yes, the whole Wrapped is free. An optional $3.99 Supporter Pack adds a printable poster and cards without the web address. Saving your History as a CSV or an offline page is free."),
    "forwho": ("Who is FicWrapped for, and when should I use something else?",
        "FicWrapped is for AO3 readers who want a year in review of their own reading without giving a website their password. It works in any browser that can run a bookmark, including phones, or by pasting your History. Use something else if you want statistics for all of AO3 (AO3's yearly statistics posts cover the whole archive) or numbers for works you posted (your AO3 dashboard has Stats for those). If your AO3 History was switched off, FicWrapped can only count what History recorded."),
    "safe": ("Is it safe to run a bookmark on AO3?",
        "A bookmark runs code in the AO3 tab, so only use ones you can read. FicWrapped's script is short, published at ficwrapped.yansquared.com/c.js and on GitHub, and it only fetches your own History pages. If you'd rather not run any code on AO3, use the paste option."),
    "blocked": ("Will AO3 block me for using it?",
        "FicWrapped reads your History at about the pace of someone clicking Next, and it backs off when AO3 says to retry later. That's far gentler than downloading fics. If AO3 is down or under maintenance, wait and try again later."),
    "lastyear": ("Can I make an AO3 Wrapped for last year?",
        "Partly. Choose 2025 in the Year menu. Because AO3 keeps only the last date you visited each work, fics you reopened in 2026 have moved to 2026, so a 2025 Wrapped made now is incomplete."),
    "topships": ("Does FicWrapped show the AO3 top ships of 2026?",
        "No. The AO3 top ships lists you see each year are site-wide rankings compiled by fans from AO3's public statistics. FicWrapped shows your own top ships: the relationships tagged on the fics you opened."),
    "fictoepub": ("Can I also download the fics in my Wrapped?",
        "FicWrapped links each fic in the History export to its AO3 page. To turn AO3's HTML downloads into an EPUB for Kindle, Kobo or Apple Books, use FicToEpub, a free converter by the same maker."),
    "whosees": ("Can other people see my AO3 History?",
        "No. AO3 only lets the account owner open their History, and only while logged in. It lists each work you opened, the last date you visited it and how many times. You can delete single entries, clear it, or switch it off in Preferences."),
    "where": ("Where is my AO3 History?",
        "Log in, click your name in the top menu and choose History, or go to archiveofourown.org/users/your-name/readings. Marked for Later is a tab on the same page."),
    "keepoff": ("If I switch History off, is my old History deleted?",
        "No. AO3 says works you visited while History was on are still saved after you switch it off; you just have to switch it back on to see them. To remove them, use Clear History, which can't be undone."),
}
HOME_FAQ = ["official", "how", "password", "phone", "unfinished", "months", "empty", "slow", "lastyear", "free", "forwho", "safe", "blocked", "topships", "fictoepub"]

PAGES = [
    {
        "slug": "how-to-do-ao3-wrapped",
        "updated": "2026-11-25",
        "crumb": "How to do AO3 Wrapped",
        "title": "How to Do AO3 Wrapped 2026: 1-Minute Tutorial | FicWrapped",
        "h1": "How do I do AO3 Wrapped?",
        "description": "AO3 Wrapped tutorial for 2026: add a bookmark, click it on AO3, save your cards. About a minute, free, and nobody gets your AO3 password.",
        "answer": "AO3 doesn't make a Wrapped, so you build one from your AO3 History. With FicWrapped: drag the AO3 Wrapped bookmark to your bookmarks bar, open AO3 while logged in, click the bookmark, wait while it reads your History, then click Open my Wrapped. Your cards open in a new tab, ready to save or share.",
        "image": ("ficwrapped-example-2-fandoms", "Example AO3 Wrapped card showing a reader's top four fandoms"),
        "body": """<h2>Before you start</h2>
<ul><li>Be logged in to AO3 in this browser.</li><li>Make sure History is switched on (AO3 Preferences → Turn on History). AO3 can't show visits it never saved.</li><li>Use a computer if you can. On a phone, see <a href="/ao3-wrapped-on-phone/">AO3 Wrapped on your phone</a>.</li></ul>
<h2>AO3 Wrapped tutorial, step by step</h2>
<ol>
<li><b>Add the bookmark.</b> On <a href="/">the FicWrapped home page</a>, drag the purple <b>✦ AO3 Wrapped</b> button to your bookmarks bar. If you can't see the bar, press Ctrl+Shift+B (Cmd+Shift+B on a Mac).</li>
<li><b>Open AO3.</b> Go to archiveofourown.org and log in as usual. Any AO3 page works.</li>
<li><b>Click the bookmark.</b> A small FicWrapped box appears in the corner of AO3. Pick the year (2026 is the default), and tick <i>Also save my Marked for Later list</i> if you want it in your export.</li>
<li><b>Click Read my History.</b> The box reads your History pages one at a time, 25 fics per page and about one page a second, and stops when it reaches fics you last opened before the year started.</li>
<li><b>Click Open my Wrapped.</b> A new tab opens with your cards. Tap the right side of a card to go forward. Use <i>Share this card</i> on a phone, or <i>Save image</i> and <i>Save all cards</i> on a computer.</li>
</ol>
<h2>What's in your Wrapped</h2>
<p>Up to twelve cards: how many fics and words you opened, your top fandoms, ships, characters and additional tags, how your ratings split, the fic you visited most, your longest fic and how many were works in progress, your reading by month, your reader type, and a summary card laid out like an AO3 work header.</p>
<h2>If something goes wrong</h2>
<ul>
<li><b>“Log in to AO3 first”:</b> you're logged out in this tab. Log in and click the bookmark again.</li>
<li><b>“AO3 asked for a short break”:</b> AO3 is rate-limiting. Leave the tab open; FicWrapped waits and continues.</li>
<li><b>The new tab says the AO3 tab didn't answer:</b> go back to AO3, click <i>Save data file</i>, and drop that file on the FicWrapped page.</li>
<li><b>Nothing happens when you click the bookmark:</b> some browser extensions block bookmarklets. Try another browser, or <a href="/#load">paste your History</a> instead.</li>
</ul>
{FACTS}""",
        "faq": ["how", "slow", "empty", "months"],
        "links": ["ao3-wrapped-on-phone", "ao3-wrapped-without-password", "ao3-wrapped-2025"],
    },
    {
        "slug": "ao3-wrapped-on-phone",
        "updated": "2026-11-25",
        "crumb": "AO3 Wrapped on your phone",
        "title": "AO3 Wrapped on iPhone & Android: No App Needed | FicWrapped",
        "h1": "How do I get AO3 Wrapped on my phone?",
        "description": "Make your AO3 Wrapped on an iPhone, iPad or Android phone: save the FicWrapped bookmark in Safari or Chrome, or paste your History pages. No password, no app.",
        "answer": "You can make your AO3 Wrapped on a phone in two ways. Save FicWrapped's bookmark code as a bookmark in Safari or Chrome and tap it while you're on AO3, or copy your AO3 History pages and paste them into FicWrapped one at a time. Neither needs an app or your password.",
        "image": ("ficwrapped-example-4-reader-type", "Example AO3 Wrapped reader-type card: The Slow Burn Devotee"),
        "body": """<p>Jump to: <a href="#iphone">iPhone or iPad</a> · <a href="#android">Android</a> · <a href="#paste">No bookmarks</a></p>
<h2 id="iphone">AO3 Wrapped on iPhone or iPad (Safari)</h2>
<ol>
<li>On <a href="/#phone">FicWrapped</a>, tap <b>Copy bookmark code</b>.</li>
<li>Tap the Share button, then <b>Add Bookmark</b>, and save.</li>
<li>Open Bookmarks, tap <b>Edit</b>, tap the bookmark you just made, rename it <b>AO3 Wrapped</b>, clear the address field and paste the code. Tap Done.</li>
<li>Open archiveofourown.org, log in, open Bookmarks and tap <b>AO3 Wrapped</b>.</li>
<li>When it's finished, tap <b>Open my Wrapped</b>, then <b>Share this card</b> to save cards to Photos or post them.</li>
</ol>
<h2 id="android">AO3 Wrapped on Android (Chrome)</h2>
<ol>
<li>On <a href="/#phone">FicWrapped</a>, tap <b>Copy bookmark code</b>.</li>
<li>Tap ⋮ then ☆ to bookmark the page, then tap <b>Edit</b>. Rename it <b>AO3 Wrapped</b> and paste the code into the URL field.</li>
<li>Open AO3 and log in. Tap the address bar, type <b>AO3 Wrapped</b>, and tap the bookmark in the list (the one with the star). Chrome only runs bookmark code this way, not from the bookmarks screen.</li>
</ol>
<h2 id="paste">No bookmarks: paste your History</h2>
<ol>
<li>On AO3, open your History (your name in the menu, then History).</li>
<li>Select all the text on the page and copy it.</li>
<li>On FicWrapped, tap the paste box under <a href="/#load">“No bookmarks? Paste your History instead”</a> and paste.</li>
<li>Go to the next History page and repeat until you reach fics from before the year started, then tap <b>Make my Wrapped</b>.</li>
</ol>
<p>Pasted text loses some detail: AO3's page doesn't say in plain text which tags are characters and which are additional tags, so the characters and tags cards are skipped. The bookmark gives the full set.</p>""",
        "faq": ["phone", "unfinished", "nopass"],
        "links": ["how-to-do-ao3-wrapped", "ao3-wrapped-without-password", "is-ao3-wrapped-safe"],
    },
    {
        "slug": "ao3-wrapped-without-password",
        "updated": "2026-11-25",
        "crumb": "AO3 Wrapped without a password",
        "title": "AO3 Wrapped Without a Password: 5 Ways Compared | FicWrapped",
        "h1": "Can I get AO3 Wrapped without giving my password?",
        "description": "Yes. How password websites, Colab notebooks, browser extensions, bookmarklets and paste tools make an AO3 Wrapped, and which ones never see your AO3 login.",
        "answer": "Yes. AO3 Wrapped tools that run inside your own logged-in browser, such as bookmarklets and extensions, or that read History pages you paste, never receive your AO3 password. Websites and most Colab notebooks that log in for you do need it. FicWrapped uses a bookmarklet or paste, and its code is public.",
        "image": ("ficwrapped-example-5-summary", "Example AO3 Wrapped summary card laid out like an AO3 work header"),
        "body": """<h2>Five ways to make an AO3 Wrapped</h2>
<p>AO3 hides your History behind your login, so every AO3 Wrapped tool has to get at it somehow. These are the ways they do it.</p>
{METHODS}
<h2>How to tell whether a tool wants your login</h2>
<ul>
<li>It asks for your AO3 username and password, or for a “session cookie” or “_otwarchive_session” value: it logs in as you.</li>
<li>It asks you to log in on a page whose address isn't archiveofourown.org: don't.</li>
<li>It runs on AO3 itself while you're logged in, or only reads what you paste: it never sees your password. You're still trusting its code, so prefer tools whose code you can read.</li>
</ul>
<h2>If you already gave a tool your password</h2>
<p>Change your AO3 password from your account settings on archiveofourown.org. Changing it means the old password stops working anywhere you gave it.</p>
<h2>How FicWrapped does it</h2>
<p>The FicWrapped bookmark loads <a href="/c.js">a short script</a> into your AO3 tab. It reads only <code>/users/your-name/readings</code>, about one page a second, and hands the list to the FicWrapped tab you open. Nothing goes to a server. If you'd rather not run code on AO3 at all, <a href="/#load">paste your History pages</a> instead. The source is on <a href="https://github.com/helloyansquared/ficwrapped">GitHub</a>.</p>""",
        "faq": ["nopass", "password", "safe", "official"],
        "links": ["is-ao3-wrapped-safe", "how-to-do-ao3-wrapped", "ao3-wrapped-on-phone"],
    },
    {
        "slug": "ao3-wrapped-2025",
        "updated": "2026-11-25",
        "crumb": "AO3 Wrapped 2025",
        "title": "AO3 Wrapped 2025: Can You Still Get Last Year? | FicWrapped",
        "h1": "Can I still get my AO3 Wrapped for 2025?",
        "description": "You can make an AO3 Wrapped for 2025 or any earlier year, but it will be incomplete. Why AO3 History moves reread fics to the latest year, and how to do it.",
        "answer": "Partly. AO3 keeps only the last date you visited each work, so a 2025 Wrapped made now includes only fics you last opened in 2025. Anything you reopened in 2026 has moved to 2026. In FicWrapped, choose 2025 in the Year menu, or All time to include everything in your History.",
        "image": ("ficwrapped-example-1-cover", "Example AO3 Wrapped cover card for 2026"),
        "body": """<h2>Why last year's Wrapped is incomplete</h2>
<p>AO3 History has one line per work with the <i>last</i> time you visited it and a visit count. It doesn't keep a list of every visit. So:</p>
<ul><li>You read a fic in June 2025 and never opened it again: it counts for 2025.</li><li>You read a fic in June 2025 and reopened it in March 2026: it now counts only for 2026.</li><li>You deleted it from your History, or cleared your History: it's gone from both years.</li></ul>
<p>The more you reread, the more of your 2025 has moved into 2026.</p>
<h2>How to make it</h2>
<ol>
<li>Add the bookmark from <a href="/">the home page</a> and open AO3 while logged in.</li>
<li>Click the bookmark and choose <b>2025</b> in the Year menu, or <b>All time</b> for your whole History.</li>
<li>Click <b>Read my History</b>. Earlier years take longer, because the bookmark reads through 2026 first.</li>
<li>Click <b>Open my Wrapped</b>.</li>
</ol>
<h2>Make next year's complete</h2>
<p>Save a copy of your History in late December, before you start rereading in January. The <a href="/ao3-history-export/">History export</a> page shows how.</p>""",
        "faq": ["lastyear", "months", "empty"],
        "links": ["how-to-do-ao3-wrapped", "ao3-history-export", "can-people-see-my-ao3-history"],
    },
    {
        "slug": "can-people-see-my-ao3-history",
        "updated": "2026-11-25",
        "crumb": "Who can see your AO3 History",
        "title": "Can Anyone See Your AO3 History? How to View It | FicWrapped",
        "h1": "Can other people see my AO3 History?",
        "description": "Only you can see your AO3 History, while logged in. Where to find it, what it records, and how to delete entries, clear it or switch it off.",
        "answer": "No. AO3 lets only the account owner open their History, and only while logged in, at archiveofourown.org/users/your-name/readings. It lists each work you opened, the last date you visited it and how many times. You can delete single entries, clear it, or switch it off in Preferences.",
        "image": None,
        "body": """<h2>Where to find your AO3 History</h2>
<p>Log in, click your name in the top menu and choose <b>History</b>, or go to <code>archiveofourown.org/users/your-name/readings</code>. AO3 shows 25 works per page, most recently visited first. <b>Marked for Later</b> is a tab on the same page.</p>
<h2>What AO3 History records</h2>
<ul><li>Each work you opened while logged in, once.</li><li>The last date you visited it, and how many times you've visited.</li><li>Whether the work has been updated since you last read it.</li><li>Works that were later deleted, as a date only.</li></ul>
<p>It doesn't record finished reads, and it doesn't record anything while you're logged out.</p>
<h2>Delete, clear or switch off History</h2>
<ul>
<li><b>One entry:</b> click <i>Delete from History</i> under the work.</li>
<li><b>Everything:</b> click <i>Clear History</i> at the top of the page. AO3 warns this can't be undone.</li>
<li><b>Stop recording:</b> Preferences → untick <i>Turn on History</i>. Works you visited while it was on are kept; switch it back on to see them.</li>
</ul>
<h2>Keep a copy</h2>
<p>AO3 has no export button for History. To save one, see <a href="/ao3-history-export/">how to export your AO3 History</a>. To see a year of it as cards, <a href="/">make your AO3 Wrapped</a>.</p>""",
        "faq": ["whosees", "where", "keepoff"],
        "links": ["ao3-history-export", "ao3-wrapped-2025", "how-to-do-ao3-wrapped"],
    },
    {
        "slug": "ao3-history-export",
        "updated": "2026-11-25",
        "crumb": "Export your AO3 History",
        "title": "How to Export Your AO3 History to CSV (2026) | FicWrapped",
        "h1": "Can I export my AO3 History?",
        "description": "AO3 has no export button for History or Marked for Later. How to save your AO3 History as a CSV spreadsheet or an offline page for free.",
        "answer": "AO3 has no export button for your History or Marked for Later list. To keep a copy, save each History page from your browser, or use FicWrapped's free bookmark to read them all at once and save them as a CSV spreadsheet or a searchable offline page, with a link to each fic.",
        "image": None,
        "body": """<h2>Why keep a copy</h2>
<ul><li>AO3 only stores History while it's switched on, and <i>Clear History</i> can't be undone.</li><li>AO3 was offline for about two and a half weeks in late 2026; a copy on your own device doesn't depend on the site being up.</li><li>A spreadsheet lets you sort and filter your reading in ways AO3's pages don't.</li></ul>
<h2>Free: save the pages yourself</h2>
<p>Open your History (see <a href="/can-people-see-my-ao3-history/">where to find it</a>), then use your browser's File → Save Page As on each page, 25 works at a time. It needs no tools, but it's slow for a big History.</p>
<h2>Free with FicWrapped</h2>
<ol>
<li>Add the bookmark from <a href="/">the home page</a> and open AO3 while logged in.</li>
<li>Click the bookmark, choose <b>All time</b> as the year, and tick <b>Also save my Marked for Later list</b>.</li>
<li>Click <b>Read my History</b>. Big histories take a few minutes; AO3 is read about one page a second.</li>
<li>Open your Wrapped and click <b>History CSV</b> or <b>Offline History page</b>, under <i>Keep a copy of your History</i>.</li>
</ol>
<h2>What the export includes</h2>
<p>For every work: last visited date, visit count, title, authors, fandoms, rating, categories, warnings, relationships, characters, additional tags, word count, chapters, complete or in progress, kudos, hits, language, whether it's marked for later or has an update, and the AO3 link. Deleted works are listed with their last-visited date only.</p>
<p>If you want the fics themselves, download them from AO3 and convert them with <a href="https://fictoepub.pages.dev/">FicToEpub</a>.</p>""",
        "faq": ["empty", "free", "fictoepub"],
        "links": ["can-people-see-my-ao3-history", "ao3-wrapped-2025", "how-to-do-ao3-wrapped"],
    },
    {
        "slug": "is-ao3-wrapped-safe",
        "updated": "2026-11-25",
        "crumb": "Is AO3 Wrapped safe?",
        "title": "Is AO3 Wrapped Safe? What Each Tool Can See | FicWrapped",
        "h1": "Is AO3 Wrapped safe to use?",
        "description": "Is AO3 Wrapped safe? It depends on the method. What password sites, Colab notebooks, extensions, bookmarklets and paste tools can each see on your account.",
        "answer": "It depends on how the tool gets your History. Tools that ask for your AO3 password or session cookie can do anything your account can until you change your password. Tools that run in your own logged-in browser, or that you paste History into, never get your login. FicWrapped works the second way, and its code is public.",
        "image": None,
        "body": """<h2>What each kind of AO3 Wrapped tool can see</h2>
{METHODS}
<p>More detail and how to spot a tool that wants your login: <a href="/ao3-wrapped-without-password/">AO3 Wrapped without a password</a>.</p>
<h2>What FicWrapped's bookmark does</h2>
<ul>
<li>Loads two small files from ficwrapped.yansquared.com: <a href="/c.js">c.js</a> (the box you see) and <a href="/core.js">core.js</a> (reads the pages).</li>
<li>Fetches only <code>/users/your-name/readings</code> pages, about one a second, plus Marked for Later if you tick it.</li>
<li>Passes the list to the FicWrapped tab you open with <code>postMessage</code>. No server receives it.</li>
<li>Doesn't read your password, cookies, messages, drafts or anything else on your account.</li>
</ul>
<p>The source is on <a href="https://github.com/helloyansquared/ficwrapped">GitHub</a>. If you'd rather not run any code on AO3, use <a href="/#load">paste mode</a>.</p>
<h2>Is AO3 itself safe right now?</h2>
<p>As of 25 November 2026: the Organization for Transformative Works (OTW), which runs AO3, said on 30 October 2026 that it had detected evidence of a security incident and took AO3 offline. AO3 came back on 15 November 2026 with some features temporarily switched off. OTW said no AO3 data was deleted and that it was working with an outside security firm; it hadn't said whether account information was taken. For current advice, read OTW's own updates at <a href="https://www.transformativeworks.org/">transformativeworks.org</a> and the <a href="https://x.com/AO3_Status">@AO3_Status</a> account.</p>
<h2>General tips</h2>
<ul><li>Never give a third-party site your AO3 password.</li><li>If you already did, change your AO3 password so the old one stops working.</li><li>Be wary of “AO3 Wrapped” links in comments or fics that ask you to log in on a page that isn't archiveofourown.org.</li></ul>""",
        "faq": ["nopass", "safe", "blocked"],
        "links": ["ao3-wrapped-without-password", "how-to-do-ao3-wrapped", "can-people-see-my-ao3-history"],
    },
]
