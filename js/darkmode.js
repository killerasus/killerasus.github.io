const btn = document.querySelector(".btn-toggle");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
let theme;

const currentTheme = localStorage.getItem("theme");
if (currentTheme == "dark") {
  document.body.classList.toggle("dark-theme");
} else {
  document.body.classList.toggle("light-theme");
}

let changeIcons = (toTheme) => {
  let itch_icon = document.getElementById("itchio_icon");
  if(itch_icon)
    if (toTheme == "dark")
      itch_icon.src = "https://static.itch.io/images/itchio-textless-white.svg";
    else
      itch_icon.src = "https://static.itch.io/images/itchio-textless-black.svg";
}

changeIcons(currentTheme);

btn.addEventListener("click", function () {
  if (prefersDarkScheme.matches) {
    document.body.classList.toggle("light-theme");
    theme = document.body.classList.contains("light-theme")
      ? "light"
      : "dark";
  } else {
    document.body.classList.toggle("dark-theme");
    theme = document.body.classList.contains("dark-theme")
      ? "dark"
      : "light";
  }

  changeIcons(theme);

  localStorage.setItem("theme", theme);
});