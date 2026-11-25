/* FicWrapped card renderer: draws each Wrapped card on a 1080×1920 canvas, plus the printable poster. */
(function (root) {
  "use strict";
  const W = 1080, H = 1920, M = 96;
  const C = { ink: "#1d1b36", paper: "#fffefa", violet: "#7b5cff", sun: "#ffd23f", coral: "#ff6b57", mint: "#3ddc97", lilac: "#e9e4ff",
    G: "#3ddc97", T: "#ffd23f", Mt: "#ff9f43", E: "#ff4d5e", NR: "#b8b3cc" };
  const D = '"Bricolage Grotesque", system-ui, sans-serif', S = 'Literata, Georgia, serif';
  const fmt = n => Number(n || 0).toLocaleString("en-US");
  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const MONTHS_LONG = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const RCOL = { "General Audiences": C.G, "Teen And Up Audiences": C.T, "Mature": C.Mt, "Explicit": C.E, "Not Rated": C.NR };
  const RSHORT = { "General Audiences": "General", "Teen And Up Audiences": "Teen and up", "Mature": "Mature", "Explicit": "Explicit", "Not Rated": "Not rated" };

  function font(ctx, size, weight, fam, italic) { ctx.font = `${italic ? "italic " : ""}${weight} ${size}px ${fam}`; }
  function lines(ctx, text, maxW, maxLines) {
    const words = String(text).split(/\s+/); const out = []; let cur = "";
    for (const w of words) {
      const t = cur ? cur + " " + w : w;
      if (ctx.measureText(t).width <= maxW || !cur) cur = t; else { out.push(cur); cur = w; }
    }
    if (cur) out.push(cur);
    for (let i = 0; i < out.length; i++) while (ctx.measureText(out[i]).width > maxW && out[i].length > 1) out[i] = out[i].slice(0, -1);
    if (out.length > maxLines) { out.length = maxLines; let l = out[maxLines - 1]; while (ctx.measureText(l + "…").width > maxW && l.length) l = l.slice(0, -1); out[maxLines - 1] = l.replace(/[\s,.;:]+$/, "") + "…"; }
    return out;
  }
  function text(ctx, str, x, y, maxW, lh, maxLines) { const ls = lines(ctx, str, maxW, maxLines || 99); ls.forEach((l, i) => ctx.fillText(l, x, y + i * lh)); return y + ls.length * lh; }
  function fit(ctx, str, maxW, size, weight, fam, min) { let s = size; font(ctx, s, weight, fam); while (ctx.measureText(str).width > maxW && s > (min || 40)) { s -= 4; font(ctx, s, weight, fam); } return s; }
  function box(ctx, x, y, w, h, fill, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r == null ? 18 : r); ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = C.ink; ctx.stroke(); }
  function sticker(ctx, x, y, w, h, fill, r) { ctx.save(); ctx.beginPath(); ctx.roundRect(x + 14, y + 14, w, h, r == null ? 18 : r); ctx.fillStyle = C.ink; ctx.fill(); ctx.restore(); box(ctx, x, y, w, h, fill, r); }
  // the four AO3-style symbol squares, used as FicWrapped's mark
  function squares(ctx, x, y, s, cols) { (cols || [C.mint, C.sun, C.coral, C.violet]).forEach((c, i) => { const xx = x + (i % 2) * (s + 8), yy = y + Math.floor(i / 2) * (s + 8); ctx.fillStyle = c; ctx.fillRect(xx, yy, s, s); ctx.lineWidth = 4; ctx.strokeStyle = C.ink; ctx.strokeRect(xx, yy, s, s); }); }

  function frame(ctx, bg, fg, st, opts, idx, total) {
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = fg; ctx.textBaseline = "alphabetic";
    font(ctx, 34, 600, D);
    ctx.fillText(`${opts.user ? opts.user + "'s " : ""}${st.year === "all" ? "all-time" : st.year} AO3 Wrapped`, M, 120);
    if (total) { // progress ticks like a story
      const tw = (W - 2 * M - (total - 1) * 8) / total;
      for (let i = 0; i < total; i++) { ctx.globalAlpha = i <= idx ? 1 : 0.25; ctx.fillRect(M + i * (tw + 8), 52, tw, 8); }
      ctx.globalAlpha = 1;
    }
    if (!opts.clean) { font(ctx, 30, 600, D); ctx.globalAlpha = 0.8; ctx.fillText("ficwrapped.pages.dev", M, H - 78); ctx.globalAlpha = 1; }
    else { font(ctx, 30, 600, D); ctx.globalAlpha = 0.55; ctx.fillText("FicWrapped", M, H - 78); ctx.globalAlpha = 1; }
    squares(ctx, W - M - 64, H - 122, 28);
  }

  function rankList(ctx, list, y, fg, accent, opts) {
    const max = list[0] ? list[0].n : 1; const o = Object.assign({ n: 5, label: x => x.name, unit: "fic", size: 54 }, opts || {});
    list.slice(0, o.n).forEach((x, i) => {
      ctx.fillStyle = fg; font(ctx, 44, 800, D); ctx.fillText(String(i + 1), M, y + 50);
      font(ctx, o.size, 700, D); const ty = text(ctx, o.label(x), M + 80, y + 50, W - 2 * M - 80, o.size * 1.08, 2);
      const bw = Math.max(24, (W - 2 * M - 80) * x.n / max);
      ctx.fillStyle = accent; ctx.fillRect(M + 80, ty - 18, bw, 22); ctx.lineWidth = 4; ctx.strokeStyle = C.ink; ctx.strokeRect(M + 80, ty - 18, bw, 22);
      ctx.fillStyle = fg; font(ctx, 32, 400, D); ctx.fillText(`${fmt(x.n)} ${o.unit}${x.n === 1 ? "" : "s"}`, M + 80, ty + 42);
      y = ty + 92;
    });
    return y;
  }

  const CARDS = {
    cover(ctx, st, o) {
      ctx.fillStyle = C.paper; font(ctx, 72, 600, D); text(ctx, o.user ? `${o.user}'s` : "Your", M, 470, W - 2 * M, 80, 2);
      const yr = st.year === "all" ? "Ever" : String(st.year);
      fit(ctx, yr, W - 2 * M, 400, 800, D, 120); ctx.fillText(yr, M - 10, 830);
      font(ctx, 72, 600, D); ctx.fillText("on AO3,", M, 960); ctx.fillText("wrapped.", M, 1045);
      sticker(ctx, M, 1220, W - 2 * M, 300, C.sun);
      ctx.fillStyle = C.ink; font(ctx, 46, 400, S, true);
      text(ctx, `${fmt(st.works)} fics, ${fmt(st.words)} words, and one very full History page.`, M + 44, 1310, W - 2 * M - 88, 62, 3);
      return C.violet;
    },
    numbers(ctx, st) {
      ctx.fillStyle = C.paper; font(ctx, 60, 600, D); ctx.fillText("You opened", M, 400);
      fit(ctx, fmt(st.works), W - 2 * M, 360, 800, D, 120); ctx.fillStyle = C.sun; ctx.fillText(fmt(st.works), M - 8, 720);
      ctx.fillStyle = C.paper; font(ctx, 60, 600, D); ctx.fillText(st.works === 1 ? "fic" : "different fics", M, 810);
      const rows = [[fmt(st.words), "words, give or take"], [st.novels >= 1 ? `≈ ${st.novels}` : "< 1", st.novels === 1 ? "novel's worth" : "novels' worth"], [fmt(st.hours), st.hours === 1 ? "hour of reading" : "hours of reading"], [fmt(st.visits), "visits in total"]];
      let y = 980;
      rows.forEach(([a, b], i) => { ctx.fillStyle = [C.mint, C.coral, C.violet, C.sun][i]; ctx.fillRect(M, y - 52, 18, 64); ctx.fillStyle = C.paper; font(ctx, 70, 800, D); ctx.fillText(a, M + 44, y); const aw = ctx.measureText(a).width; font(ctx, 40, 400, D); ctx.fillText(b, M + 64 + aw, y); y += 150; });
      ctx.globalAlpha = 0.7; font(ctx, 30, 400, D); text(ctx, "Words count every fic you opened, finished or not. Reading time assumes 250 words a minute.", M, 1640, W - 2 * M, 40, 2); ctx.globalAlpha = 1;
      return C.ink;
    },
    fandoms(ctx, st) {
      ctx.fillStyle = C.ink; font(ctx, 96, 800, D); text(ctx, "Where you lived", M, 330, W - 2 * M, 100, 2);
      font(ctx, 40, 400, S, true); ctx.fillText(`${st.fandoms.length} fandom${st.fandoms.length === 1 ? "" : "s"} this year`, M, 420);
      rankList(ctx, st.fandoms, 520, C.ink, C.paper, { label: x => x.short });
      return C.sun;
    },
    ships(ctx, st) {
      ctx.fillStyle = C.ink; font(ctx, 96, 800, D); text(ctx, "The ships you sailed", M, 330, W - 2 * M, 100, 2);
      rankList(ctx, st.ships, 560, C.ink, C.paper, { size: 50 });
      return C.coral;
    },
    characters(ctx, st) {
      ctx.fillStyle = C.ink; font(ctx, 96, 800, D); text(ctx, "Who you kept coming back to", M, 330, W - 2 * M, 100, 2);
      rankList(ctx, st.chars, 560, C.ink, C.paper);
      return C.mint;
    },
    tags(ctx, st) {
      ctx.fillStyle = C.ink; fit(ctx, "Your tags, wrangled", W - 2 * M, 96, 800, D, 60); ctx.fillText("Your tags, wrangled", M, 330);
      font(ctx, 40, 400, S, true); ctx.fillText("The additional tags you read most", M, 420);
      const list = st.tags.slice(0, 14); const max = list[0] ? list[0].n : 1;
      let x = M, y = 560;
      list.forEach((t, i) => {
        const size = Math.round(40 + 44 * Math.sqrt(t.n / max));
        font(ctx, size, i < 3 ? 800 : 600, D);
        let label = t.name.length > 34 ? t.name.slice(0, 33) + "…" : t.name;
        while (ctx.measureText(label + ",").width > W - 2 * M && label.length > 4) label = label.slice(0, -2) + "…";
        const w = ctx.measureText(label + ",").width;
        if (x + w > W - M && x > M) { x = M; y += size + 34; }
        if (y > 1640) return;
        ctx.fillStyle = [C.violet, C.ink, C.coral][i % 3];
        ctx.fillText(label, x, y);
        ctx.fillRect(x, y + 8, ctx.measureText(label).width, 5);
        ctx.fillStyle = C.ink; if (i < list.length - 1) ctx.fillText(",", x + ctx.measureText(label).width, y);
        x += w + 24;
      });
      return C.lilac;
    },
    ratings(ctx, st) {
      ctx.fillStyle = C.paper; font(ctx, 96, 800, D); text(ctx, "How spicy was your year?", M, 330, W - 2 * M, 100, 2);
      const max = Math.max(1, ...st.ratings.map(r => r.n)); let y = 620;
      st.ratings.forEach(r => {
        ctx.fillStyle = RCOL[r.name]; ctx.fillRect(M, y - 54, 64, 64); ctx.lineWidth = 4; ctx.strokeStyle = C.paper; ctx.strokeRect(M, y - 54, 64, 64);
        ctx.fillStyle = C.paper; font(ctx, 48, 700, D); ctx.fillText(RSHORT[r.name], M + 96, y);
        font(ctx, 40, 400, D); const pct = st.works ? Math.round(r.n / st.works * 100) : 0; ctx.fillText(`${fmt(r.n)} · ${pct}%`, M + 96, y + 52);
        ctx.fillStyle = RCOL[r.name]; ctx.fillRect(M + 520, y - 30, Math.max(6, (W - 2 * M - 520) * r.n / max), 34);
        y += 170;
      });
      const cats = st.cats.slice(0, 4).map(c => `${c.name} ${Math.round(c.n / Math.max(1, st.works) * 100)}%`).join("   ");
      if (cats) { ctx.fillStyle = C.paper; font(ctx, 40, 400, S, true); ctx.fillText("Categories", M, 1530); font(ctx, 46, 700, D); text(ctx, cats, M, 1600, W - 2 * M, 56, 2); }
      return C.ink;
    },
    reread(ctx, st) {
      const w = st.reread;
      ctx.fillStyle = C.paper; font(ctx, 96, 800, D); text(ctx, "The one you couldn't put down", M, 330, W - 2 * M, 100, 2);
      font(ctx, 64, 600, S, true); const tl = Math.min(4, lines(ctx, w.t, W - 2 * M - 100, 4).length);
      const boxH = 360 + tl * 76;
      sticker(ctx, M, 560, W - 2 * M, boxH, C.paper);
      ctx.fillStyle = C.ink; font(ctx, 64, 600, S, true); let y = text(ctx, w.t, M + 50, 680, W - 2 * M - 100, 76, 4);
      font(ctx, 40, 400, D); y = text(ctx, "by " + w.a.join(", "), M + 50, y + 30, W - 2 * M - 100, 50, 1);
      ctx.fillStyle = C.violet; y = text(ctx, (w.f || []).map(f => root.FW ? root.FW.shortFandom(f) : f).join(", "), M + 50, y + 10, W - 2 * M - 100, 50, 1);
      ctx.fillStyle = C.ink; font(ctx, 36, 400, D); ctx.fillText(`${fmt(w.w)} words`, M + 50, 560 + boxH - 50);
      ctx.fillStyle = C.paper; font(ctx, 150, 800, D); ctx.fillText(`${fmt(w.v)}×`, M, 1560);
      font(ctx, 46, 600, D); ctx.fillText(w.v > 1 ? "visits. You kept coming back." : "Every fic got one visit. Restraint!", M, 1640);
      return C.violet;
    },
    longhaul(ctx, st) {
      const w = st.longest;
      ctx.fillStyle = C.ink; font(ctx, 96, 800, D); ctx.fillText("The long haul", M, 330);
      font(ctx, 40, 400, S, true); ctx.fillText("Your longest fic this year", M, 420);
      fit(ctx, fmt(w.w), W - 2 * M, 220, 800, D, 100); ctx.fillText(fmt(w.w), M - 6, 640);
      font(ctx, 48, 600, D); ctx.fillText("words", M, 710);
      font(ctx, 54, 600, S, true); let y = text(ctx, w.t, M, 820, W - 2 * M, 66, 3);
      font(ctx, 38, 400, D); text(ctx, "by " + w.a.join(", "), M, y + 16, W - 2 * M, 48, 1);
      sticker(ctx, M, 1160, W - 2 * M, 400, C.paper);
      ctx.fillStyle = C.ink; font(ctx, 120, 800, D); ctx.fillText(`${Math.round(st.wipShare * 100)}%`, M + 50, 1310);
      font(ctx, 42, 600, D); text(ctx, "of your fics were still works in progress. Brave.", M + 50, 1390, W - 2 * M - 100, 52, 2);
      font(ctx, 36, 400, D); ctx.fillText(`${fmt(st.oneshots)} oneshots · average fic ${fmt(st.avgWords)} words`, M + 50, 1510);
      return C.sun;
    },
    months(ctx, st) {
      ctx.fillStyle = C.ink; font(ctx, 96, 800, D); ctx.fillText("Your reading year", M, 330);
      const b = st.busiest; font(ctx, 44, 400, S, true); text(ctx, `${MONTHS_LONG[b]} was your biggest month, with ${fmt(st.months[b])} fic${st.months[b] === 1 ? "" : "s"}.`, M, 430, W - 2 * M, 56, 2);
      const max = Math.max(1, ...st.months); const bw = (W - 2 * M) / 12; const base = 1500, hgt = 820;
      st.months.forEach((n, i) => {
        const h = Math.max(6, hgt * n / max); ctx.fillStyle = i === b ? C.coral : C.violet;
        ctx.fillRect(M + i * bw + 6, base - h, bw - 12, h); ctx.lineWidth = 4; ctx.strokeStyle = C.ink; ctx.strokeRect(M + i * bw + 6, base - h, bw - 12, h);
        ctx.fillStyle = C.ink; font(ctx, 28, 600, D); ctx.textAlign = "center"; ctx.fillText(MONTHS[i][0], M + i * bw + bw / 2, base + 44); ctx.textAlign = "left";
      });
      ctx.globalAlpha = 0.7; font(ctx, 30, 400, D); text(ctx, "AO3 only remembers the last time you opened each fic, so rereads count in the month you last visited.", M, 1640, W - 2 * M, 40, 2); ctx.globalAlpha = 1;
      return C.paper;
    },
    type(ctx, st) {
      const t = st.type;
      ctx.fillStyle = C.ink; font(ctx, 52, 600, D); ctx.fillText("Your reader type", M, 380);
      const name = t.name.replace(/^The /, "");
      font(ctx, 52, 400, S, true); ctx.fillText("The", M, 520);
      font(ctx, 132, 800, D); let y = text(ctx, name, M, 670, W - 2 * M, 136, 4);
      sticker(ctx, M, y + 40, W - 2 * M, 330, C.paper);
      ctx.fillStyle = C.ink; font(ctx, 46, 400, S, true); text(ctx, t.line, M + 44, y + 130, W - 2 * M - 88, 60, 4);
      if (t.traits.length) { font(ctx, 40, 600, D); text(ctx, "With a side of: " + t.traits.join(", "), M, y + 470, W - 2 * M, 52, 2); }
      return C.coral;
    },
    summary(ctx, st, o) {
      ctx.fillStyle = C.ink; font(ctx, 46, 400, S, true); ctx.fillText(st.year === "all" ? "A reading history in one work" : `A ${st.year} in one work`, M, 270);
      sticker(ctx, M, 320, W - 2 * M, 1300, C.paper, 10);
      let y = 420; const L = M + 40, R = W - M - 40, kw = 300;
      const row = (k, v, color) => {
        if (!v) return; ctx.fillStyle = C.ink; font(ctx, 32, 700, D); ctx.fillText(k, L, y);
        ctx.fillStyle = color || C.violet; font(ctx, 36, 400, D); const ny = text(ctx, v, L + kw, y, R - L - kw, 46, 3); y = Math.max(ny, y + 46) + 26;
      };
      const topR = st.ratings.slice().sort((a, b) => b.n - a.n)[0];
      row("Rating:", topR && topR.n ? topR.name : "", C.ink);
      row("Fandoms:", st.fandoms.slice(0, 4).map(f => f.short).join(", "));
      row("Relationships:", st.ships.slice(0, 3).map(s => s.name).join(", "));
      row("Characters:", st.chars.slice(0, 4).map(s => s.name).join(", "));
      row("Additional Tags:", st.tags.slice(0, 6).map(s => s.name).join(", "));
      y += 10; ctx.fillStyle = C.ink; ctx.fillRect(L, y - 20, R - L, 4); y += 50;
      font(ctx, 64, 800, D); y = text(ctx, `${o.user ? o.user + "'s" : "My"} ${st.year === "all" ? "AO3" : st.year}`, L, y, R - L, 70, 2);
      font(ctx, 36, 400, S, true); ctx.fillText("Reader type: " + st.type.name.replace(/^The /, ""), L, y + 10); y += 90;
      ctx.fillStyle = C.ink; font(ctx, 32, 700, D);
      const stats = [["Works", fmt(st.works)], ["Words", fmt(st.words)], ["Visits", fmt(st.visits)], ["Fandoms", fmt(st.fandoms.length)]];
      stats.forEach(([k, v], i) => { const x = L + (i % 2) * ((R - L) / 2), yy = y + Math.floor(i / 2) * 110; font(ctx, 30, 600, D); ctx.fillText(k + ":", x, yy); font(ctx, 54, 800, D); ctx.fillText(v, x, yy + 58); });
      return C.lilac;
    }
  };

  function plan(st) {
    const ids = ["cover", "numbers", "fandoms"];
    if (st.ships.length) ids.push("ships");
    if (st.chars.length) ids.push("characters");
    if (st.tags.length >= 3) ids.push("tags");
    ids.push("ratings");
    if (st.reread) ids.push("reread");
    if (st.longest && st.longest.w) ids.push("longhaul");
    if (st.year !== "all") ids.push("months");
    ids.push("type", "summary");
    return ids;
  }

  function draw(canvas, id, st, opts) {
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");
    const ids = plan(st); const idx = ids.indexOf(id);
    // draw content first on a scratch canvas to learn its background colour, then compose
    const tmp = document.createElement("canvas"); tmp.width = W; tmp.height = H;
    const t = tmp.getContext("2d");
    const bg = CARDS[id](t, st, opts || {});
    const fg = bg === C.ink || bg === C.violet ? C.paper : C.ink;
    frame(ctx, bg, fg, st, opts || {}, idx, ids.length);
    ctx.drawImage(tmp, 0, 0);
    return canvas;
  }

  // Printable poster (Supporter Pack): A-series ratio, 2480×3508 = A4 at 300 dpi
  function poster(canvas, st, opts) {
    const PW = 2480, PH = 3508, pm = 180; canvas.width = PW; canvas.height = PH;
    const ctx = canvas.getContext("2d");
    const theme = (opts && opts.theme) || "violet";
    const bg = { violet: C.violet, ink: C.ink, paper: C.paper }[theme] || C.violet;
    const fg = theme === "paper" ? C.ink : C.paper;
    ctx.fillStyle = bg; ctx.fillRect(0, 0, PW, PH);
    ctx.fillStyle = fg; font(ctx, 90, 600, D); ctx.fillText(`${opts.user ? opts.user + "'s" : "My"} AO3 year`, pm, 300);
    const yr = st.year === "all" ? "All time" : String(st.year);
    fit(ctx, yr, PW - 2 * pm, 620, 800, D, 200); ctx.fillText(yr, pm - 20, 860);
    // big numbers
    const nums = [[fmt(st.works), "fics"], [fmt(st.words), "words"], [fmt(st.hours), "hours"], [fmt(st.fandoms.length), "fandoms"]];
    const colW = (PW - 2 * pm) / 4;
    nums.forEach(([v, k], i) => { const x = pm + i * colW; ctx.fillStyle = [C.sun, C.mint, C.coral, C.lilac][i]; fit(ctx, v, colW - 50, 130, 800, D, 60); ctx.fillText(v, x, 1120); ctx.fillStyle = fg; font(ctx, 56, 600, D); ctx.fillText(k, x, 1200); });
    // panels
    const panel = (x, y, w, h, title, list, label) => {
      sticker(ctx, x, y, w, h, C.paper, 24);
      ctx.fillStyle = C.ink; font(ctx, 72, 800, D); ctx.fillText(title, x + 60, y + 130);
      let yy = y + 240; (list || []).slice(0, 5).forEach((it, i) => { font(ctx, 52, 800, D); ctx.fillText(String(i + 1), x + 60, yy); font(ctx, 48, 400, D); const cnt = fmt(it.n); const cw = ctx.measureText(cnt).width; ctx.textAlign = "right"; ctx.fillText(cnt, x + w - 60, yy); ctx.textAlign = "left";
        font(ctx, 52, 600, D); text(ctx, label ? label(it) : it.name, x + 130, yy, w - 230 - cw, 60, 1); yy += 100; });
      if (!list || !list.length) { font(ctx, 48, 400, S, true); ctx.fillText("Nothing tagged here", x + 60, yy); }
    };
    const pw = (PW - 2 * pm - 80) / 2;
    panel(pm, 1360, pw, 760, "Fandoms", st.fandoms, x => x.short);
    panel(pm + pw + 80, 1360, pw, 760, "Ships", st.ships);
    panel(pm, 2200, pw, 760, "Characters", st.chars);
    panel(pm + pw + 80, 2200, pw, 760, "Tags", st.tags);
    ctx.fillStyle = fg; font(ctx, 64, 400, S, true); ctx.fillText("Reader type", pm, 3130);
    font(ctx, 110, 800, D); text(ctx, st.type.name.replace(/^The /, ""), pm, 3260, PW - 2 * pm - 300, 120, 1);
    squares(ctx, PW - pm - 150, 3120, 64);
    ctx.globalAlpha = 0.7; font(ctx, 40, 400, D); ctx.fillText("Made with FicWrapped from my AO3 History", pm, 3410); ctx.globalAlpha = 1;
    return canvas;
  }

  // Minimal one-page PDF with a full-bleed JPEG (A4).
  async function pdfFromCanvas(canvas) {
    const blob = await new Promise(r => canvas.toBlob(r, "image/jpeg", 0.92));
    const jpg = new Uint8Array(await blob.arrayBuffer());
    const enc = new TextEncoder(); const parts = []; const offs = []; let len = 0;
    const push = b => { const u = typeof b === "string" ? enc.encode(b) : b; parts.push(u); len += u.length; };
    const obj = (n, body) => { offs[n] = len; push(`${n} 0 obj\n`); body(); push("\nendobj\n"); };
    const pw = 595.28, ph = 841.89;
    push("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");
    obj(1, () => push("<< /Type /Catalog /Pages 2 0 R >>"));
    obj(2, () => push("<< /Type /Pages /Kids [3 0 R] /Count 1 >>"));
    obj(3, () => push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pw} ${ph}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>`));
    obj(4, () => { push(`<< /Type /XObject /Subtype /Image /Width ${canvas.width} /Height ${canvas.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpg.length} >>\nstream\n`); push(jpg); push("\nendstream"); });
    const content = `q ${pw} 0 0 ${ph} 0 0 cm /Im0 Do Q`;
    obj(5, () => push(`<< /Length ${content.length} >>\nstream\n${content}\nendstream`));
    const xref = len;
    push(`xref\n0 6\n0000000000 65535 f \n${offs.slice(1).map(o => String(o).padStart(10, "0") + " 00000 n \n").join("")}trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`);
    return new Blob(parts, { type: "application/pdf" });
  }

  root.FWCards = { W, H, plan, draw, poster, pdfFromCanvas, C, RSHORT };
})(typeof self !== "undefined" ? self : this);
