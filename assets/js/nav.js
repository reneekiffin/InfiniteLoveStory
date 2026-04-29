/* ==========================================================================
   nav.js — Navigation behavior.
   - Mobile hamburger toggles the full-screen overlay.
   - Desktop nav switches from transparent (over hero) to solid on scroll.
   - Marks aria-current on the link matching the current page.
   - Locks body scroll while overlay is open.
   Listens for "partials:loaded" so it attaches after include.js injects nav.
   ========================================================================== */

(function () {
  "use strict";

  function init() {
    var nav = document.querySelector("[data-nav]");
    var overlay = document.querySelector("[data-nav-overlay]");
    var toggle = document.querySelector("[data-nav-toggle]");
    var closeBtn = document.querySelector("[data-nav-close]");

    if (!nav) return;

    // ----- Transparent-over-hero behavior --------------------------------
    var transparentOnHero =
      document.body.classList.contains("has-hero") ||
      document.body.dataset.navStyle === "transparent";

    if (transparentOnHero) nav.classList.add("is-transparent");

    var SCROLL_THRESHOLD = 80;
    function onScroll() {
      var scrolled = window.scrollY > SCROLL_THRESHOLD;
      if (scrolled) {
        nav.classList.add("is-scrolled");
        nav.classList.remove("is-transparent");
      } else {
        nav.classList.remove("is-scrolled");
        if (transparentOnHero) nav.classList.add("is-transparent");
      }
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // ----- Mobile overlay toggle -----------------------------------------
    function openOverlay() {
      if (!overlay) return;
      overlay.setAttribute("aria-hidden", "false");
      toggle && toggle.setAttribute("aria-expanded", "true");
      document.documentElement.style.overflow = "hidden";
    }

    function closeOverlay() {
      if (!overlay) return;
      overlay.setAttribute("aria-hidden", "true");
      toggle && toggle.setAttribute("aria-expanded", "false");
      document.documentElement.style.overflow = "";
    }

    if (toggle) {
      toggle.addEventListener("click", function () {
        var expanded = toggle.getAttribute("aria-expanded") === "true";
        if (expanded) closeOverlay(); else openOverlay();
      });
    }

    if (closeBtn) closeBtn.addEventListener("click", closeOverlay);

    if (overlay) {
      overlay
        .querySelectorAll("a")
        .forEach(function (a) { a.addEventListener("click", closeOverlay); });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeOverlay();
    });

    // ----- Mark active link ----------------------------------------------
    var current = document.body.dataset.page;
    if (current) {
      document
        .querySelectorAll("[data-nav-link]")
        .forEach(function (link) {
          if (link.dataset.navLink === current) {
            link.setAttribute("aria-current", "page");
          }
        });
    }
  }

  document.addEventListener("partials:loaded", init);
})();
