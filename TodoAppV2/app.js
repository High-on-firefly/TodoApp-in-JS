//DOM Elements
const sidebar = document.querySelector(".sidebar");
const sidebarCloseBtn = document.querySelector(".sidebar-close-btn");
const sidebarNav = document.querySelector(".sidebar-nav");

//Events
sidebarCloseBtn.addEventListener("click", ()=>{
    sidebar.classList.add("close");
})
sidebarNav.addEventListener("click", (e)=>{
    const clickedBtn = e.target.closest("button");
    const activeBtn = document.querySelector(".active");
    
    if(!clickedBtn)return;
    if(clickedBtn === activeBtn)return;

    if(activeBtn){
        activeBtn.classList.remove("active");
    }
    clickedBtn.classList.add("active");
})