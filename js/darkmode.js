(function() {
"use strict";
const btn = document.querySelector(".btn-toggle");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

function getPreferredTheme() {
  const storedTheme = localStorage.getItem("theme");
  if (storedTheme) {
    return storedTheme;
  }
  return prefersDarkScheme.matches ? "dark" : "light";
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  if (isDark) {
    document.documentElement.classList.add("dark-theme");
    document.documentElement.classList.remove("light-theme");
    document.body.classList.add("dark-theme");
    document.body.classList.remove("light-theme");
  } else {
    document.documentElement.classList.add("light-theme");
    document.documentElement.classList.remove("dark-theme");
    document.body.classList.add("light-theme");
    document.body.classList.remove("dark-theme");
  }

  // Keep native form controls, scrollbars and UA widgets in sync.
  try {
    document.documentElement.style.colorScheme = isDark ? "dark" : "light";
  } catch (e) {}

  const themeIcon = document.getElementById("theme-icon");
  if (themeIcon) {
    setThemeIcon(themeIcon, isDark);
  }
}

function setThemeIcon(el, isDark) {
  const name = isDark ? "fa-sun" : "fa-moon";
  // Inline SVG path (js/icons.js loaded before this script).
  if (window.__faIcons && window.__faIcons[name] && el.tagName.toLowerCase() === "svg") {
    el.innerHTML = window.__faIcons[name];
    el.setAttribute("data-icon", name);
    return;
  }
  // Fallback for <i> elements if the icon renderer hasn't run.
  if (el.classList) {
    if (isDark) {
      el.classList.remove("fa-moon");
      el.classList.add("fa-sun");
    } else {
      el.classList.remove("fa-sun");
      el.classList.add("fa-moon");
    }
  }
}

// Initial sync
applyTheme(getPreferredTheme());

if (btn) {
  btn.addEventListener("click", function () {
    const currentTheme = document.documentElement.classList.contains("dark-theme") ? "dark" : "light";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  });
}
})();
