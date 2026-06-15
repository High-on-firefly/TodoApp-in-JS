//DOM Elements
const sidebar = document.querySelector(".sidebar");
const sidebarCloseBtn = document.querySelector(".sidebar-close-btn");
const sidebarOpenBtn = document.querySelector(".sidebar-open-btn");
const sidebarNav = document.querySelector(".sidebar-nav");

const categoriesContainer = document.querySelector(".categories-container");
const categoriesList = document.querySelector(".categories-list");
const addNewCategoriesBtn = document.querySelector(".add-new-categories-li");

const addTaskBtn = document.querySelector(".add-task-btn");

const sidebarNavBtns = {
    tasksBtn: document.querySelector(".tasks-nav-btn"),
    categoriesBtn: document.querySelector(".categories-nav-btn")
}

const taskFilterContainer = {
    element: document.querySelector(".task-filter-container"),
    allBtn: document.querySelector(".task-filter-container .all-btn"),
    doneBtn: document.querySelector(".task-filter-container .done-btn"),
    notDoneBtn: document.querySelector(".task-filter-container .not-done-btn")
}

const createCategoryPopup = {
    element: document.querySelector(".create-category-popup"),
    cancelBtn: document.querySelector(".create-category-popup .popup-nav-cancel"),
    createBtn: document.querySelector(".create-category-popup .popup-nav-create"),
    nameInput: document.querySelector(".create-category-popup .category-name-input"),
    colorInput: document.querySelector(".create-category-popup .category-color-input")
}

const editCategoryPopup = {
    element: document.querySelector(".edit-category-popup"),
    deleteBtn: document.querySelector(".edit-category-popup .popup-nav-delete"),
    saveBtn: document.querySelector(".edit-category-popup .popup-nav-save"),    
    nameInput: document.querySelector(".edit-category-popup .category-name-input"),
    colorInput: document.querySelector(".edit-category-popup .category-color-input")
}

const addTaskPopup ={
    element: document.querySelector(".add-task-popup"),
    cancelBtn: document.querySelector(".add-task-popup .popup-nav-cancel"),
    addbtn: document.querySelector(".add-task-popup .popup-nav-add"),
    nameInput: document.querySelector(".add-task-popup .task-name-input"),
    categorySelect: document.querySelector(".add-task-popup .task-category-btn"),
    categoryList: document.querySelector(".task-category-list")
}


//Var
let categories = [];
let selectedCategoryId;
let selectedCategory;
let showCategories = false;

//Events
sidebarCloseBtn.addEventListener("click", ()=>{
    sidebar.classList.add("close");
    sidebarOpenBtn.classList.add("active");
});
sidebarOpenBtn.addEventListener("click", ()=>{
    sidebar.classList.remove("close");
    sidebarOpenBtn.classList.remove("active");
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

    if(clickedBtn === sidebarNavBtns.categoriesBtn){
        showCategories = true;
        updateCategoriesContainerHeight();
    }
    else{
        showCategories = false;
        updateCategoriesContainerHeight();
    }
});

addNewCategoriesBtn.addEventListener("click", ()=>{
    openPopup(createCategoryPopup.element);
});
createCategoryPopup.cancelBtn.addEventListener("click", ()=>{
    closePopup(createCategoryPopup.element);
});
createCategoryPopup.createBtn.addEventListener("click", createCategory);

categoriesList.addEventListener("dblclick", (e)=>{
    const clickedCategory = e.target.closest(".category-item")
    
    if(!clickedCategory)return;
    selectedCategoryId = clickedCategory.dataset.categoryId;
    selectedCategory = categories.find(category => {
        return category.id === selectedCategoryId;
    });
    console.log(categories);
    editCategoryPopup.nameInput.value = selectedCategory.name;
    editCategoryPopup.colorInput.value = selectedCategory.color;
    openPopup(editCategoryPopup.element);

});
editCategoryPopup.deleteBtn.addEventListener("click", ()=>{
    deleteCategory(selectedCategoryId);
});
editCategoryPopup.saveBtn.addEventListener("click", saveCategory);

