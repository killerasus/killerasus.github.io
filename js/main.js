// === Section Routing ===
// Wrapped in IIFE to avoid leaking globals.
(function() {
"use strict";
const validSections = ["contacts", "research", "games", "rpg"];

const gameSlugMap = {
  adaptiveshooter: "games/adaptiveshooter/adaptiveshooter.html",
  lightsout: "games/lightsout/lightsout.html",
  mold: "games/mold/mold.html",
  yat: "games/yat/yat.html"
};

// Memory cache for pre-fetched game page HTML
const gameCache = new Map();
let currentOpenSlug = null;
let lastActiveElement = null;
const defaultDocumentTitle = document.title;

function updateNavbarHeight() {
  const navbar = document.querySelector(".navbar");
  if (navbar) {
    document.body.style.paddingTop = navbar.offsetHeight + "px";
  }
}

function showSection(sectionId) {
  if (!validSections.includes(sectionId)) {
    sectionId = "contacts";
  }

  validSections.forEach(function(id) {
    const el = document.getElementById(id);
    const navItem = document.getElementById("nav-" + id);
    if (el) {
      if (id === sectionId) {
        // Re-trigger CSS animation for smooth section entry
        el.style.display = "block";
        el.removeAttribute("hidden");
        el.classList.remove("section-fade-in");
        void el.offsetWidth; // Force reflow
        el.classList.add("section-fade-in");
      } else {
        el.style.display = "none";
        el.setAttribute("hidden", "until-found");
      }
    }
    if (navItem) {
      if (id === sectionId) {
        navItem.classList.add("active");
        const link = navItem.querySelector(".nav-link");
        if (link) link.setAttribute("aria-current", "page");
      } else {
        navItem.classList.remove("active");
        const link = navItem.querySelector(".nav-link");
        if (link) link.removeAttribute("aria-current");
      }
    }
  });

  // Collapse mobile navbar if open (vanilla; no Bootstrap JS dependency)
  const mainNav = document.getElementById("main-nav");
  if (mainNav && mainNav.classList.contains("show")) {
    mainNav.classList.remove("show");
    const toggler = document.querySelector(".navbar-toggler");
    if (toggler) toggler.setAttribute("aria-expanded", "false");
  }

  // Reset scroll position on tab switch so new section starts at top.
  // Respect prefers-reduced-motion for smooth scrolling.
  if (typeof window.scrollTo === "function") {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }
}

function handleRoute() {
  const hash = window.location.hash.replace("#", "").trim();

  // Handle game sub-routes: #games/slug
  if (hash.startsWith("games/")) {
    const slug = hash.slice("games/".length);
    showSection("games");
    if (gameSlugMap[slug]) {
      openGameDrawer(slug, false);
    }
    return;
  }

  // Close drawer if open when navigating away
  const drawerOverlay = document.getElementById("game-drawer-overlay");
  if (drawerOverlay && drawerOverlay.classList.contains("is-open")) {
    closeGameDrawer(false);
  }

  const target = validSections.includes(hash) ? hash : "contacts";
  showSection(target);
}

// === Game Content Prefetching ===
function prefetchGame(slug) {
  // Skip prefetching if on file:// protocol (CORS restriction)
  if (window.location.protocol === "file:") return;
  const url = gameSlugMap[slug];
  if (!url || gameCache.has(slug)) return;
  fetch(url)
    .then(function(r) { return r.text(); })
    .then(function(html) {
      gameCache.set(slug, html);
    })
    .catch(function() {});
}

// === Game Detail Drawer ===
function parseAndRenderGameHTML(html, url, slug) {
  const drawerBody = document.getElementById("game-drawer-body");
  const drawerTitle = document.getElementById("game-drawer-title");
  if (!drawerBody) return;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const main = doc.querySelector("main");
  if (!main) throw new Error("No main element");

  // Remove breadcrumb & redundant inner navbar
  const breadcrumb = main.querySelector("nav[aria-label=\"breadcrumb\"]");
  if (breadcrumb) breadcrumb.remove();
  const innerNav = main.querySelector(".navbar");
  if (innerNav) innerNav.remove();

  // Rewrite relative img src paths
  const gameDir = url.substring(0, url.lastIndexOf("/") + 1);
  main.querySelectorAll("img[src]").forEach(function(img) {
    const src = img.getAttribute("src");
    if (src && !src.startsWith("http") && !src.startsWith("/") && !src.startsWith("data:")) {
      img.setAttribute("src", gameDir + src);
    }
  });

  // Rewrite relative links so they work from the index page drawer context.
  // - ../../index.html#section -> #section (SPA route, no reload)
  // - ../../<path> -> <path> (site-root relative)
  // - other relative hrefs -> resolved against gameDir
  main.querySelectorAll("a[href]").forEach(function(link) {
    const href = link.getAttribute("href");
    if (!href || href.startsWith("http") || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("data:")) {
      return;
    }
    if (href.startsWith("../../index.html")) {
      const hashPart = href.slice("../../index.html".length);
      link.setAttribute("href", hashPart ? hashPart : "#games");
      return;
    }
    if (href.startsWith("../../")) {
      link.setAttribute("href", href.slice("../../".length));
      return;
    }
    if (!href.startsWith("/") && !href.startsWith("../../")) {
      // Bare relative link (e.g. img/foo.png, files/...) — resolve against game page dir
      // but skip pure fragments already handled above.
      if (!href.startsWith("#")) {
        link.setAttribute("href", gameDir + href);
      }
    }
  });

  // Update title & document title
  const h1 = main.querySelector("h1.game-title");
  if (h1) {
    const titleText = h1.textContent.trim();
    if (drawerTitle) drawerTitle.textContent = titleText;
    document.title = titleText + " \u2014 Bruno Ba\u00e8re // Portfolio";
  }

  // Strip page-wrapper container classes
  main.classList.remove("page-wrapper", "container", "py-4");

  drawerBody.innerHTML = main.innerHTML;
  drawerBody.scrollTop = 0;

  // Render local SVG icons inside freshly injected drawer content.
  try {
    if (window.__faRender) window.__faRender(drawerBody);
  } catch (e) {}
}

function openGameDrawer(slug, pushState) {
  const url = gameSlugMap[slug];
  const drawerOverlay = document.getElementById("game-drawer-overlay");
  const drawerBody = document.getElementById("game-drawer-body");
  const drawerClose = document.getElementById("game-drawer-close");
  if (!url || !drawerOverlay) return;

  // Fallback to direct navigation if running from local file:// protocol
  if (window.location.protocol === "file:") {
    window.location.href = url;
    return;
  }

  currentOpenSlug = slug;
  lastActiveElement = document.activeElement;

  if (pushState !== false) {
    history.pushState(null, "", "#games/" + slug);
  }

  drawerOverlay.removeAttribute("aria-hidden");
  drawerOverlay.classList.add("is-open");
  document.body.classList.add("drawer-open");

  if (drawerClose) drawerClose.focus();

  if (gameCache.has(slug)) {
    try {
      parseAndRenderGameHTML(gameCache.get(slug), url, slug);
      return;
    } catch (e) {}
  }

  drawerBody.innerHTML = '<div class="game-drawer-loading"><div class="spinner"></div><p>Loading&hellip;</p></div>';

  fetch(url)
    .then(function(r) {
      if (!r.ok) throw new Error("HTTP error " + r.status);
      return r.text();
    })
    .then(function(html) {
      gameCache.set(slug, html);
      parseAndRenderGameHTML(html, url, slug);
    })
    .catch(function() {
      // Graceful fallback to direct navigation if fetch fails for any reason
      window.location.href = url;
    });
}

function closeGameDrawer(pushState) {
  const drawerOverlay = document.getElementById("game-drawer-overlay");
  const drawerBody = document.getElementById("game-drawer-body");
  const drawerTitle = document.getElementById("game-drawer-title");
  if (!drawerOverlay) return;

  currentOpenSlug = null;
  document.title = defaultDocumentTitle;

  drawerOverlay.classList.remove("is-open");
  drawerOverlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("drawer-open");

  if (pushState !== false) {
    history.pushState(null, "", "#games");
  }

  // Stop playing videos/iframes when closing
  if (drawerBody) {
    drawerBody.querySelectorAll("iframe").forEach(function(iframe) {
      iframe.src = "about:blank";
    });
    drawerBody.querySelectorAll("video").forEach(function(video) {
      video.pause();
    });
  }

  // Restore focus
  if (lastActiveElement && typeof lastActiveElement.focus === "function") {
    lastActiveElement.focus();
  }

  // Clear content after slide-out animation finishes
  setTimeout(function() {
    if (!drawerOverlay.classList.contains("is-open")) {
      if (drawerBody) drawerBody.innerHTML = "";
      if (drawerTitle) drawerTitle.textContent = "";
    }
  }, 350);
}

// === Init ===
window.addEventListener("DOMContentLoaded", function() {
  updateNavbarHeight();
  window.addEventListener("resize", updateNavbarHeight);
  window.addEventListener("hashchange", handleRoute);
  handleRoute();

  const drawerOverlay = document.getElementById("game-drawer-overlay");
  const drawerClose = document.getElementById("game-drawer-close");

  // Vanilla mobile nav toggle (replaces Bootstrap Collapse JS)
  const navToggler = document.querySelector(".navbar-toggler");
  const mainNavEl = document.getElementById("main-nav");
  if (navToggler && mainNavEl) {
    navToggler.addEventListener("click", function() {
      const isOpen = mainNavEl.classList.toggle("show");
      navToggler.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  }

  if (drawerClose) {
    drawerClose.addEventListener("click", function() { closeGameDrawer(); });
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener("click", function(e) {
      if (e.target === drawerOverlay) closeGameDrawer();
    });
  }

  // Keyboard navigation inside drawer: Escape to close, Tab trap for focus
  document.addEventListener("keydown", function(e) {
    const overlay = document.getElementById("game-drawer-overlay");
    if (!overlay || !overlay.classList.contains("is-open")) return;

    if (e.key === "Escape") {
      closeGameDrawer();
      return;
    }

    if (e.key === "Tab") {
      const drawer = document.getElementById("game-drawer");
      if (!drawer) return;
      const focusableSelectors = 'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';
      const focusable = Array.prototype.slice.call(drawer.querySelectorAll(focusableSelectors))
        .filter(function(el) { return el.getClientRects().length > 0; });
      if (focusable.length === 0) {
        e.preventDefault();
        const closeBtn = document.getElementById("game-drawer-close");
        if (closeBtn) closeBtn.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // Intercept game detail link clicks & prefetch on hover
  document.addEventListener("click", function(e) {
    const link = e.target.closest("a");
    if (!link) return;
    const href = link.getAttribute("href");
    if (!href) return;

    const slugMatch = href.match(/^games\/([^/]+)\/\1\.html$/);
    if (slugMatch) {
      e.preventDefault();
      openGameDrawer(slugMatch[1]);
    }
  });

  document.addEventListener("mouseover", function(e) {
    const link = e.target.closest("a");
    if (!link) return;
    const href = link.getAttribute("href");
    if (!href) return;
    const slugMatch = href.match(/^games\/([^/]+)\/\1\.html$/);
    if (slugMatch) {
      prefetchGame(slugMatch[1]);
    }
  });
});
})();

