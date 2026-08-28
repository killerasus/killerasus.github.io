const validSections = ["contacts", "research", "games", "rpg"];

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

  // Update section visibility
  validSections.forEach(function (id) {
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
  const target = validSections.includes(hash) ? hash : "contacts";
  showSection(target);
}

window.addEventListener("DOMContentLoaded", function () {
  updateNavbarHeight();
  window.addEventListener("resize", updateNavbarHeight);
  window.addEventListener("hashchange", handleRoute);
  handleRoute();
});

