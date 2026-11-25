# All FicWrapped page copy lives here. FAQ text is used for both the visible FAQ and FAQPage JSON-LD.
PUBLISHED = "2026-11-25"
LAST_UPDATED = "2026-11-25"
EMAIL = "hello@yansquared.com"
GITHUB = "https://github.com/helloyansquared/ficwrapped"

FACTS_ROWS = [
    ("Where the data comes from", "Your AO3 History, the page at <code>archiveofourown.org/users/your-name/readings</code>. AO3 lists 20 works per page, most recently visited first, and only shows it to you while you're logged in."),
    ("Which fics count for 2026", "A fic counts for 2026 if you last opened it in 2026. AO3 keeps only the latest visit date, so a fic you read in March and reopened in October counts in October."),
    ("Fics", "Each work counts once, however many times you opened it. Works you opened but didn't finish still count: AO3 records visits, not finished reads."),
    ("Words", "The work's full word count as shown on AO3, not the chapters you actually read."),
    ("Visits", "AO3's own \"Visited N times\" counter for each work, which is how the most-reread card is chosen."),
    ("Deleted works", "Counted separately. AO3 keeps only the date for them, so they aren't in the fandom or tag totals."),
    ("Reading time", "Total words ÷ 250 words a minute."),
    ("Speed", "The bookmark reads about one History page a second. If AO3 asks it to slow down, it waits and carries on."),
    ("What you need", "An AO3 account, logged in, with History switched on (AO3 Preferences → Turn on History)."),
]

def facts_table():
    rows = "".join(f"<tr><th scope=\"row\">{a}</th><td>{b}</td></tr>" for a, b in FACTS_ROWS)
    return f'<table class="facts"><caption class="sr">How FicWrapped counts your AO3 History (checked 25 November 2026)</caption>{rows}</table>'

QA = {
    "official": ("Is there an official AO3 Wrapped?",
        "No. AO3 doesn't make a personal year-in-review. Every AO3 Wrapped is fan-made from your AO3 History. FicWrapped is one of them: it reads your History in your own browser and turns it into shareable cards, without asking for your password."),
    "how": ("How do I do AO3 Wrapped?",
        "Drag the AO3 Wrapped bookmark from ficwrapped.pages.dev to your bookmarks bar, open AO3 while logged in and click it. It reads your History pages for the year, then you click Open my Wrapped to see and save your cards. It takes about a minute for most readers."),
    "password": ("Does FicWrapped need my AO3 password?",
        "No. You log in to AO3 yourself, on AO3, as usual. The bookmark runs in that AO3 tab, reads only your History pages and passes the list to the FicWrapped tab you open. It never sees your password or cookies, and nothing is uploaded to a server."),
    "phone": ("Can I make my AO3 Wrapped on my phone?",
        "Yes. On iPhone Safari and Android Chrome you can save the bookmark code as a bookmark and tap it on AO3; the steps are on the home page. If that's fiddly, copy your History pages one at a time and paste them into FicWrapped instead."),
    "unfinished": ("Why does my Wrapped count fics I didn't finish?",
        "AO3 History records every work you open, not every work you finish, and it shows each work's full word count. So the totals are fics and words you opened. Most AO3 Wrapped tools count the same way."),
    "months": ("Why do some months look empty?",
        "AO3 keeps only the last time you visited each work. If you read a fic in February and reopened it in November, it shows up in November. Fics you removed from your History, or read while logged out or with History off, aren't counted."),
    "empty": ("Why is my AO3 History empty?",
        "AO3 only saves History while it's switched on. Check Preferences on AO3 and turn on History. If you cleared your History or turned it off earlier in the year, those visits are gone and no tool can get them back."),
    "slow": ("How long does it take?",
        "About one second per History page of 20 fics, so 400 fics take around 20 seconds. If AO3 asks it to slow down, FicWrapped waits and continues on its own. You can also stop early and use what's loaded."),
    "free": ("Is FicWrapped free?",
        "Yes, the whole Wrapped is free. An optional $3.99 Supporter Pack adds a printable poster, cards without the web address, and a CSV and offline copy of your loaded History."),
    "safe": ("Is it safe to run a bookmark on AO3?",
        "A bookmark runs code in the AO3 tab, so only use ones you can read. FicWrapped's script is short, published at ficwrapped.pages.dev/c.js and on GitHub, and it only fetches your own History pages. If you'd rather not run any code on AO3, use the paste option."),
    "blocked": ("Will AO3 block me for using it?",
        "FicWrapped reads your History at about the pace of someone clicking Next, and it backs off when AO3 says to retry later. That's far gentler than downloading fics. If AO3 is down or under maintenance, wait and try again later."),
    "fictoepub": ("Can I also download the fics in my Wrapped?",
        "FicWrapped links each fic in the History export to its AO3 page. To turn AO3's HTML downloads into an EPUB for Kindle, Kobo or Apple Books, use FicToEpub, a free converter by the same maker."),
}
HOME_FAQ = ["official", "how", "password", "phone", "unfinished", "months", "empty", "slow", "free", "safe", "blocked", "fictoepub"]

