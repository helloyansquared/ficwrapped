const assert = require("assert");
const { parseHTML } = require("linkedom");
const FW = require("../public/core.js");
const { page, SAMPLE } = require("./fixture.js");

const doc = parseHTML(page(SAMPLE, { pageNo: 1, last: 3 })).document;
const r = FW.parseReadingsDoc(doc);
assert.strictEqual(r.items.length, 5);
assert.strictEqual(r.next, true);
assert.strictEqual(r.last, 3);
const [a, b, c, d, e] = r.items;
assert.deepStrictEqual([a.id, a.t, a.a[0], a.f[0], a.rt, a.done, a.w, a.chp, a.cht, a.k, a.h, a.lv, a.v, a.lang], [101, "The Long Way Home", "inkwell", "Harry Potter - J. K. Rowling", "Teen And Up Audiences", 1, 120345, 30, 30, 5012, 90233, "2026-11-24", 4, "English"]);
assert.deepStrictEqual(a.r, ["Draco Malfoy/Harry Potter"]);
assert.deepStrictEqual(a.g, ["Slow Burn", "Enemies to Lovers", "Fluff"]);
assert.deepStrictEqual(b.a, ["kestrel", "moth"]);
assert.deepStrictEqual(b.cat, ["F/M", "M/M"]);
assert.strictEqual(b.done, 0); assert.strictEqual(b.cht, 0); assert.strictEqual(b.mfl, 1);
assert.strictEqual(c.t, "<script>alert(1)</script>"); assert.deepStrictEqual(c.a, ["Anonymous"]);
assert.strictEqual(d.del, 1); assert.strictEqual(d.lv, "2026-02-03");
assert.strictEqual(e.lv, "2025-12-30");
const last = FW.parseReadingsDoc(parseHTML(page(SAMPLE.slice(0, 1), { pageNo: 3, last: 3 })).document);
assert.strictEqual(last.next, false);

// stats
const st = FW.computeStats(r.items, 2026);
assert.strictEqual(st.works, 3);
assert.strictEqual(st.deleted, 1);
assert.strictEqual(st.words, 120345 + 45001 + 1500);
assert.strictEqual(st.visits, 7);
assert.strictEqual(st.fandoms[0].name, "Harry Potter - J. K. Rowling");
assert.strictEqual(st.fandoms[0].n, 2);
assert.strictEqual(st.fandoms[0].short, "Harry Potter");
assert.strictEqual(st.reread.id, 101);
assert.strictEqual(st.longest.id, 101);
assert.strictEqual(st.months[10], 1); assert.strictEqual(st.months[0], 1); assert.strictEqual(st.months[2], 1);
assert.ok(!st.tags.some(t => /No Beta/.test(t.name)), "boring tags removed");
assert.strictEqual(st.tags[0].name, "Fluff");
assert.ok(st.type && st.type.name, "personality");
assert.strictEqual(FW.computeStats(r.items, "all").works, 4);
assert.strictEqual(FW.computeStats(r.items, 2025).works, 1);

// text paste (copy of a History page as plain text)
const txt = `History
1 2 3 Next →
The Long Way Home by inkwell
Fandoms: Harry Potter - J. K. Rowling
Teen And Up Audiences
No Archive Warnings Apply
M/M
Complete Work
25 Nov 2026
Tags
No Archive Warnings Apply
Draco Malfoy/Harry Potter
Harry Potter
Slow Burn
Summary
A summary.
Language:
English
Words:
120,345
Chapters:
30/30
Kudos:
5,012
Hits:
90,233
Last visited: 24 Nov 2026 (Latest version.) Visited 4 times
Delete from History
Salt & Ash by kestrel, moth
Fandoms: Hades (Video Game), Greek and Roman Mythology
Explicit
F/M, M/M
Work in Progress
Words: 45,001
Chapters: 7/?
Last visited: 2 Mar 2026 (Update available.) Visited once (Marked for Later.)
Delete from History
(Deleted work, last visited 3 Feb 2026)
Delete from History`;
const t = FW.parseText(txt);
assert.strictEqual(t.length, 3);
assert.deepStrictEqual([t[0].t, t[0].a[0], t[0].f[0], t[0].rt, t[0].w, t[0].chp, t[0].cht, t[0].lv, t[0].v, t[0].done], ["The Long Way Home", "inkwell", "Harry Potter - J. K. Rowling", "Teen And Up Audiences", 120345, 30, 30, "2026-11-24", 4, 1]);
assert.deepStrictEqual(t[0].r, ["Draco Malfoy/Harry Potter"]);
assert.deepStrictEqual([t[1].t, t[1].a, t[1].f, t[1].rt, t[1].cat, t[1].done, t[1].mfl, t[1].lv], ["Salt & Ash", ["kestrel", "moth"], ["Hades (Video Game)", "Greek and Roman Mythology"], "Explicit", ["F/M", "M/M"], 0, 1, "2026-03-02"]);
assert.strictEqual(t[2].del, 1);

// merge prefers full HTML data over text-only and dedupes
const m = FW.merge([t, r.items]);
assert.strictEqual(m.filter(x => x.t === "The Long Way Home").length, 1);
assert.ok(!m.find(x => x.t === "The Long Way Home").textOnly);

// CSV
const csv = FW.toCSV(r.items);
assert.ok(csv.startsWith("﻿Last visited,Visits,Title"));
assert.ok(csv.includes("https://archiveofourown.org/works/101"));
assert.ok(csv.includes('"Zagreus/Thanatos (Hades)"') === false && csv.includes("Zagreus/Thanatos (Hades)"));
assert.ok(FW.validItems(r.items));
assert.ok(!FW.validItems([{ t: 3 }]));
console.log("core tests passed");
