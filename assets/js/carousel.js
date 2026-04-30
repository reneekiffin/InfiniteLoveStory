/* ==========================================================================
   carousel.js — Testimonial carousel.
   Reads testimonials.json, builds slides + dots, autoplays, supports swipe.
   Markup contract:
     <div data-carousel></div>
     <button data-carousel-prev>...</button>
     <div data-carousel-dots></div>
     <button data-carousel-next>...</button>
   ========================================================================== */

(function () {
  "use strict";

  var AUTOPLAY_MS = 7000;
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function init() {
    var stage = document.querySelector("[data-carousel]");
    if (!stage || stage.dataset.bound) return;
    stage.dataset.bound = "1";

    if (!window.ILS || !window.ILS.data) return;

    window.ILS.data.load("testimonials").then(function (data) {
      var items = (data && data.items) || [];
      if (!items.length) return;

      // Build slides
      stage.innerHTML = items.map(function (t, i) {
        return (
          '<article class="t-slide' + (i === 0 ? ' is-active' : '') + '" data-idx="' + i + '">' +
            '<blockquote>&ldquo;' + escapeHtml(t.quote) + '&rdquo;</blockquote>' +
            '<cite>' + escapeHtml(t.couple) + ' &mdash; ' + escapeHtml(t.venue || '') + '</cite>' +
          '</article>'
        );
      }).join('');

      // Dots
      var dotsWrap = document.querySelector("[data-carousel-dots]");
      if (dotsWrap) {
        dotsWrap.innerHTML = items.map(function (_, i) {
          return '<button class="t-dot" type="button" role="tab" aria-selected="' + (i === 0 ? 'true' : 'false') + '" aria-label="Testimonial ' + (i + 1) + '" data-dot="' + i + '"></button>';
        }).join('');
        dotsWrap.addEventListener("click", function (e) {
          var btn = e.target.closest("[data-dot]");
          if (!btn) return;
          go(parseInt(btn.dataset.dot, 10));
        });
      }

      var current = 0;
      var timer = null;

      function go(idx) {
        var n = items.length;
        idx = ((idx % n) + n) % n;
        stage.querySelectorAll(".t-slide").forEach(function (s, i) {
          s.classList.toggle("is-active", i === idx);
        });
        if (dotsWrap) {
          dotsWrap.querySelectorAll(".t-dot").forEach(function (d, i) {
            d.setAttribute("aria-selected", i === idx ? "true" : "false");
          });
        }
        current = idx;
      }

      function next() { go(current + 1); }
      function prev() { go(current - 1); }

      function start() {
        if (prefersReduced) return;
        stop();
        timer = setInterval(next, AUTOPLAY_MS);
      }
      function stop() { if (timer) clearInterval(timer); timer = null; }

      var prevBtn = document.querySelector("[data-carousel-prev]");
      var nextBtn = document.querySelector("[data-carousel-next]");
      if (prevBtn) prevBtn.addEventListener("click", function () { prev(); start(); });
      if (nextBtn) nextBtn.addEventListener("click", function () { next(); start(); });

      // Pause on hover, resume on leave (desktop)
      stage.addEventListener("mouseenter", stop);
      stage.addEventListener("mouseleave", start);

      // Pause when offscreen
      if (typeof IntersectionObserver !== "undefined") {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (e) { e.isIntersecting ? start() : stop(); });
        }, { threshold: 0.2 });
        io.observe(stage);
      } else { start(); }

      // Touch swipe
      var startX = 0;
      stage.addEventListener("touchstart", function (e) {
        startX = e.touches[0].clientX; stop();
      }, { passive: true });
      stage.addEventListener("touchend", function (e) {
        var dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) (dx < 0 ? next() : prev());
        start();
      });
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
