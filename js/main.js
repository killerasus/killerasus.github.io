// === Section Routing ===
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

  // Collapse mobile navbar if open
  const mainNav = document.getElementById("main-nav");
  if (mainNav && mainNav.classList.contains("show")) {
    if (typeof bootstrap !== "undefined" && bootstrap.Collapse) {
      const bsCollapse = bootstrap.Collapse.getInstance(mainNav) || new bootstrap.Collapse(mainNav, { toggle: false });
      bsCollapse.hide();
    } else {
      mainNav.classList.remove("show");
    }
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

// === Toast Notification ===
function showToast(message) {
  let toast = document.getElementById("toast-notification");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(function() {
    toast.classList.remove("show");
  }, 2500);
}

// === Game Content Prefetching ===
function prefetchGame(slug) {
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
}

function openGameDrawer(slug, pushState) {
  const url = gameSlugMap[slug];
  const drawerOverlay = document.getElementById("game-drawer-overlay");
  const drawerBody = document.getElementById("game-drawer-body");
  const drawerClose = document.getElementById("game-drawer-close");
  if (!url || !drawerOverlay) return;

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
    .then(function(r) { return r.text(); })
    .then(function(html) {
      gameCache.set(slug, html);
      parseAndRenderGameHTML(html, url, slug);
    })
    .catch(function() {
      if (drawerBody) drawerBody.innerHTML = '<p class="text-muted text-center py-5">Content could not be loaded.</p>';
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
  const drawerShare = document.getElementById("game-drawer-share");

  if (drawerClose) {
    drawerClose.addEventListener("click", function() { closeGameDrawer(); });
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener("click", function(e) {
      if (e.target === drawerOverlay) closeGameDrawer();
    });
  }

  if (drawerShare) {
    drawerShare.addEventListener("click", function() {
      if (!currentOpenSlug) return;
      const shareUrl = window.location.origin + window.location.pathname + "#games/" + currentOpenSlug;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl).then(function() {
          showToast("Link copied to clipboard!");
        }).catch(function() {
          showToast(shareUrl);
        });
      } else {
        showToast(shareUrl);
      }
    });
  }

  // Keyboard navigation inside drawer
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
      const overlay = document.getElementById("game-drawer-overlay");
      if (overlay && overlay.classList.contains("is-open")) closeGameDrawer();
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
