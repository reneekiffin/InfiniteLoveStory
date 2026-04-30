/* ==========================================================================
   packages.js — Renders the full Packages page from packages.json.
   ========================================================================== */

(function () {
  "use strict";

  function init() {
    var host = document.querySelector("[data-packages]");
    if (!host || host.dataset.bound) return;
    host.dataset.bound = "1";
    if (!window.ILS || !window.ILS.data) return;

    window.ILS.data.load("packages").then(function (data) {
      var tiers = (data && data.tiers) || [];

      host.innerHTML = tiers.map(function (t) {
        return (
          '<article id="' + t.id + '" class="package-detail' + (t.featured ? " is-featured" : "") + '">' +
            '<h2 class="package-detail__name">' + escapeHtml(t.name) + '</h2>' +
            '<p class="package-detail__tagline">' + escapeHtml(t.tagline || "") + '</p>' +
            '<p class="package-detail__price">From $' + Number(t.price_from).toLocaleString() + '</p>' +
            '<p class="package-detail__hours">' + (t.hours || "") + ' hours of coverage</p>' +
            '<p class="package-detail__best-for"><em>Best for: ' + escapeHtml(t.best_for || "") + '</em></p>' +
            '<div class="package-detail__included">' +
              '<h3>What&rsquo;s included</h3>' +
              '<ul class="package-detail__list">' +
                (t.included || []).map(function (i) { return '<li><span>' + escapeHtml(i) + '</span></li>'; }).join("") +
              '</ul>' +
            '</div>' +
            '<div class="package-detail__addons">' +
              '<h3>Add-ons</h3>' +
              '<ul class="package-detail__list">' +
                (t.addons || []).map(function (a) { return '<li><span>' + escapeHtml(a) + '</span></li>'; }).join("") +
              '</ul>' +
            '</div>' +
            '<div class="package-detail__cta">' +
              '<a class="button is-primary" href="contact.html?tier=' + encodeURIComponent(t.id) + '">Begin with ' + escapeHtml(t.name) + '</a>' +
            '</div>' +
          '</article>'
        );
      }).join("");

      // Footnote
      var fn = document.querySelector("[data-packages-footnote]");
      if (fn && data.footnote) fn.textContent = data.footnote;
      var intro = document.querySelector("[data-packages-intro]");
      if (intro && data.intro) intro.textContent = data.intro;
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
