// === Section Routing ===
const validSections = ["contacts", "research", "games", "rpg"];

const gameSlugMap = {
  adaptiveshooter: "games/adaptiveshooter/adaptiveshooter.html",
  lightsout: "games/lightsout/lightsout.html",
  mold: "games/mold/mold.html",
  yat: "games/yat/yat.html"
};

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
        el.style.display = "block";
        el.removeAttribute("hidden");
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

// === Game Detail Drawer ===

function openGameDrawer(slug, pushState) {
  const url = gameSlugMap[slug];
  const drawerOverlay = document.getElementById("game-drawer-overlay");
  const drawerBody = document.getElementById("game-drawer-body");
  const drawerTitle = document.getElementById("game-drawer-title");
  if (!url || !drawerOverlay) return;

  if (pushState !== false) {
    history.pushState(null, "", "#games/" + slug);
  }

  drawerOverlay.removeAttribute("aria-hidden");
  drawerOverlay.classList.add("is-open");
  document.body.classList.add("drawer-open");

  drawerBody.innerHTML = '<div class="game-drawer-loading"><div class="spinner"></div><p>Loading&hellip;</p></div>';

  fetch(url)
    .then(function(r) { return r.text(); })
    .then(function(html) {
      var parser = new DOMParser();
      var doc = parser.parseFromString(html, "text/html");
      var main = doc.querySelector("main");
      if (!main) throw new Error("No main element");

      // Remove breadcrumb — the drawer header acts as navigation context
      var breadcrumb = main.querySelector("nav[aria-label=\"breadcrumb\"]");
      if (breadcrumb) breadcrumb.remove();

      // Remove the inner navbar (each game page has its own, not needed in drawer)
      var innerNav = main.querySelector(".navbar");
      if (innerNav) innerNav.remove();

      // Rewrite relative img src paths to be relative to the game folder
      var gameDir = url.substring(0, url.lastIndexOf("/") + 1);
      main.querySelectorAll("img[src]").forEach(function(img) {
        var src = img.getAttribute("src");
        if (src && !src.startsWith("http") && !src.startsWith("/") && !src.startsWith("data:")) {
          img.setAttribute("src", gameDir + src);
        }
      });

      // Update the drawer title from the page h1
      var h1 = main.querySelector("h1.game-title");
      if (h1 && drawerTitle) drawerTitle.textContent = h1.textContent;

      // Strip page-wrapper container classes — drawer handles its own padding
      main.classList.remove("page-wrapper", "container", "py-4");

      drawerBody.innerHTML = main.innerHTML;
      drawerBody.scrollTop = 0;
    })
    .catch(function() {
      var drawerBody = document.getElementById("game-drawer-body");
      if (drawerBody) drawerBody.innerHTML = '<p class="text-muted text-center py-5">Content could not be loaded.</p>';
    });
}

function closeGameDrawer(pushState) {
  var drawerOverlay = document.getElementById("game-drawer-overlay");
  var drawerBody = document.getElementById("game-drawer-body");
  var drawerTitle = document.getElementById("game-drawer-title");
  if (!drawerOverlay) return;

  drawerOverlay.classList.remove("is-open");
  drawerOverlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("drawer-open");

  if (pushState !== false) {
    history.pushState(null, "", "#games");
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

  var drawerOverlay = document.getElementById("game-drawer-overlay");
  var drawerClose = document.getElementById("game-drawer-close");

  // Close on button click
  if (drawerClose) {
    drawerClose.addEventListener("click", function() { closeGameDrawer(); });
  }

  // Close on backdrop click
  if (drawerOverlay) {
    drawerOverlay.addEventListener("click", function(e) {
      if (e.target === drawerOverlay) closeGameDrawer();
    });
  }

  // Close on Escape key
  document.addEventListener("keydown", function(e) {
    if (e.key === "Escape") {
      var overlay = document.getElementById("game-drawer-overlay");
      if (overlay && overlay.classList.contains("is-open")) closeGameDrawer();
    }
  });

  // Intercept game detail link clicks anywhere on the page
  document.addEventListener("click", function(e) {
    var link = e.target.closest("a");
    if (!link) return;
    var href = link.getAttribute("href");
    if (!href) return;

    // Match game detail links: games/{slug}/{slug}.html
    var slugMatch = href.match(/^games\/([^/]+)\/\1\.html$/);
    if (slugMatch) {
      e.preventDefault();
      openGameDrawer(slugMatch[1]);
    }
  });
});
