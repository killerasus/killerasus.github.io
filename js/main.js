var sections = [];

document.addEventListener("DOMContentLoaded", function(){
    // add padding top to show content behind navbar
    navbar_height = document.querySelector('.navbar').offsetHeight;
    document.body.style.paddingTop = navbar_height + 'px';

    sections["contacts"] = document.getElementById("contacts");
    sections["research"] = document.getElementById("research");
    sections["games"] = document.getElementById("games");
    sections["rpg"] = document.getElementById("rpg");

    showOnly("contacts");
  }); 

  function showOnly(sectionId) {
      for (let section of Object.values(sections)) {
        if(section.id === sectionId)
          section.style.display = "inline";
        else
          section.style.display = "none";
      }
  }
