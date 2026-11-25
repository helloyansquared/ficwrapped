/* FicWrapped collector. The FicWrapped bookmark loads this file on archiveofourown.org.
   It reads YOUR History pages (/users/you/readings) in this tab, slowly, the same way you would by
   clicking "Next", and hands the result to ficwrapped.pages.dev in a new tab.
   It never reads or sends your password, cookies or anything outside your History, and it sends
   nothing to any server: the data goes straight from this tab to the FicWrapped tab you open. */
(function () {
  "use strict";
  var SITE = "https://ficwrapped.pages.dev/";
  var SITE_ORIGIN = new URL(SITE).origin;
  if (window.__ficwrapped) { window.__ficwrapped.show(); return; }

  var host = document.createElement("div");
  host.id = "ficwrapped-panel";
  host.style.cssText = "position:fixed;z-index:2147483647;right:12px;bottom:12px;left:auto;max-width:min(380px,calc(100vw - 24px));";
  var root = host.attachShadow({ mode: "open" });
  root.innerHTML = '<style>' +
    ':host{all:initial}*{box-sizing:border-box}' +
    '.p{font:15px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:#1d1b36;background:#fffefa;border:2px solid #1d1b36;border-radius:14px;box-shadow:6px 6px 0 #1d1b36;padding:16px 16px 14px;width:100%}' +
    'h2{font:800 19px/1.2 system-ui,sans-serif;margin:0 22px 8px 0}p{margin:6px 0}small{color:#5d5873}' +
    '.x{position:absolute;top:8px;right:10px;border:0;background:none;font-size:22px;cursor:pointer;color:#1d1b36;min-width:36px;min-height:36px}' +
    'button.go,a.go{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:0 16px;border-radius:10px;border:2px solid #1d1b36;background:#ffd23f;color:#1d1b36;font:700 15px system-ui,sans-serif;cursor:pointer;text-decoration:none;margin:8px 8px 0 0}' +
    'button.alt{background:#fff}button:disabled{opacity:.5;cursor:default}' +
    'label{display:flex;gap:8px;align-items:center;margin:6px 0;min-height:32px}select{font:inherit;padding:6px;border-radius:8px;border:1px solid #1d1b36;background:#fff;color:#1d1b36}' +
    '.bar{height:10px;border:2px solid #1d1b36;border-radius:6px;overflow:hidden;margin:10px 0 4px;background:#fff}.bar i{display:block;height:100%;width:0;background:#7b5cff;transition:width .3s}' +
    '.err{color:#a1122a;font-weight:600}' +
    '</style><div class="p" role="dialog" aria-label="FicWrapped"><button class="x" aria-label="Close" title="Close">×</button><div id="b"></div></div>';
  document.body.appendChild(host);
  var box = root.getElementById("b");
  root.querySelector(".x").onclick = function () { stop = true; host.remove(); window.__ficwrapped = null; };
  window.__ficwrapped = { show: function () { host.style.display = ""; } };

  var stop = false, items = [], user = null, year = new Date().getFullYear(), mode = "year", withMfl = false, done = false;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function view(html) { box.innerHTML = html; }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  function loadCore() {
    if (window.FW && window.FW.parseReadingsDoc) return Promise.resolve();
    return new Promise(function (res, rej) {
      var s = document.createElement("script");
      s.src = SITE + "core.js?v=30784a83";
      s.onload = res; s.onerror = function () { rej(new Error("core")); };
      document.head.appendChild(s);
    });
  }

  var onAO3 = /(^|\.)archiveofourown\.org$|(^|\.)ao3\.org$/.test(location.hostname);
  if (!onAO3) {
    view('<h2>Open AO3 first</h2><p>This bookmark works on the Archive of Our Own. Open AO3, log in, then tap the FicWrapped bookmark again.</p><a class="go" href="https://archiveofourown.org/">Go to AO3</a>');
    return;
  }
  var g = document.querySelector('#greeting a[href^="/users/"]') || document.querySelector('#header a[href^="/users/"][href$="/readings"]');
  if (g) { var m = /\/users\/([^/?#]+)/.exec(g.getAttribute("href")); if (m) user = decodeURIComponent(m[1]); }
  if (!user) {
    view('<h2>Log in to AO3 first</h2><p>FicWrapped reads your AO3 History, which only you can see while you\'re logged in. Log in here as usual, then tap the bookmark again.</p><p><small>FicWrapped never sees your password.</small></p><a class="go" href="/users/login">Log in to AO3</a>');
    return;
  }

  var thisYear = new Date().getFullYear();
  view('<h2>Your AO3 Wrapped</h2><p>Hi, ' + esc(user) + '. FicWrapped will read your History pages here, one every second or so, then open your Wrapped in a new tab.</p>' +
    '<label>Year <select id="yr"><option value="' + thisYear + '">' + thisYear + '</option><option value="' + (thisYear - 1) + '">' + (thisYear - 1) + '</option><option value="all">All time (slower)</option></select></label>' +
    '<label><input type="checkbox" id="mfl"> Also save my Marked for Later list</label>' +
    '<button class="go" id="start">Read my History</button><p><small>Nothing is sent to FicWrapped\'s server. Your password and cookies are never touched.</small></p>');
  root.getElementById("start").onclick = function () {
    var v = root.getElementById("yr").value;
    mode = v === "all" ? "all" : "year"; year = v === "all" ? "all" : Number(v);
    withMfl = root.getElementById("mfl").checked;
    run().catch(function (e) { view('<h2>Something went wrong</h2><p class="err">' + esc(e.message || e) + '</p><p>Reload AO3 and tap the bookmark again. If it keeps happening, email hello@yansquared.com.</p>'); });
  };

  function progress(text, frac, extra) {
    view('<h2>Reading your History…</h2><div class="bar"><i style="width:' + Math.round(Math.min(1, frac) * 100) + '%"></i></div><p>' + text + '</p>' +
      (extra || "") + '<button class="go alt" id="halt">Stop and use what\'s loaded</button>');
    var h = root.getElementById("halt"); if (h) h.onclick = function () { stop = true; };
  }

  function fetchPage(url, label, frac) {
    var tries = 0;
    function attempt() {
      return fetch(url, { credentials: "same-origin", headers: { "Accept": "text/html" } }).then(function (r) {
        return r.text().then(function (t) { return { r: r, t: t }; });
      }).then(function (x) {
        var limited = x.r.status === 429 || x.r.status === 503 || (/Retry later/i.test(x.t) && !/li class="[^"]*reading/.test(x.t));
        if (limited) {
          if (++tries > 6) throw new Error("AO3 is asking us to slow down. Wait a few minutes, then try again.");
          var wait = Math.min(180, parseInt(x.r.headers.get("Retry-After") || "", 10) || 30 * tries);
          var left = wait;
          return new Promise(function (res) {
            var iv = setInterval(function () {
              if (stop) { clearInterval(iv); res(null); return; }
              progress(label + "<br>AO3 asked for a short break. Carrying on in " + left + "s.", frac);
              if (--left < 0) { clearInterval(iv); res(attempt()); }
            }, 1000);
          });
        }
        if (!x.r.ok) throw new Error("AO3 answered " + x.r.status + " for " + url);
        return new DOMParser().parseFromString(x.t, "text/html");
      });
    }
    return attempt();
  }

  function collect(show, cutoff, label) {
    var base = "/users/" + encodeURIComponent(user) + "/readings" + (show ? "?show=" + show + "&" : "?");
    var page = 1, last = 1, out = [];
    function next() {
      if (stop) return Promise.resolve(out);
      var frac = last > 1 ? (page - 1) / last : 0;
      progress(label + " page " + page + (last > 1 ? " of " + last : "") + " · " + out.length + " fics so far", frac);
      return fetchPage(base + "page=" + page, label + " page " + page, frac).then(function (doc) {
        if (!doc) return out;
        var p = window.FW.parseReadingsDoc(doc);
        if (page === 1 && !p.items.length) {
          if (doc.querySelector("#new_user, form#loginform, #login")) throw new Error("AO3 logged you out. Log in again and tap the bookmark.");
          return out;
        }
        last = Math.max(last, p.last);
        out = out.concat(p.items);
        var older = cutoff && p.items.length && p.items.every(function (it) { return it.lv && it.lv < cutoff; });
        if (!p.next || older || stop) return out;
        page++;
        return sleep(1100).then(next);
      });
    }
    return next();
  }

  function run() {
    return loadCore().then(function () {
      var cutoff = mode === "year" ? year + "-01-01" : null;
      return collect("", cutoff, "History");
    }).then(function (hist) {
      items = hist;
      if (!withMfl || stop) return;
      stop = false;
      return sleep(1100).then(function () { return collect("to-read", null, "Marked for Later"); }).then(function (m) {
        m.forEach(function (it) { it.mfl = 1; });
        items = window.FW.merge([items, m]);
      });
    }).then(finish);
  }

  var payload = null;
  function finish() {
    done = true;
    var n = items.filter(function (it) { return !it.del && (year === "all" || (it.lv || "").slice(0, 4) === String(year)); }).length;
    payload = { v: 1, user: user, year: year, at: new Date().toISOString(), items: items };
    if (!items.length) {
      view('<h2>Your History looks empty</h2><p>AO3 only keeps History if it\'s switched on. Check <a href="/users/' + encodeURIComponent(user) + '/preferences" style="color:#5b3cff">Preferences</a> → "Turn on History", read a few fics, then try again.</p>');
      return;
    }
    view('<h2>Done: ' + n + ' fic' + (n === 1 ? "" : "s") + (year === "all" ? "" : " in " + year) + '</h2><p>Open your Wrapped in a new tab. Keep this tab open until it loads.</p>' +
      '<button class="go" id="open">Open my Wrapped</button><button class="go alt" id="dl">Save data file</button><p><small>If the new tab can\'t get your data, use "Save data file" and drop the file onto FicWrapped.</small></p>');
    root.getElementById("open").onclick = function () { window.open(SITE + "#from-ao3", "_blank"); };
    root.getElementById("dl").onclick = function () {
      var blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      var a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "ficwrapped-" + user + "-" + year + ".json";
      document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    };
  }

  window.addEventListener("message", function (e) {
    if (e.origin !== SITE_ORIGIN || !e.data || e.data.type !== "fw-ready" || !payload) return;
    e.source.postMessage({ type: "fw-data", payload: payload }, SITE_ORIGIN);
    view('<h2>Sent to your Wrapped tab</h2><p>Your Wrapped is open in the other tab. You can close this box.</p>');
  });
})();
