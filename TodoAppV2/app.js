//DOM Elements
const sidebar = document.querySelector(".sidebar");
const sidebarCloseBtn = document.querySelector(".sidebar-close-btn");
const sidebarOpenBtn = document.querySelector(".sidebar-open-btn");
const sidebarNav = document.querySelector(".sidebar-nav");

const categoriesContainer = document.querySelector(".categories-container");
const categoriesList = document.querySelector(".categories-list");
const addNewCategoriesBtn = document.querySelector(".add-new-categories-li");

const addTaskBtn = document.querySelector(".add-task-btn");
const taskList = document.querySelector(".task-list");

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
    titleInput: document.querySelector(".add-task-popup .task-title-input"),
    categorySelectBtn: document.querySelector(".add-task-popup .task-category-btn"),
    categoryName: document.querySelector(".task-category-name"),
    selectedCategory: undefined,
    categoryList: document.querySelector(".task-category-list")
}



//Var
let categories = [];
let tasks = [];
let selectedCategoryId;
let selectedCategory;
let showCategories = false;
const DEFAULT_CATEGORY = {
    id: null,
    name: "Todo",
    color: "#9c23ff"
} 
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
addTaskPopup.categorySelectBtn.addEventListener("click", (e)=>{
    e.stopPropagation();

    addTaskPopup.categorySelectBtn.classList.toggle("active");
    addTaskPopup.categoryList.classList.toggle("active");

    if(addTaskPopup.categoryList.classList.contains("active")){
        document.body.addEventListener("click", handleOutsideDropdownClick)
    } else {
        document.body.removeEventListener("click", handleOutsideDropdownClick);
    }
});
addTaskPopup.categoryList.addEventListener("click", (e)=>{
    const clickedCategory = e.target.closest(".category-item");
    
    if(!clickedCategory) return;
    const clickedCategoryId = clickedCategory.dataset.categoryId;
    addTaskPopup.selectedCategory = categories.find(category => {
        return category.id === clickedCategoryId;
    });

    addTaskPopup.categoryName.textContent = addTaskPopup.selectedCategory.name; 
});
addTaskPopup.addbtn.addEventListener("click", addTask);
taskList.addEventListener("click", (e)=>{
    const clickedBtn = e.target.closest("button");

    if(!clickedBtn)return;

    const taskItem = clickedBtn.closest(".task-item");
    const taskId = taskItem.dataset.taskId;

    if(clickedBtn.classList.contains("task-erase-btn")){
        eraseTask(taskId);
    }
    if(clickedBtn.classList.contains("task-status-btn")){
        taskStatusToggle(taskId);
    }
})
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
function addTask(){
    const taskTitle = addTaskPopup.titleInput.value.trim();

    const category = addTaskPopup.selectedCategory||DEFAULT_CATEGORY;

    if(!taskTitle)return;

    const newTask = {
        id: crypto.randomUUID(),
        title: taskTitle,
        categoryId:  category.id,
        categoryName: category.name,
        categoryColor: category.color,
        done: false
    }

    addTaskPopup.titleInput.value = "";
    addTaskPopup.categoryName.textContent = "none";
    addTaskPopup.selectedCategory = undefined;
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    closePopup(addTaskPopup.element);
}
function eraseTask(taskId){
    tasks = tasks.filter((task) =>{
        return task.id !== taskId;
    })
    saveTasks();
    renderTasks();
}
function taskStatusToggle(taskId){
    const selectedtask = tasks.find(task=> {
        return task.id === taskId
    });
    if(!selectedtask.done){
        selectedtask.done = true;
    } else {
        selectedtask.done = false;
    }
    saveTasks();
    renderTasks();
}
function saveTasks(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function loadTasks(){
    const savedTasks = localStorage.getItem("tasks");

    if(!savedTasks)return;

    tasks = JSON.parse(savedTasks);

    renderTasks();
}
function renderTask(task){
    const taskItem = document.createElement("li");
    taskItem.classList.add("task-item");
    taskItem.dataset.taskId = task.id;
    taskItem.dataset.categoryId = task.categoryId;

    taskItem.innerHTML = `
        <button class="task-status-btn"><div class="task-status"></div></button>
        <div class="task-details">
            <h2 class="task-title"></h2>
            <span class="task-category">
                <div class="category-color"></div>
                <span class="category-name"></span>
            </span>
        </div>
        <button class="task-item-btn task-edit-btn"><img src="/Img/edit.svg"></button>
        <button class="task-item-btn task-erase-btn"><img src="/Img/erase.svg"></button>            
    `;
    const taskTitle = taskItem.querySelector(".task-title");
    const categoryColor = taskItem.querySelector(".category-color");
    const categoryName = taskItem.querySelector(".category-name");

    taskTitle.textContent = task.title;
    categoryColor.style.backgroundColor = task.categoryColor;
    categoryName.textContent = task.categoryName;
    if(task.done){
        taskItem.classList.add("done");
    } else {
        taskItem.classList.remove("done");
    }

    taskList.appendChild(taskItem);
}
function renderTasks(){
    taskList.innerHTML = "";

    tasks.forEach((task)=>{
        renderTask(task);
    })
}
function createCategory(){
    const categoryName = createCategoryPopup.nameInput.value.trim();
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
    addTaskPopup.categorySelectBtn.classList.remove("active");
    document.body.removeEventListener("click", handleOutsideDropdownClick);
}
function initApp(){
    loadCategories();
    loadTasks();
    sidebarNavBtns.tasksBtn.click();
    taskFilterContainer.allBtn.click();
}

//Initialize
initApp();