PAGES = [
    {
        "slug": "how-to-do-ao3-wrapped",
        "crumb": "How to do AO3 Wrapped",
        "title": "How to Do AO3 Wrapped in 2026 (No Password) | FicWrapped",
        "h1": "How do I do AO3 Wrapped?",
        "description": "Step-by-step: make your AO3 Wrapped 2026 from your AO3 History with a bookmark, without giving anyone your password. Takes about a minute.",
        "answer": "AO3 doesn't make a Wrapped, so you build one from your AO3 History. With FicWrapped: drag the AO3 Wrapped bookmark to your bookmarks bar, open AO3 while logged in, click the bookmark, wait while it reads your History, then click Open my Wrapped. Your cards open in a new tab, ready to save or share.",
        "body": """<h2>Before you start</h2>
<ul><li>Be logged in to AO3 in this browser.</li><li>Make sure History is switched on (AO3 Preferences → Turn on History). AO3 can't show visits it never saved.</li><li>Use a computer if you can. On a phone, see <a href="/ao3-wrapped-on-phone/">AO3 Wrapped on your phone</a>.</li></ul>
<h2>Step by step</h2>
<ol>
<li><b>Add the bookmark.</b> On <a href="/">the FicWrapped home page</a>, drag the purple <b>✦ AO3 Wrapped</b> button to your bookmarks bar. If you can't see the bar, press Ctrl+Shift+B (Cmd+Shift+B on a Mac).</li>
<li><b>Open AO3.</b> Go to archiveofourown.org and log in as usual. Any AO3 page works.</li>
<li><b>Click the bookmark.</b> A small FicWrapped box appears in the corner of AO3. Pick the year (2026 is the default), and tick <i>Also save my Marked for Later list</i> if you want it in your export.</li>
<li><b>Click Read my History.</b> The box reads your History pages one at a time, about one a second, and stops when it reaches fics you last opened before the year started.</li>
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
        "faq": ["official", "how", "slow", "empty", "months"],
        "links": ["ao3-wrapped-on-phone", "is-ao3-wrapped-safe", "ao3-history-export"],
    },
    {
        "slug": "ao3-wrapped-on-phone",
        "crumb": "AO3 Wrapped on your phone",
        "title": "AO3 Wrapped on iPhone and Android (2026 Guide) | FicWrapped",
        "h1": "How do I get AO3 Wrapped on my phone?",
        "description": "Make your AO3 Wrapped on an iPhone, iPad or Android phone: save the FicWrapped bookmark in Safari or Chrome, or paste your History pages. No password, no app.",
        "answer": "You can make your AO3 Wrapped on a phone in two ways. Save FicWrapped's bookmark code as a bookmark in Safari or Chrome and tap it while you're on AO3, or copy your AO3 History pages and paste them into FicWrapped one at a time. Neither needs an app or your password.",
        "body": """<h2>iPhone or iPad (Safari)</h2>
<ol>
<li>On <a href="/#phone">FicWrapped</a>, tap <b>Copy bookmark code</b>.</li>
<li>Tap the Share button, then <b>Add Bookmark</b>, and save.</li>
<li>Open Bookmarks, tap <b>Edit</b>, tap the bookmark you just made, rename it <b>AO3 Wrapped</b>, clear the address field and paste the code. Tap Done.</li>
<li>Open archiveofourown.org, log in, open Bookmarks and tap <b>AO3 Wrapped</b>.</li>
<li>When it's finished, tap <b>Open my Wrapped</b>, then <b>Share this card</b> to save cards to Photos or post them.</li>
</ol>
<h2>Android (Chrome)</h2>
<ol>
<li>On <a href="/#phone">FicWrapped</a>, tap <b>Copy bookmark code</b>.</li>
<li>Tap ⋮ then ☆ to bookmark the page, then tap <b>Edit</b>. Rename it <b>AO3 Wrapped</b> and paste the code into the URL field.</li>
<li>Open AO3 and log in. Tap the address bar, type <b>AO3 Wrapped</b>, and tap the bookmark in the list (the one with the star). Chrome only runs bookmark code this way, not from the bookmarks screen.</li>
</ol>
<h2>No bookmarks: paste your History</h2>
<ol>
<li>On AO3, open your History (your name in the menu, then History).</li>
<li>Select all the text on the page and copy it.</li>
<li>On FicWrapped, tap the paste box under <a href="/#load">“No bookmarks? Paste your History instead”</a> and paste.</li>
<li>Go to the next History page and repeat until you reach fics from before the year started, then tap <b>Make my Wrapped</b>.</li>
</ol>
<p>Pasted text loses some detail: AO3's page doesn't say in plain text which tags are characters and which are additional tags, so the characters and tags cards are skipped. The bookmark gives the full set.</p>""",
        "faq": ["phone", "password", "slow", "unfinished"],
        "links": ["how-to-do-ao3-wrapped", "is-ao3-wrapped-safe", "ao3-history-export"],
    },
    {
        "slug": "ao3-history-export",
        "crumb": "Export your AO3 History",
        "title": "How to Export Your AO3 History & Marked for Later (CSV) | FicWrapped",
        "h1": "Can I export my AO3 History?",
        "description": "AO3 has no export button for History or Marked for Later. Here's how to see your AO3 History and save it as a spreadsheet or offline page with links to every fic.",
        "answer": "AO3 has no export button for your History or Marked for Later list. You can see them at archiveofourown.org/users/your-name/readings while logged in. To keep a copy, FicWrapped's bookmark reads those pages in your browser and the Supporter Pack saves them as a CSV spreadsheet and a searchable offline page, with a link to each fic.",
        "body": """<h2>Where to see your AO3 History</h2>
<p>Log in, click your name in the top menu, then <b>History</b>. The address is <code>archiveofourown.org/users/your-name/readings</code>. <b>Marked for Later</b> is a tab on the same page (<code>?show=to-read</code>). Each entry shows the work, the last time you opened it, whether there's an update, and how many times you've visited.</p>
<h2>Why keep a copy</h2>
<ul><li>AO3 only stores History while it's switched on, and <i>Clear History</i> can't be undone.</li><li>AO3 has had outages and maintenance in 2026; a copy on your own device doesn't depend on the site being up.</li><li>A spreadsheet lets you sort and filter your reading in ways AO3's pages don't.</li></ul>
<h2>Export with FicWrapped</h2>
<ol>
<li>Add the bookmark from <a href="/">the home page</a> and open AO3 while logged in.</li>
<li>Click the bookmark, choose <b>All time</b> as the year, and tick <b>Also save my Marked for Later list</b>.</li>
<li>Click <b>Read my History</b>. Big histories take a few minutes; AO3 is read about one page a second.</li>
<li>Open your Wrapped. With the Supporter Pack, click <b>History CSV</b> or <b>Offline History page</b>.</li>
</ol>
<h2>What the export includes</h2>
<p>For every work: last visited date, visit count, title, authors, fandoms, rating, categories, warnings, relationships, characters, additional tags, word count, chapters, complete or in progress, kudos, hits, language, whether it's marked for later or has an update, and the AO3 link. Deleted works are listed with their last-visited date only.</p>
<h2>Free alternative</h2>
<p>You can also save each History page from your browser (File → Save Page As) or copy them into a document. It's slower, but it needs no tools at all. If you want the fics themselves, download them from AO3 and convert them with <a href="https://fictoepub.pages.dev/">FicToEpub</a>.</p>""",
        "faq": ["empty", "free", "fictoepub", "password"],
        "links": ["how-to-do-ao3-wrapped", "is-ao3-wrapped-safe"],
    },
    {
        "slug": "is-ao3-wrapped-safe",
        "crumb": "Is AO3 Wrapped safe?",
        "title": "Is AO3 Wrapped Safe? Passwords, Cookies & Bookmarks Explained | FicWrapped",
        "h1": "Is AO3 Wrapped safe to use?",
        "description": "AO3 Wrapped tools work in different ways: some ask for your password, some run notebooks, some run in your browser. What each method can see, and how to stay safe.",
        "answer": "It depends on how the tool gets your History. Tools that ask for your AO3 password or session cookie can do anything your account can until you change your password. Tools that run in your own logged-in browser, or that you paste History into, never get your login. FicWrapped works the second way, and its code is public.",
        "body": """<h2>The three ways AO3 Wrapped tools work</h2>
<table class="facts"><caption class="sr">AO3 Wrapped methods compared</caption>
<tr><th scope="row">You type your AO3 password into a website or notebook</th><td>The tool logs in as you. Whoever runs it could read or change anything on your account. If you've done this, change your AO3 password afterwards.</td></tr>
<tr><th scope="row">You copy your session cookie into a script</th><td>Same access as your password until you log out of AO3 everywhere. Many Colab notebooks used this in past years; some stopped working when AO3's protection started blocking them.</td></tr>
<tr><th scope="row">A bookmark or extension runs in your AO3 tab</th><td>The code runs in your own browser with your existing login, and the tool's owner never receives your password or cookie. You're trusting the code itself, so use one you can read.</td></tr>
<tr><th scope="row">You paste or upload your History pages</th><td>The tool only sees what you paste. Nothing runs on AO3 at all.</td></tr>
</table>
<h2>What FicWrapped's bookmark does</h2>
<ul>
<li>Loads two small files from ficwrapped.pages.dev: <a href="/c.js">c.js</a> (the box you see) and <a href="/core.js">core.js</a> (reads the pages).</li>
<li>Fetches only <code>/users/your-name/readings</code> pages, about one a second, plus Marked for Later if you tick it.</li>
<li>Passes the list to the FicWrapped tab you open with <code>postMessage</code>. No server receives it.</li>
<li>Doesn't read your password, cookies, messages, drafts or anything else on your account.</li>
</ul>
<p>The source is on <a href="https://github.com/helloyansquared/ficwrapped">GitHub</a>. If you'd rather not run any code on AO3, use <a href="/#load">paste mode</a>.</p>
<h2>General tips</h2>
<ul><li>Never give a third-party site your AO3 password.</li><li>If you already did, change your AO3 password; that also logs out other sessions.</li><li>Be wary of “AO3 Wrapped” links in comments or fics that ask you to log in on a page that isn't archiveofourown.org.</li></ul>""",
        "faq": ["password", "safe", "blocked", "official"],
        "links": ["how-to-do-ao3-wrapped", "ao3-wrapped-on-phone", "ao3-history-export"],
    },
]
