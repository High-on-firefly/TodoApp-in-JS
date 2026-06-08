//DOM elements
const sidePanel = document.querySelector(".side-panel");
const sidePanelBtn = document.querySelector(".side-panel-btn");

//Events
sidePanelBtn.addEventListener("click", ()=>{
    sidePanel.classList.toggle("collapsed");
})
