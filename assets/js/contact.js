/* ==========================================================================
   contact.js — Wires the HoneyBook embed slot from site.json. If empty,
   leaves the form-only fallback. Also pre-fills tier from ?tier= query.
   ========================================================================== */

(function () {
  "use strict";

  function init() {
    if (!window.ILS || !window.ILS.data) return;

    var tierFromQuery = new URLSearchParams(window.location.search).get("tier");
    if (tierFromQuery) {
      var sel = document.querySelector("[data-contact-tier]");
      if (sel) {
        var match = Array.prototype.find.call(sel.options, function (o) { return o.value === tierFromQuery; });
        if (match) sel.value = tierFromQuery;
      }
    }

    var slot = document.querySelector("[data-honeybook]");
    if (!slot) return;

    window.ILS.data.load("site").then(function (site) {
      var html = (site && site.contact && site.contact.honeybook_smart_file_embed) || "";
      if (html) slot.innerHTML = html;
    });
  }

  document.addEventListener("partials:loaded", init);
  if (document.readyState === "complete") init();
})();
