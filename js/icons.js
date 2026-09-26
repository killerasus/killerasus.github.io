/* Local SVG icon set — replaces the FontAwesome kit (no third-party JS).
 * Usage: <i class="fa fa-moon" aria-hidden="true"></i> is swapped at runtime
 * for an inline <svg class="icon"> with the same id/classes.
 * Decorative only; every instance in markup is aria-hidden.
 */
(function() {
"use strict";

/* 24x24 stroke icons (stroke=currentColor, fill=none) unless noted. */
var FA = {
  "fa-moon": '<path d="M20.5 14.5A9 9 0 0 1 9.5 3.5a9 9 0 1 0 11 11Z"/>',
  "fa-sun": '<circle cx="12" cy="12" r="4"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/>',
  "fa-arrow-left": '<path d="M19 12H5M11 18l-6-6 6-6"/>',
  "fa-download": '<path d="M12 3v12m0 0l-5-5m5 5l5-5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
  "fa-file-pdf": '<path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7Z"/><path d="M14 2v5h5"/><path d="M9 13h6M9 17h6"/>',
  "fa-file-word": '<path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7Z"/><path d="M14 2v5h5"/><path d="M9 13h6M9 17h6"/>',
  "fa-file-code": '<path d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7Z"/><path d="M14 2v5h5"/><path d="M10 12.5L7.5 15 10 17.5M14 12.5l2.5 2.5L14 17.5"/>',
  "fa-book": '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
  "fa-book-open": '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
  "fa-briefcase": '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>',
  "fa-graduation-cap": '<path d="M2 9l10-5 10 5-10 5Z"/><path d="M6 11.5V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-4.5"/><path d="M22 9v5"/>',
  "fa-link": '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
  "fa-github": '<path fill="currentColor" stroke="none" fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>',
  "fa-info-circle": '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/>',
  "fa-external-link": '<path d="M14 4h6v6"/><path d="M20 4L10 14"/><path d="M20 14v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"/>',
  "fa-external-link-alt": '<path d="M14 4h6v6"/><path d="M20 4L10 14"/><path d="M20 14v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5"/>',
  "fa-archive": '<path d="M21 8v13H3V8"/><path d="M1 3h22v5H1Z"/><path d="M10 12h4"/>',
  "fa-bullseye": '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/>',
  "fa-quote-left": '<path fill="currentColor" stroke="none" d="M5 17V9.5C5 6.5 7 4.4 10 3.5l1 2c-1.8.8-2.8 1.9-3 3.5H11v8H5Zm10 0V9.5c0-3 2-5.1 5-6l1 2c-1.8.8-2.8 1.9-3 3.5H21v8h-6Z" transform="translate(-1.5 0) scale(0.92)"/>',
  "fa-code": '<path d="M8 6L3 12l5 6M16 6l5 6-5 6"/>',
  "fa-cogs": '<circle cx="12" cy="12" r="3.2"/><path d="M12 2v2.6M12 19.4V22M2 12h2.6M19.4 12H22M4.9 4.9l1.9 1.9M17.2 17.2l1.9 1.9M19.1 4.9l-1.9 1.9M6.8 17.2l-1.9 1.9"/>',
  "fa-flask": '<path d="M10 2v6L4.5 19a2 2 0 0 0 1.8 3h11.4a2 2 0 0 0 1.8-3L14 8V2"/><path d="M8.5 2h7"/><path d="M7.5 15h9"/>',
  "fa-question-circle": '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.4 2.3c-.8.4-.9.9-.9 1.7"/><path d="M12 17h.01"/>',
  "fa-video": '<rect x="1.5" y="6" width="13.5" height="12" rx="2"/><path d="M15 10.5l6.5-3.5v10L15 13.5"/>',
  "fa-play-circle": '<circle cx="12" cy="12" r="9"/><path d="M10 8.5l6 3.5-6 3.5Z"/>',
  "fa-gamepad": '<path d="M7 8h10a5 5 0 0 1 5 5c0 2.8-2 5-4.5 5-1.4 0-2.4-.7-3.3-1.9H9.8c-.9 1.2-1.9 1.9-3.3 1.9C4 18 2 15.8 2 13a5 5 0 0 1 5-5Z"/><path d="M7.5 11v3.5M5.75 12.75h3.5"/><path d="M15.5 11.5h.01M17.8 13.8h.01"/>',
  "fa-microphone": '<rect x="9" y="2" width="6" height="11" rx="3"/><path d="M5 10a7 7 0 0 0 14 0"/><path d="M12 17v4M9 21h6"/>',
  "fa-trophy": '<path d="M7 4h10v5a5 5 0 0 1-10 0Z"/><path d="M7 5H4.5A2.5 2.5 0 0 0 7 9.5M17 5h2.5A2.5 2.5 0 0 1 17 9.5"/><path d="M12 14v4M8 21h8M9.5 18h5"/>',
  "fa-tasks": '<path d="M9 6h12M9 12h12M9 18h12"/><path d="M3.5 6l1 1 2-2M3.5 12l1 1 2-2M3.5 18l1 1 2-2"/>',
  "fa-rocket": '<path d="M12 2l3.5 5.5L12 18l-3.5-10.5Z"/><circle cx="12" cy="9.5" r="1.4"/><path d="M12 18c-1.2 1.4-1.2 2.8 0 4 1.2-1.2 1.2-2.6 0-4Z"/><path d="M8.5 7.5L4 6l1.5 4.5M15.5 7.5L20 6l-1.5 4.5"/>',
  "fa-shield-alt": '<path d="M12 2l8 3v6c0 5-3.4 8.6-8 11-4.6-2.4-8-6-8-11V5Z"/>',
  "fa-recycle": '<path d="M21 12a9 9 0 1 1-2.6-6.4"/><path d="M21 3v6h-6"/>',
  "fa-newspaper": '<path d="M4 5h13v14H6a2 2 0 0 1-2-2Z"/><path d="M17 8h2.5A1.5 1.5 0 0 1 21 9.5V19"/><path d="M7.5 9.5h6M7.5 13h6M7.5 16.5h3.5"/>',
  "fa-pen-nib": '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  "fa-address-card": '<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="7.5" cy="11" r="2"/><path d="M4.5 17c.6-1.9 2-2.8 3-2.8s2.4.9 3 2.8"/><path d="M14 9.5h5M14 13h5"/>'
};

function renderIcons(root) {
  var scope = root || document;
  var nodes = scope.querySelectorAll ? scope.querySelectorAll("i.fa") : [];
  for (var i = 0; i < nodes.length; i++) {
    var el = nodes[i];
    var classes = (el.getAttribute("class") || "").split(/\s+/);
    var name = null;
    for (var j = 0; j < classes.length; j++) {
      if (classes[j] !== "fa" && classes[j].indexOf("fa-") === 0 && FA[classes[j]]) {
        name = classes[j];
        break;
      }
    }
    if (!name) continue;
    var svgNS = "http://www.w3.org/2000/svg";
    var svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    var kept = [];
    for (var k = 0; k < classes.length; k++) {
      if (classes[k] && classes[k] !== "fa" && classes[k] !== name) kept.push(classes[k]);
    }
    kept.unshift("icon");
    svg.setAttribute("class", kept.join(" "));
    svg.setAttribute("data-icon", name);
    if (el.id) svg.setAttribute("id", el.id);
    svg.innerHTML = FA[name];
    el.parentNode.replaceChild(svg, el);
  }
}

window.__faIcons = FA;
window.__faRender = renderIcons;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function() { renderIcons(document); });
} else {
  renderIcons(document);
}
})();
