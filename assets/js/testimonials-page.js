/* ==========================================================================
   testimonials-page.js — Full testimonials grid for /pages/testimonials.html.
   ========================================================================== */

(function () {
  "use strict";

  function init() {
    var host = document.querySelector("[data-testimonials-grid]");
    if (!host || host.dataset.bound) return;
    host.dataset.bound = "1";
    if (!window.ILS || !window.ILS.data) return;

    window.ILS.data.load("testimonials").then(function (data) {
      var items = (data && data.items) || [];
      host.innerHTML = items.map(function (t) {
        var d = new Date(t.wedding_date);
        var dateStr = isNaN(d) ? "" : d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
        return (
          '<article class="testimonial-card">' +
            '<blockquote>&ldquo;' + escapeHtml(t.quote) + '&rdquo;</blockquote>' +
            '<div>' +
              '<cite>' + escapeHtml(t.couple) + '</cite>' +
              '<p class="testimonial-card__meta">' + escapeHtml(t.venue || "") +
              (dateStr ? ' &middot; ' + dateStr : '') + '</p>' +
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
