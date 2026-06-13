//DOM elements
const sidePanel = document.querySelector(".side-panel");
const sidebarBtn = document.querySelector(".sidebar-btn");
const sidePanelBtns = document.querySelector(".side-panel-btns");

const categoriesBtn = document.querySelector(".categories-btn");
const categories = document.querySelector(".categories");
const categoriesList = document.querySelector(".categories ul");

const addCategory = document.querySelector(".add-category");

const addCategoryPopup = document.querySelector(".add-category-popup");
const popupCancelBtns = document.querySelectorAll(".popup-nav .cancel");
const addCategoryAdd = document.querySelector(".popup-nav .add");

const editCategoryPopup = document.querySelector(".edit-category-popup");
const deleteCategoryBtn = document.querySelector(".delete")

const newCategoryName = document.querySelector(".new-category-name");
const newCategoryColor = document.querySelector(".new-category-color");

let selectedCategory;
//Functions
function togglePopup(element){
    element.classList.toggle("open");
}
function updateCategoriesPanelHeight(){
    categories.style.height = categoriesList.scrollHeight + "px";
}
function submitCategory(){
    const added = addNewCategory();

    if(added){
        togglePopup(addCategoryPopup);
    }
}
function addNewCategory(){
    const categoryText = newCategoryName.value.trim();

    if(!categoryText)return false;
    const newCategory = document.createElement("li");
    const newCategoryText = document.createElement("span");
    
    newCategory.classList.add("category");
    newCategory.textContent = categoryText;

    categoriesList.appendChild(newCategory);
    updateCategoriesPanelHeight();
    newCategoryName.value = "";
    newCategoryColor.value = "#ffffff"

    return true;
}
function removeCategory(){
    selectedCategory.remove();
    console.log("before remove:", categories.scrollHeight);
    console.log("selected:", selectedCategory);
    updateCategoriesPanelHeight();
    console.log("after remove:", categories.scrollHeight);
    console.log("list height:", categoriesList.scrollHeight);
    togglePopup(editCategoryPopup);
}

//Events
sidebarBtn.addEventListener("click", ()=>{
    sidePanel.classList.toggle("collapsed");
})
sidePanelBtns.addEventListener("click", (e)=>{
    const clickedBtn = e.target.closest("button");

    if(!clickedBtn)return;
    if(!sidePanelBtns.contains(clickedBtn))return;

    const activeBtn = sidePanel.querySelector(".active");

    if(activeBtn){
        activeBtn.classList.remove("active");
    }

    clickedBtn.classList.add("active");
    
        if (clickedBtn === categoriesBtn) {
        updateCategoriesPanelHeight();
    } else {
        categories.style.height = "0px";
    }
})
addCategory.addEventListener("click", ()=> {
    togglePopup(addCategoryPopup)
});
popupCancelBtns.forEach((cancelBtn)=>{
    cancelBtn.addEventListener("click", ()=>{
        const popup = cancelBtn.closest(".popup");
        togglePopup(popup);
    });
});
newCategoryName.addEventListener("keydown", (e)=>{
    if(e.key ==="Enter"){
        submitCategory();
    }
});
addCategoryAdd.addEventListener("click", submitCategory);
categoriesList.addEventListener("dblclick", (e)=>{
    const clickedCategory = e.target.closest(".category");

    if(!clickedCategory)return;
    selectedCategory = clickedCategory;
    togglePopup(editCategoryPopup);
});
deleteCategoryBtn.addEventListener("click",removeCategory)