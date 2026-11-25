// Builds an AO3 History page the way otwarchive's readings/_reading_blurb + works/_work_module templates do.
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const tag = t => `<a class="tag" href="/tags/${encodeURIComponent(t)}/works">${esc(t)}</a>`;
function blurb(w) {
  if (w.deleted) return `<li class="deleted reading work blurb group" role="article">
  <div class="user module group">
    <h4 class="viewed heading">
        (Deleted work, last visited ${w.lv})
    </h4></div></li>`;
  const lis = [
    ...(w.wa || []).map(t => `<li class="warnings"><strong>${tag(t)}</strong></li>`),
    ...(w.r || []).map(t => `<li class="relationships">${tag(t)}</li>`),
    ...(w.c || []).map(t => `<li class="characters">${tag(t)}</li>`),
    ...(w.g || []).map(t => `<li class="freeforms">${tag(t)}</li>`)].join(" ");
  return `<li id="work_${w.id}" class="${w.own ? "own " : ""}reading work blurb group work-${w.id} user-1" role="article">
    <!--title, author, fandom-->
  <div class="header module">
    <!-- updated_at=1795612168 -->
    <h4 class="heading">
      <a href="/works/${w.id}">${esc(w.t)}</a>
      by
      <!-- do not cache -->
      ${w.anon ? "Anonymous" : w.a.map(a => `<a rel="author" href="/users/${a}/pseuds/${a}">${esc(a)}</a>`).join(", ")}
    </h4>
    <h5 class="fandoms heading">
      <span class="landmark">Fandoms:</span>
      ${w.f.map(tag).join(", ")}
      &nbsp;
    </h5>
    <ul class="required-tags">
<li><a class="help symbol question modal modal-attached" title="Symbols key" href="/help/symbols_key"><span class="rating-x rating" title="${w.rt}"><span class="text">${w.rt}</span></span></a></li>
<li><a class="help symbol question modal modal-attached" title="Symbols key" href="/help/symbols_key"><span class="warning-no warnings" title="No Archive Warnings Apply"><span class="text">No Archive Warnings Apply</span></span></a></li>
<li><a class="help symbol question modal modal-attached" title="Symbols key" href="/help/symbols_key"><span class="category-x category" title="${w.cat}"><span class="text">${w.cat}</span></span></a></li>
<li><a class="help symbol question modal modal-attached" title="Symbols key" href="/help/symbols_key"><span class="complete-${w.done ? "yes" : "no"} iswip" title="${w.done ? "Complete Work" : "Work in Progress"}"><span class="text">${w.done ? "Complete Work" : "Work in Progress"}</span></span></a></li>
</ul>
    <p class="datetime">25 Nov 2026</p>
  </div>
  <h6 class="landmark heading">Tags</h6>
  <ul class="tags commas">
    ${lis}
  </ul>
    <h6 class="landmark heading">Summary</h6>
    <blockquote class="userstuff summary"><p>A summary.</p></blockquote>
  <dl class="stats">
      <dt class="language">Language:</dt>
      <dd class="language" lang="en">English</dd>
    <dt class="words">Words:</dt>
    <dd class="words">${w.w.toLocaleString("en-US")}</dd>
    <dt class="chapters">Chapters:</dt>
    <dd class="chapters"><a href="/works/${w.id}/chapters/1">${w.chp}</a>/${w.cht || "?"}</dd>
    <dt class="kudos">Kudos:</dt>
    <dd class="kudos"><a href="/works/${w.id}#kudos">${w.k.toLocaleString("en-US")}</a></dd>
  <dt class="hits">Hits:</dt>
  <dd class="hits">${w.h.toLocaleString("en-US")}</dd>
  </dl>
  <div class="user module group">
    <h4 class="viewed heading">
        <span>Last visited:</span> ${w.lv}
          (${w.up ? "Update available." : "Latest version."})
          ${w.v === 1 ? "Visited once" : `Visited ${w.v} times`}
          ${w.mfl ? "(Marked for Later.)" : ""}
    </h4>
    <ul class="actions"><li><form class="ajax-remove" action="/users/me/readings/1" method="post"><input type="submit" value="Delete from History"></form></li></ul>
  </div>
</li>`;
}
function page(works, { pageNo = 1, last = 1 } = {}) {
  const nums = Array.from({ length: last }, (_, i) => i + 1 === pageNo ? `<li><span class="current">${i + 1}</span></li>` : `<li><a href="/users/me/readings?page=${i + 1}">${i + 1}</a></li>`).join("");
  const pag = `<ol class="pagination actions pagy" role="navigation"><li class="previous">${pageNo > 1 ? `<a rel="prev" href="?page=${pageNo - 1}">← Previous</a>` : `<span class="disabled">← Previous</span>`}</li>${nums}<li class="next">${pageNo < last ? `<a rel="next" href="?page=${pageNo + 1}">Next →</a>` : `<span class="disabled">Next →</span>`}</li></ol>`;
  return `<!DOCTYPE html><html><body><div id="header"><ul class="primary navigation actions"><li id="greeting"><a href="/users/me">Hi, me!</a></li></ul></div>
<div id="main"><h2 class="heading">History</h2>${pag}<h3 class="landmark heading">History</h3><ol class="reading work index group">
${works.map(blurb).join("\n")}
</ol>${pag}</div></body></html>`;
}
const SAMPLE = [
  { id: 101, t: "The Long Way Home", a: ["inkwell"], f: ["Harry Potter - J. K. Rowling"], rt: "Teen And Up Audiences", cat: "M/M", done: 1, r: ["Draco Malfoy/Harry Potter"], c: ["Harry Potter", "Draco Malfoy"], g: ["Slow Burn", "Enemies to Lovers", "Fluff"], w: 120345, chp: 30, cht: 30, k: 5012, h: 90233, lv: "24 Nov 2026", v: 4, up: 0 },
  { id: 102, t: "Salt & Ash", a: ["kestrel", "moth"], f: ["Hades (Video Game)", "Greek and Roman Mythology"], rt: "Explicit", cat: "F/M, M/M", done: 0, r: ["Zagreus/Thanatos (Hades)"], c: ["Zagreus (Hades)"], g: ["Angst", "Hurt/Comfort"], w: 45001, chp: 7, cht: 0, k: 800, h: 9000, lv: "2 Mar 2026", v: 1, mfl: 1 },
  { id: 103, t: "<script>alert(1)</script>", a: [], anon: 1, f: ["Harry Potter - J. K. Rowling"], rt: "General Audiences", cat: "Gen", done: 1, r: [], c: ["Luna Lovegood"], g: ["No Beta We Die Like Men", "Fluff"], w: 1500, chp: 1, cht: 1, k: 30, h: 400, lv: "15 Jan 2026", v: 2 },
  { deleted: 1, lv: "3 Feb 2026" },
  { id: 99, t: "Old One", a: ["past"], f: ["Supernatural"], rt: "Mature", cat: "M/M", done: 1, r: ["Castiel/Dean Winchester"], c: [], g: ["Angst"], w: 9000, chp: 1, cht: 1, k: 10, h: 100, lv: "30 Dec 2025", v: 1 }
];
module.exports = { page, blurb, SAMPLE };
