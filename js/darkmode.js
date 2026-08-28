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
  if (theme === "dark") {
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