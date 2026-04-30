/* ==========================================================================
   data-loader.js — Fetches /assets/data/*.json and caches per session.
   Usage:
     ILS.data.load("site").then(site => { ... });
     ILS.data.load("packages").then(pkgs => { ... });
   ========================================================================== */

(function () {
  "use strict";

  // Relative — resolves against the document's <base> tag so it works on
  // root-served and subpath-served deployments (e.g. GitHub Pages).
  var DATA_BASE = "assets/data/";
  var cache = Object.create(null);

  function load(name) {
    if (cache[name]) return cache[name];
    cache[name] = fetch(DATA_BASE + name + ".json", { credentials: "same-origin" })
      .then(function (res) {
        if (!res.ok) throw new Error("data fetch failed: " + name + " " + res.status);
        return res.json();
      })
      .catch(function (err) {
        console.error("[data-loader]", err);
        delete cache[name];
        throw err;
      });
    return cache[name];
  }

  window.ILS = window.ILS || {};
  window.ILS.data = { load: load };
})();
