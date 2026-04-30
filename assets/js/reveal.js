/* ==========================================================================
   reveal.js — IntersectionObserver-based scroll reveal.
   Adds .is-visible to any element with [data-reveal] when it enters viewport.
   Respects prefers-reduced-motion.
   ========================================================================== */

(function () {
  "use strict";

  if (typeof IntersectionObserver === "undefined") {
    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function init() {
    var els = document.querySelectorAll("[data-reveal]");
    if (prefersReduced) {
      els.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });
    els.forEach(function (el) { io.observe(el); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
  document.addEventListener("partials:loaded", init);
})();
