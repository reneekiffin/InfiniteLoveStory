/* ==========================================================================
   image-fallback.js — When a real image is missing, swap to the placeholder
   SVG matching the image's data-slot attribute.

   Usage in HTML:
     <img src="/assets/images/heroes/hero-homepage-desktop.jpg"
          data-slot="hero-homepage"
          alt="...">

   If the .jpg can't be loaded, the handler swaps src to:
     /assets/images/_placeholders/hero-homepage.svg
   ========================================================================== */

(function () {
  "use strict";

  // Relative — resolves against the document's <base> tag.
  var PLACEHOLDER_BASE = "assets/images/_placeholders/";

  function attach(img) {
    if (img.dataset.fallbackBound) return;
    img.dataset.fallbackBound = "1";
    img.addEventListener(
      "error",
      function () {
        var slot = img.dataset.slot;
        if (!slot) return;
        // Avoid an infinite loop if the placeholder itself fails.
        if (img.src.indexOf(PLACEHOLDER_BASE) !== -1) return;
        img.removeAttribute("srcset");
        // Find sibling <source> elements inside the same <picture> and remove
        // their srcsets too so the fallback img wins.
        if (img.parentElement && img.parentElement.tagName === "PICTURE") {
          img.parentElement
            .querySelectorAll("source")
            .forEach(function (s) { s.removeAttribute("srcset"); });
        }
        img.src = PLACEHOLDER_BASE + slot + ".svg";
      },
      { once: true }
    );
  }

  function init() {
    document.querySelectorAll("img").forEach(attach);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Re-bind after partials inject any new images.
  document.addEventListener("partials:loaded", init);
})();