taskFilterContainer.element.addEventListener("click", (e)=>{
    const clickedBtn = e.target.closest("button");
    const activeBtn = document.querySelector(".task-filter-container .active");

    if(!clickedBtn)return;
    if(!clickedBtn === activeBtn)return;

    if(activeBtn){
        activeBtn.classList.remove("active");
    }
    clickedBtn.classList.add("active");
});

addTaskBtn.addEventListener("click", ()=>{
    openPopup(addTaskPopup.element);
});
addTaskPopup.cancelBtn.addEventListener("click", ()=>{
    closePopup(addTaskPopup.element);
});
addTaskPopup.categorySelect.addEventListener("click", (e)=>{
    e.stopPropagation();

    addTaskPopup.categoryList.classList.toggle("active");

    if(addTaskPopup.categoryList.classList.contains("active")){
        document.body.addEventListener("click", handleOutsideDropdownClick)
    } else {
        document.body.removeEventListener("click", handleOutsideDropdownClick);
    }
});

//Functions
function updateCategoriesContainerHeight(){
    if(showCategories){
        categoriesContainer.style.height = categoriesList.scrollHeight+"px";
    }
    else{
        categoriesContainer.style.height = "0px"
    }
}

function openPopup(element){
    element.classList.add("open");
}
function closePopup(element){
    element.classList.remove("open");
}

function createCategory(){
    const categoryName = createCategoryPopup.nameInput.value.trim();;
    const categoryColor = createCategoryPopup.colorInput.value;

    if(!categoryName)return;

    const newCategory = {
        id: crypto.randomUUID(),
        name: categoryName,
        color: categoryColor
    };

    createCategoryPopup.nameInput.value = "";
    
    categories.push(newCategory);
    saveCategories();
    renderCategories();
    closePopup(createCategoryPopup.element);
}
function saveCategory(){
    selectedCategory.name = editCategoryPopup.nameInput.value.trim();
    selectedCategory.color = editCategoryPopup.colorInput.value;
    saveCategories();
    renderCategories();
    closePopup(editCategoryPopup.element);
}
function saveCategories(){
    localStorage.setItem("categories", JSON.stringify(categories));
}
function loadCategories(){
    const savedCategories = localStorage.getItem("categories");

    if(!savedCategories)return;

    categories = JSON.parse(savedCategories);

    renderCategories();
}
function deleteCategory(categoryId){
    categories = categories.filter((category) =>{
        return category.id !== categoryId;
    });
    saveCategories();
    renderCategories();
    closePopup(editCategoryPopup.element);
}
function renderCategory(category){
    const categoryItem = document.createElement("li");
    
    categoryItem.dataset.categoryId = category.id;
    categoryItem.classList.add("category-item");
    categoryItem.innerHTML = `
    <div class="category-color"></div>
    <span class="category-name"></span>
    `;
    
    const categoryItemColor = categoryItem.querySelector(".category-color");
    const categoryItemName = categoryItem.querySelector(".category-name");
    
    categoryItemColor.style.backgroundColor = category.color;
    categoryItemName.textContent = category.name;
    
    categoriesList.appendChild(categoryItem);
    addTaskPopup.categoryList.appendChild(categoryItem.cloneNode(true));
}
function renderCategories(){
    categoriesList.innerHTML = "";
    categoriesList.appendChild(addNewCategoriesBtn);

    addTaskPopup.categoryList.innerHTML = "";
    categories.forEach((category) => {
        renderCategory(category);
    });

    updateCategoriesContainerHeight();

}
function handleOutsideDropdownClick(e){
    addTaskPopup.categoryList.classList.remove("active");
    document.body.removeEventListener("click", handleOutsideDropdownClick);
}
function initApp(){
    loadCategories();
    sidebarNavBtns.tasksBtn.click();
    taskFilterContainer.allBtn.click();
    sidebarCloseBtn.click();
}

//Initialize
initApp();