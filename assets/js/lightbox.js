/* ==========================================================================
   lightbox.js — Custom lightbox for the portfolio grid.
   - Tap any [data-lightbox] image to open.
   - Arrow keys / nav buttons to navigate.
   - Esc to close. Touch swipe-down dismisses.
   ========================================================================== */

(function () {
  "use strict";

  var lb, imgEl, capEl, idx = 0, items = [];

  function ensureDom() {
    if (lb) return;
    lb = document.createElement("div");
    lb.className = "lightbox";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Image preview");
    lb.innerHTML =
      '<button class="lightbox__close" type="button" aria-label="Close">&times;</button>' +
      '<button class="lightbox__nav is-prev" type="button" aria-label="Previous image">&larr;</button>' +
      '<div class="lightbox__image-wrap"><img alt=""></div>' +
      '<button class="lightbox__nav is-next" type="button" aria-label="Next image">&rarr;</button>' +
      '<div class="lightbox__caption"></div>';
    document.body.appendChild(lb);

    imgEl = lb.querySelector("img");
    capEl = lb.querySelector(".lightbox__caption");

    lb.querySelector(".lightbox__close").addEventListener("click", close);
    lb.querySelector(".is-prev").addEventListener("click", prev);
    lb.querySelector(".is-next").addEventListener("click", next);

    lb.addEventListener("click", function (e) { if (e.target === lb) close(); });

    // Touch swipe down to dismiss
    var startY = 0, startX = 0;
    lb.addEventListener("touchstart", function (e) {
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
    }, { passive: true });
    lb.addEventListener("touchend", function (e) {
      var dy = e.changedTouches[0].clientY - startY;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dy) > Math.abs(dx) && dy > 60) close();
      else if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) (dx < 0 ? next() : prev());
    });

    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });
  }

  function open(allItems, startIdx) {
    ensureDom();
    items = allItems.slice();
    show(startIdx || 0);
    lb.classList.add("is-open");
    document.documentElement.style.overflow = "hidden";
  }

  function close() {
    if (!lb) return;
    lb.classList.remove("is-open");
    document.documentElement.style.overflow = "";
  }

  function show(i) {
    if (!items.length) return;
    var n = items.length;
    idx = ((i % n) + n) % n;
    var item = items[idx];
    imgEl.src = item.src;
    imgEl.alt = item.alt || "";
    capEl.textContent = item.alt || "";
  }

  function next() { show(idx + 1); }
  function prev() { show(idx - 1); }

  // Public hook
  window.ILS = window.ILS || {};
  window.ILS.lightbox = { open: open, close: close };
})();
