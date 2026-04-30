/* ==========================================================================
   homepage.js — Renders the homepage packages-teaser row from packages.json.
   ========================================================================== */

(function () {
  "use strict";

  function init() {
    var slot = document.querySelector("[data-packages-teaser]");
    if (!slot || slot.dataset.bound) return;
    slot.dataset.bound = "1";
    if (!window.ILS || !window.ILS.data) return;

    window.ILS.data.load("packages").then(function (data) {
      var tiers = (data && data.tiers) || [];
      slot.innerHTML = tiers.map(function (t) {
        return (
          '<article class="package-card' + (t.featured ? " is-featured" : "") + '">' +
            (t.featured ? '<span class="package-card__badge">Most loved</span>' : "") +
            '<h3 class="package-card__name">' + escapeHtml(t.name) + '</h3>' +
            '<p class="package-card__tagline">' + escapeHtml(t.tagline || "") + '</p>' +
            '<p class="package-card__price">From $' + Number(t.price_from).toLocaleString() +
              '<small>' + (t.hours ? t.hours + " hours of coverage" : "") + '</small></p>' +
            '<div class="package-card__cta">' +
              '<a class="button is-text" href="pages/packages.html#' + t.id + '">See what\'s included &rarr;</a>' +
            '</div>' +
          '</article>'
        );
      }).join("");
    });
  }

  function escapeHtml(s) {
    return String(s || "").replace(/[&<>"']/g, function (m) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m];
    });
  }

  document.addEventListener("partials:loaded", init);
  if (document.readyState === "complete") init();
})();
