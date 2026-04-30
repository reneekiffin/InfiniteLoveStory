/* ==========================================================================
   portfolio.js — Renders portfolio grid + filter chips from galleries.json.
   Hooks into lightbox.js for image previews.
   ========================================================================== */

(function () {
  "use strict";

  function init() {
    var grid = document.querySelector("[data-portfolio-grid]");
    var filters = document.querySelector("[data-portfolio-filters]");
    if (!grid || grid.dataset.bound) return;
    grid.dataset.bound = "1";
    if (!window.ILS || !window.ILS.data) return;

    window.ILS.data.load("galleries").then(function (data) {
      var cats = data.categories || [];
      var items = data.items || [];

      // Filter chips
      if (filters) {
        filters.innerHTML = cats.map(function (c, i) {
          return '<button class="filter-chip' + (i === 0 ? ' is-active' : '') +
                 '" data-cat="' + c.id + '" type="button">' + escapeHtml(c.label) + '</button>';
        }).join("");
        filters.addEventListener("click", function (e) {
          var btn = e.target.closest(".filter-chip");
          if (!btn) return;
          filters.querySelectorAll(".filter-chip").forEach(function (b) { b.classList.remove("is-active"); });
          btn.classList.add("is-active");
          applyFilter(btn.dataset.cat);
        });
      }

      // Items
      grid.innerHTML = items.map(function (it) {
        // single_size files are shipped as one .jpg with no responsive suffix.
        var basePath = "assets/images/" + it.folder + "/" + it.filename;
        var thumb = it.single_size ? (basePath + ".jpg") : (basePath + "-tablet.jpg");
        var full  = it.single_size ? (basePath + ".jpg") : (basePath + "-desktop.jpg");
        var aspectClass = it.aspect === "4:5" ? "is-portrait" : "is-landscape";
        return (
          '<button class="portfolio-grid__item ' + aspectClass + '" type="button"' +
            ' data-cat="' + it.category + '"' +
            ' data-src="' + full + '"' +
            ' data-alt="' + escapeAttr(it.alt) + '"' +
            ' aria-label="Open photo: ' + escapeAttr(it.alt) + '">' +
            '<img src="' + thumb + '"' +
              ' data-slot="' + it.slot + '"' +
              ' alt="' + escapeAttr(it.alt) + '"' +
              ' loading="lazy" decoding="async">' +
          '</button>'
        );
      }).join("");

      // Click handler — open lightbox with currently visible items
      grid.addEventListener("click", function (e) {
        var btn = e.target.closest(".portfolio-grid__item");
        if (!btn) return;
        var visible = Array.prototype.filter.call(
          grid.querySelectorAll(".portfolio-grid__item"),
          function (el) { return !el.classList.contains("is-hidden"); }
        );
        var lbItems = visible.map(function (el) {
          return { src: el.dataset.src, alt: el.dataset.alt };
        });
        var startIdx = visible.indexOf(btn);
        if (window.ILS && window.ILS.lightbox) {
          window.ILS.lightbox.open(lbItems, startIdx);
        }
      });

      function applyFilter(cat) {
        grid.querySelectorAll(".portfolio-grid__item").forEach(function (el) {
          var match = (cat === "all") || (el.dataset.cat === cat);
          el.classList.toggle("is-hidden", !match);
        });
      }
    });

    // Pixieset embed wiring
    var pix = document.querySelector("[data-pixieset-embed]");
    if (pix) {
      window.ILS.data.load("site").then(function (site) {
        var html = (site && site.pixieset && site.pixieset.embed_html) || "";
        if (html) pix.innerHTML = html;
        var link = document.querySelector("[data-pixieset-link]");
        if (link && site && site.pixieset && site.pixieset.collection_url) {
          link.href = site.pixieset.collection_url;
        }
      });
    }
  }

  function escapeHtml(s) {
    return String(s || "").replace(/[&<>"']/g, function (m) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m];
    });
  }
  function escapeAttr(s) { return escapeHtml(s); }

  document.addEventListener("partials:loaded", init);
  if (document.readyState === "complete") init();
})();
