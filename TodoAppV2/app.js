//DOM Elements
const sidebar = document.querySelector(".sidebar");
const sidebarCloseBtn = document.querySelector(".sidebar-close-btn");
const sidebarNav = document.querySelector(".sidebar-nav");

const categoriesNavBtn = document.querySelector(".categories-nav-btn");
const categoriesContainer = document.querySelector(".categories-container");
const categoriesList = document.querySelector(".categories-list");
const addNewCategoriesBtn = document.querySelector(".add-new-categories-li");

const createCategoryPopup = document.querySelector(".create-category-popup");
const popupNavCancel = document.querySelectorAll(".popup-nav-cancel");
const popupNavCreate = document.querySelector(".popup-nav-create");
const categoryNameInput = document.querySelector(".category-name-input");
const categoryColorInput = document.querySelector(".category-color-input");

//Var
let categories = [];

//Events
sidebarCloseBtn.addEventListener("click", ()=>{
    sidebar.classList.add("close");
});
sidebarNav.addEventListener("click", (e)=>{
    const clickedBtn = e.target.closest("button");
    const activeBtn = document.querySelector(".active");
    
    if(!clickedBtn)return;
    if(clickedBtn === activeBtn)return;

    if(activeBtn){
        activeBtn.classList.remove("active");
    }
    clickedBtn.classList.add("active");

    if(clickedBtn === categoriesNavBtn){
        updateCategoriesContainerHeight();
    }
    else{
        categoriesContainer.style.height = "0px"
    }
});

addNewCategoriesBtn.addEventListener("click", ()=>{
    openPopup(createCategoryPopup);
});
popupNavCancel.forEach((cancelBtn)=>{
    cancelBtn.addEventListener("click", ()=>{
        const currentPopup = cancelBtn.closest(".popup");
        closePopup(currentPopup);
    })
})
popupNavCreate.addEventListener("click", createCategory);

//Functions
function updateCategoriesContainerHeight(){
    categoriesContainer.style.height = categoriesList.scrollHeight + "px";
}

function openPopup(element){
    element.classList.add("open");
}
function closePopup(element){
    element.classList.remove("open");
}

function createCategory(){
    const categoryName = categoryNameInput.value.trim();;
    const categoryColor = categoryColorInput.value;

    if(!categoryName)return;

    const newCategory = {
        id: crypto.randomUUID(),
        name: categoryName,
        color: categoryColor
    };

    categoryNameInput.value = "";
    
    categories.push(newCategory);
    renderCategory(newCategory);
    closePopup(createCategoryPopup);
}
function renderCategory(category){
    const categoryItem = document.createElement("li");

    categoryItem.dataset.categoryId = category.id;
    categoryItem.innerHTML = `
        <div class="category-color"></div>
        <span class="category-name"></span>
    `;

    const categoryItemColor = categoryItem.querySelector(".category-color");
    const categoryItemName = categoryItem.querySelector(".category-name");

    categoryItemColor.style.backgroundColor = category.color;
    categoryItemName.textContent = category.name;

    categoriesList.appendChild(categoryItem);
    updateCategoriesContainerHeight();
}