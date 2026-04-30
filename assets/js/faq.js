/* ==========================================================================
   faq.js — Renders FAQ accordion from faq.json.
   Categories shown as horizontal tabs on desktop; stacked sections on mobile.
   ========================================================================== */

(function () {
  "use strict";

  function init() {
    var host = document.querySelector("[data-faq]");
    if (!host || host.dataset.bound) return;
    host.dataset.bound = "1";
    if (!window.ILS || !window.ILS.data) return;

    window.ILS.data.load("faq").then(function (data) {
      var cats = (data && data.categories) || [];

      var tabsHtml = '<div class="faq-tabs hide-mobile" role="tablist">' +
        cats.map(function (c, i) {
          return '<button class="faq-tab' + (i === 0 ? ' is-active' : '') +
                 '" data-faq-tab="' + c.id + '" role="tab" type="button">' +
                 escapeHtml(c.label) + '</button>';
        }).join("") + '</div>';

      var sectionsHtml = cats.map(function (c, i) {
        var itemsHtml = c.items.map(function (it) {
          return (
            '<details class="faq-item">' +
              '<summary class="faq-item__trigger">' +
                '<span>' + escapeHtml(it.q) + '</span>' +
                '<span class="faq-item__icon" aria-hidden="true"></span>' +
              '</summary>' +
              '<div class="faq-item__answer"><p>' + escapeHtml(it.a) + '</p></div>' +
            '</details>'
          );
        }).join("");
        return (
          '<section class="faq-section" data-faq-section="' + c.id + '"' +
            (i > 0 ? ' hidden' : '') + '>' +
            '<h2 class="is-tabbed">' + escapeHtml(c.label) + '</h2>' +
            itemsHtml +
          '</section>'
        );
      }).join("");

      host.innerHTML = tabsHtml + sectionsHtml;

      // Desktop tab behavior
      var tabs = host.querySelector(".faq-tabs");
      if (tabs) {
        tabs.addEventListener("click", function (e) {
          var t = e.target.closest("[data-faq-tab]");
          if (!t) return;
          tabs.querySelectorAll(".faq-tab").forEach(function (b) { b.classList.remove("is-active"); });
          t.classList.add("is-active");
          var id = t.dataset.faqTab;
          host.querySelectorAll("[data-faq-section]").forEach(function (s) {
            s.hidden = (s.dataset.faqSection !== id);
          });
        });
      }

      // On mobile, show all sections (drop the hidden attribute below tablet width)
      var mq = window.matchMedia("(max-width: 1023px)");
      function syncMq() {
        if (mq.matches) {
          host.querySelectorAll("[data-faq-section]").forEach(function (s) { s.hidden = false; });
        } else {
          var active = host.querySelector(".faq-tab.is-active");
          var id = active ? active.dataset.faqTab : (cats[0] && cats[0].id);
          host.querySelectorAll("[data-faq-section]").forEach(function (s) {
            s.hidden = (s.dataset.faqSection !== id);
          });
        }
      }
      mq.addEventListener ? mq.addEventListener("change", syncMq) : mq.addListener(syncMq);
      syncMq();
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
