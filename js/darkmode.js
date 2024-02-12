const btn = document.querySelector(".btn-toggle");
const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
let theme;

const currentTheme = localStorage.getItem("theme");
if (currentTheme == "dark") {
  document.body.classList.toggle("dark-theme");
} else {
  document.body.classList.toggle("light-theme");
}

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

  let itch_icon = document.getElementById("itchio_icon");
  if(itch_icon)
  {
    console.log("Achou icone");
    if (theme == "dark") {
      console.log("Tema == dark");
      itch_icon.src = "https://static.itch.io/images/itchio-textless-white.svg";
    } else {
      itch_icon.src = "https://static.itch.io/images/itchio-textless-black.svg";
    }
  }

  localStorage.setItem("theme", theme);
});