/* FicWrapped core: reads AO3 History pages and turns them into year-in-review stats.
   Runs in the browser (on AO3 via the bookmark, or on ficwrapped.pages.dev) and in Node tests.
   Nothing here talks to any server. */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.FW = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";
  const MON = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
  const pad = n => String(n).padStart(2, "0");
  const clean = s => String(s == null ? "" : s).replace(/\s+/g, " ").trim();
  const num = s => { const n = parseInt(String(s == null ? "" : s).replace(/[^\d]/g, ""), 10); return isNaN(n) ? 0 : n; };

  // "23 Nov 2026" -> "2026-11-23"
  function parseDate(s) {
    const m = /(\d{1,2})\s+([A-Za-z]{3})[a-z]*\.?\s+(\d{4})/.exec(String(s || ""));
    if (!m || !MON[m[2].toLowerCase()]) return null;
    return `${m[3]}-${pad(MON[m[2].toLowerCase()])}-${pad(m[1])}`;
  }

  function parseViewed(t) {
    t = clean(t);
    const out = { lv: null, v: 1, mfl: /Marked for Later/i.test(t), up: /Update available/i.test(t) };
    const after = t.split(/last visited:?/i)[1];
    out.lv = parseDate(after != null ? after : t);
    const m = /Visited (\d[\d,]*) times/i.exec(t);
    out.v = m ? num(m[1]) : (/Visited once/i.test(t) ? 1 : 1);
    return out;
  }

  const texts = (el, sel) => el ? Array.from(el.querySelectorAll(sel)).map(a => clean(a.textContent)).filter(Boolean) : [];
  const attr = (el, sel, a) => { const x = el && el.querySelector(sel); return x ? clean(x.getAttribute(a) || x.textContent) : ""; };

  // One <li class="reading work blurb"> from /users/NAME/readings
  function parseLi(li) {
    const viewedEl = li.querySelector("h4.viewed, .viewed.heading");
    const viewed = parseViewed(viewedEl ? viewedEl.textContent : li.textContent);
    const deleted = (li.className || "").split(/\s+/).includes("deleted") || !li.querySelector(".header h4.heading, .header .heading");
    if (deleted) return { del: 1, lv: viewed.lv, v: viewed.v, mfl: viewed.mfl };
    const h4 = li.querySelector(".header h4.heading");
    const workLink = Array.from(h4.querySelectorAll("a")).find(a => /\/works\/\d+/.test(a.getAttribute("href") || ""));
    const idm = /work_(\d+)/.exec(li.id || "") || (workLink && /\/works\/(\d+)/.exec(workLink.getAttribute("href")));
    let authors = texts(h4, 'a[rel="author"]');
    if (!authors.length) authors = /\bby\s+Anonymous\b/i.test(clean(h4.textContent)) ? ["Anonymous"] : ["Unknown"];
    const req = li.querySelector(".required-tags");
    const cat = attr(req, ".category", "title");
    const iswip = attr(req, ".iswip", "title");
    const ch = clean((li.querySelector("dd.chapters") || {}).textContent || "");
    const chm = /(\d+)\s*\/\s*(\d+|\?)/.exec(ch);
    return {
      id: idm ? Number(idm[1]) : 0,
      t: workLink ? clean(workLink.textContent) : clean(h4.textContent).split(/\s+by\s+/)[0],
      a: authors,
      f: texts(li, ".fandoms a.tag"),
      rt: attr(req, ".rating", "title") || "Not Rated",
      cat: cat && cat !== "No category" ? cat.split(/\s*,\s*/) : [],
      done: /^Complete/i.test(iswip) ? 1 : 0,
      wa: texts(li, "ul.tags li.warnings a.tag"),
      r: texts(li, "ul.tags li.relationships a.tag"),
      c: texts(li, "ul.tags li.characters a.tag"),
      g: texts(li, "ul.tags li.freeforms a.tag"),
      w: num((li.querySelector("dd.words") || {}).textContent),
      chp: chm ? num(chm[1]) : 0,
      cht: chm ? (chm[2] === "?" ? 0 : num(chm[2])) : 0,
      k: num((li.querySelector("dd.kudos") || {}).textContent),
      h: num((li.querySelector("dd.hits") || {}).textContent),
      lang: clean((li.querySelector("dd.language") || {}).textContent),
      lv: viewed.lv, v: viewed.v, mfl: viewed.mfl ? 1 : 0, up: viewed.up ? 1 : 0,
      own: (li.className || "").split(/\s+/).includes("own") ? 1 : 0
    };
  }

  // Whole History page (a Document). Returns items plus paging info.
  function parseReadingsDoc(doc) {
    const items = Array.from(doc.querySelectorAll("li.reading")).map(parseLi);
    const pag = doc.querySelector("ol.pagination, .pagination");
    let last = 1;
    if (pag) Array.from(pag.querySelectorAll("a, span, em")).forEach(a => { const n = parseInt(clean(a.textContent), 10); if (n > last) last = n; });
    const next = !!(pag && (pag.querySelector('a[rel="next"]') || Array.from(pag.querySelectorAll("li.next a")).length));
    const greet = doc.querySelector('#greeting a[href^="/users/"]');
    return { items, next, last, loggedIn: !!greet || !!doc.querySelector("li.reading") };
  }

  // Plain text copied from a History page (phones, or browsers that drop HTML on paste).
  // Tag types can't be told apart in plain text, so only ships (with / or &) are kept.
  const RATINGS = ["General Audiences", "Teen And Up Audiences", "Mature", "Explicit", "Not Rated"];
  const CATS = ["F/F", "F/M", "Gen", "M/M", "Multi", "Other"];
  function parseText(text) {
    const s = String(text || "").replace(/\r/g, "");
    const parts = s.split(/(Last visited:[^\n]*|\(Deleted work, last visited[^\n)]*\))/i);
    const items = [];
    for (let i = 1; i < parts.length; i += 2) {
      const viewedLine = parts[i];
      const body = parts[i - 1];
      const viewed = parseViewed(viewedLine + " " + (parts[i + 1] || "").split("\n").slice(0, 2).join(" "));
      if (/Deleted work/i.test(viewedLine)) { items.push({ del: 1, lv: viewed.lv, v: viewed.v, mfl: viewed.mfl ? 1 : 0 }); continue; }
      const lines = body.split("\n").map(clean).filter(l => l && !/^(Delete from History|Tags|Summary|Series|Fandoms?:?)$/i.test(l));
      // the heading is the last "X by Y" line before "Fandoms:"
      const fIdx = lines.findIndex(l => /^Fandoms?:/i.test(l));
      const headIdx = (() => { for (let j = (fIdx > 0 ? fIdx : lines.length) - 1; j >= 0; j--) if (/\sby\s/.test(lines[j])) return j; return -1; })();
      if (headIdx < 0) continue;
      const head = lines[headIdx];
      const bi = head.lastIndexOf(" by ");
      const title = head.slice(0, bi).trim();
      const authors = head.slice(bi + 4).replace(/\s+for\s+.*$/, "").split(/\s*,\s*/).filter(Boolean);
      const rest = lines.slice(headIdx + 1);
      let fandoms = [];
      const fl = rest.find(l => /^Fandoms?:/i.test(l));
      if (fl) fandoms = fl.replace(/^Fandoms?:\s*/i, "").split(/\s*,\s*/).filter(Boolean);
      else if (fIdx >= 0 && lines[fIdx + 1]) fandoms = lines[fIdx + 1].split(/\s*,\s*/);
      const joined = rest.join("\n");
      const rt = RATINGS.find(r => rest.includes(r)) || "Not Rated";
      const cat = CATS.filter(c => rest.some(l => l === c || l.split(/\s*,\s*/).includes(c)));
      const words = /Words:\s*([\d,]+)/i.exec(joined);
      const chm = /Chapters:\s*(\d+)\s*\/\s*(\d+|\?)/i.exec(joined);
      const rels = [];
      rest.forEach(l => { if (/(Words|Chapters|Kudos|Hits|Language|Comments|Bookmarks|Collections):/i.test(l)) return; l.split(/\s*,\s*/).forEach(x => { if (/\S\s*[/&]\s*\S/.test(x) && x.length < 120 && !CATS.includes(x) && !/^\d/.test(x)) rels.push(x); }); });
      items.push({
        id: 0, t: title, a: authors.length ? authors : ["Unknown"], f: fandoms, rt, cat,
        done: /Complete Work/.test(joined) ? 1 : (chm ? (chm[2] !== "?" && chm[1] === chm[2] ? 1 : 0) : 0),
        wa: [], r: Array.from(new Set(rels)), c: [], g: [], textOnly: 1,
        w: words ? num(words[1]) : 0, chp: chm ? num(chm[1]) : 0, cht: chm && chm[2] !== "?" ? num(chm[2]) : 0,
        k: num((/Kudos:\s*([\d,]+)/i.exec(joined) || [])[1]), h: num((/Hits:\s*([\d,]+)/i.exec(joined) || [])[1]),
        lang: "", lv: viewed.lv, v: viewed.v, mfl: viewed.mfl ? 1 : 0, up: viewed.up ? 1 : 0, own: 0
      });
    }
    return items;
  }

  // Merge lists from several pages / pastes, newest visit wins.
  function merge(lists) {
    const map = new Map(); let anon = 0;
    lists.flat().forEach(it => {
      const key = it.del ? "del" + (anon++) : ("t" + it.t + "|" + (it.a || []).join(",")).toLowerCase();
      const old = map.get(key);
      if (!old || (it.lv || "") > (old.lv || "") || (old.textOnly && !it.textOnly)) map.set(key, it);
    });
    return Array.from(map.values()).sort((a, b) => (b.lv || "").localeCompare(a.lv || ""));
  }

  function count(arr) { const m = new Map(); arr.forEach(x => { if (x) m.set(x, (m.get(x) || 0) + 1); }); return Array.from(m, ([name, n]) => ({ name, n })).sort((a, b) => b.n - a.n || a.name.localeCompare(b.name)); }

  // Tags so common on AO3 that they say nothing about a reader.
  const BORING = /^(no archive warnings apply|creator chose not to use archive warnings|other additional tags to be added|additional tags to be added|not beta read|no beta we die like.*|tags to be added|i don'?t know how to tag|.*tags will be added.*)$/i;

  const TYPES = [
    { id: "angst", name: "The Angst Connoisseur", line: "You read through the pain on purpose. Happy endings are a bonus.", re: /angst|whump|major character death|tragedy|heavy angst/i },
    { id: "fluff", name: "The Fluff Collector", line: "Soft, warm, low stakes. You came here to feel nice and you did.", re: /fluff|domestic|cuddling|soft|wholesome|tooth-rotting/i },
    { id: "slowburn", name: "The Slow Burn Devotee", line: "Fifty thousand words before the first kiss? Worth it every time.", re: /slow burn|pining|mutual pining|friends to lovers|idiots in love/i },
    { id: "hc", name: "The Hurt/Comfort Specialist", line: "Someone gets hurt, someone shows up. You need both halves.", re: /hurt\/comfort|comfort|caretaking|protective/i },
    { id: "au", name: "The AU Explorer", line: "Canon is a suggestion. Coffee shops, soulmates, space: you went everywhere.", re: /alternate universe|\bau\b|canon divergence|modern setting|soulmate/i },
    { id: "enemies", name: "The Enemies-to-Lovers Loyalist", line: "If they don't start out hating each other, what's even the point?", re: /enemies to lovers|rivals to lovers|enemies to friends to lovers|hate to love/i },
    { id: "smut", name: "The Mature Audiences Regular", line: "You know exactly what you came for and you aren't sorry.", re: /smut|porn with(out)? plot|explicit sexual content|first time/i },
    { id: "fix", name: "The Fix-It Fixer", line: "Canon broke your heart, so you went looking for repairs.", re: /fix-it|everyone lives|nobody dies|canon what canon/i }
  ];

  function personality(st) {
    const tagCounts = new Map(st.tags.map(t => [t.name, t.n]));
    const scores = TYPES.map(t => {
      let s = 0; tagCounts.forEach((n, name) => { if (t.re.test(name)) s += n; });
      if (t.id === "smut") s += (st.ratings.find(r => r.name === "Explicit") || { n: 0 }).n * 0.6;
      return { t, s: s / Math.max(1, st.works) };
    }).sort((a, b) => b.s - a.s);
    let type;
    if (st.avgWords >= 60000) type = { id: "long", name: "The Longfic Marathoner", line: `Your average fic ran ${Math.round(st.avgWords / 1000)}k words. Short stories are for other people.` };
    else if (st.works >= 20 && st.avgWords > 0 && st.avgWords < 6000) type = { id: "oneshot", name: "The Oneshot Snacker", line: "Quick, perfect, done. You read the way other people eat crisps." };
    else if (st.works >= 20 && st.wipShare >= 0.55) type = { id: "wip", name: "The WIP Daredevil", line: `${Math.round(st.wipShare * 100)}% of your fics weren't finished. You live on hope and update alerts.` };
    else if (scores[0].s >= 0.12) type = scores[0].t;
    else if (st.fandoms.length >= 15) type = { id: "multi", name: "The Multifandom Nomad", line: `${st.fandoms.length} fandoms in one year. You don't settle, you visit.` };
    else if (st.fandoms[0] && st.fandoms[0].n / Math.max(1, st.works) >= 0.7) type = { id: "loyal", name: "The One-Fandom Loyalist", line: `${Math.round(st.fandoms[0].n / st.works * 100)}% ${st.fandoms[0].name}. You know what you like.` };
    else type = scores[0].s > 0 ? scores[0].t : { id: "explorer", name: "The Open-Tab Explorer", line: "A little of everything, a lot of tabs." };
    const extra = scores.filter(x => x.t.id !== type.id && x.s >= 0.08).slice(0, 2).map(x => x.t.name.replace(/^The /, ""));
    return { id: type.id, name: type.name, line: type.line, traits: extra };
  }

  const shortFandom = f => f.replace(/\s+-\s+[^-]+$/, "").replace(/\s*\((?:TV|Movies?|Video Games?|Anime|Comics|Cartoon)[^)]*\)\s*$/i, "").trim() || f;

  // year: a number (e.g. 2026) or "all"
  function computeStats(allItems, year) {
    const inYear = it => year === "all" || (it.lv && it.lv.slice(0, 4) === String(year));
    const items = allItems.filter(it => !it.del && inYear(it));
    const deleted = allItems.filter(it => it.del && inYear(it)).length;
    const works = items.length;
    const words = items.reduce((s, it) => s + (it.w || 0), 0);
    const visits = items.reduce((s, it) => s + (it.v || 1), 0);
    const fandomsRaw = count(items.flatMap(it => Array.from(new Set(it.f || []))));
    const fandoms = fandomsRaw.map(x => ({ ...x, short: shortFandom(x.name) }));
    const ships = count(items.flatMap(it => it.r || []).filter(r => !/^(Gen|No Relationship|Other Relationship.*|Background Relationships?)$/i.test(r)));
    const chars = count(items.flatMap(it => it.c || []).filter(c => !/^(Original Characters?|Original Female Character\(s\)|Original Male Character\(s\)|Reader|You|Other Character Tags to Be Added)$/i.test(c)));
    const tags = count(items.flatMap(it => (it.g || []).filter(g => !BORING.test(g))));
    const ratings = ["General Audiences", "Teen And Up Audiences", "Mature", "Explicit", "Not Rated"].map(name => ({ name, n: items.filter(it => it.rt === name).length }));
    const cats = count(items.flatMap(it => it.cat || []));
    const authors = count(items.flatMap(it => it.a || []).filter(a => !/^(Anonymous|orphan_account|Unknown)$/i.test(a)));
    const months = Array.from({ length: 12 }, (_, i) => items.filter(it => it.lv && +it.lv.slice(5, 7) === i + 1).length);
    const reread = items.slice().sort((a, b) => (b.v || 1) - (a.v || 1) || (b.w || 0) - (a.w || 0))[0] || null;
    const longest = items.slice().sort((a, b) => (b.w || 0) - (a.w || 0))[0] || null;
    const wips = items.filter(it => !it.done).length;
    const oneshots = items.filter(it => it.cht === 1).length;
    const mfl = allItems.filter(it => it.mfl && !it.del).length;
    const st = {
      year, works, words, visits, deleted, fandoms, ships, chars, tags, ratings, cats, authors, months,
      reread, longest, wips, oneshots, mfl,
      avgWords: works ? Math.round(words / works) : 0,
      wipShare: works ? wips / works : 0,
      hours: Math.round(words / 250 / 60),
      novels: Math.round(words / 90000 * 10) / 10,
      busiest: months.indexOf(Math.max(...months)),
      textOnly: items.length > 0 && items.every(it => it.textOnly)
    };
    st.type = personality(st);
    return st;
  }

  // CSV of the reading history (Supporter Pack)
  function toCSV(items) {
    const cols = [["Last visited", it => it.lv], ["Visits", it => it.v], ["Title", it => it.del ? "(Deleted work)" : it.t], ["Authors", it => (it.a || []).join(", ")],
      ["Fandoms", it => (it.f || []).join(", ")], ["Rating", it => it.rt], ["Categories", it => (it.cat || []).join(", ")], ["Warnings", it => (it.wa || []).join(", ")],
      ["Relationships", it => (it.r || []).join(", ")], ["Characters", it => (it.c || []).join(", ")], ["Additional tags", it => (it.g || []).join(", ")],
      ["Words", it => it.w], ["Chapters", it => it.del ? "" : `${it.chp || ""}/${it.cht || "?"}`], ["Complete", it => it.del ? "" : (it.done ? "yes" : "no")],
      ["Kudos", it => it.k], ["Hits", it => it.h], ["Language", it => it.lang], ["Marked for later", it => it.mfl ? "yes" : ""], ["Update available", it => it.up ? "yes" : ""],
      ["Link", it => it.id ? `https://archiveofourown.org/works/${it.id}` : ""]];
    const q = v => { v = v == null ? "" : String(v); if (/^[=+\-@\t\r]/.test(v)) v = "'" + v; return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    return "﻿" + [cols.map(c => c[0]).join(","), ...items.map(it => cols.map(c => q(c[1](it))).join(","))].join("\r\n") + "\r\n";
  }

  function validItems(x) {
    return Array.isArray(x) && x.length < 200000 && x.every(it => it && typeof it === "object" && (it.del || typeof it.t === "string"));
  }

  return { parseDate, parseViewed, parseLi, parseReadingsDoc, parseText, merge, computeStats, personality, toCSV, validItems, shortFandom, clean, num };
});
