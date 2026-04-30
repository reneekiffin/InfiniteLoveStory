/* ==========================================================================
   blog.js — Renders the blog index from blog-posts.json.
   ========================================================================== */

(function () {
  "use strict";

  function init() {
    var host = document.querySelector("[data-blog-grid]");
    if (!host || host.dataset.bound) return;
    host.dataset.bound = "1";
    if (!window.ILS || !window.ILS.data) return;

    window.ILS.data.load("blog-posts").then(function (data) {
      var posts = (data && data.posts) || [];
      host.innerHTML = posts.map(function (p) {
        var d = new Date(p.date);
        var dateStr = isNaN(d) ? "" : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        return (
          '<article class="blog-card">' +
            '<a href="blog-post.html?slug=' + encodeURIComponent(p.slug) + '">' +
              '<div class="image-frame">' +
                '<img src="assets/images/blog/' + p.slug + '-tablet.jpg"' +
                  ' data-slot="' + (p.cover_slot || 'blog-cover-default') + '"' +
                  ' alt="' + escapeAttr(p.title) + '" loading="lazy">' +
              '</div>' +
              '<div class="blog-card__meta">' +
                '<span>' + dateStr + '</span>' +
                '<span>' + (p.read_time_min ? p.read_time_min + ' min read' : '') + '</span>' +
              '</div>' +
              '<h2>' + escapeHtml(p.title) + '</h2>' +
              '<p>' + escapeHtml(p.excerpt) + '</p>' +
            '</a>' +
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
  function escapeAttr(s) { return escapeHtml(s); }

  document.addEventListener("partials:loaded", init);
  if (document.readyState === "complete") init();
})();
