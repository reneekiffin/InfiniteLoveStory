/* ==========================================================================
   include.js — Lightweight HTML partial injector.
   Replaces any element with [data-include="<path>"] with the fetched HTML.
   Paths are RELATIVE — resolved against the document's <base> tag, so the
   site works whether served from root or a subpath (e.g. GitHub Pages).
   Dispatches "partials:loaded" on document when all includes have resolved
   so that nav.js and other dependents can attach listeners after injection.
   ========================================================================== */

(function () {
  "use strict";

  function injectInclude(el) {
    var path = el.getAttribute("data-include");
    if (!path) return Promise.resolve();
    return fetch(path, { credentials: "same-origin" })
      .then(function (res) {
        if (!res.ok) throw new Error("Failed to load " + path + ": " + res.status);
        return res.text();
      })
      .then(function (html) {
        var template = document.createElement("template");
        template.innerHTML = html.trim();
        var fragment = template.content.cloneNode(true);
        el.replaceWith(fragment);
      })
      .catch(function (err) {
        // Fail visibly during development so missing partials are obvious.
        console.error("[include]", err);
        el.outerHTML =
          '<div role="alert" style="padding:1rem;background:#fee;color:#900">' +
          "Failed to load partial: " + path +
          "</div>";
      });
  }

  function resolveAll() {
    var nodes = Array.prototype.slice.call(
      document.querySelectorAll("[data-include]")
    );
    if (!nodes.length) {
      document.dispatchEvent(new CustomEvent("partials:loaded"));
      return;
    }
    Promise.all(nodes.map(injectInclude)).then(function () {
      document.dispatchEvent(new CustomEvent("partials:loaded"));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", resolveAll);
  } else {
    resolveAll();
  }
})();
