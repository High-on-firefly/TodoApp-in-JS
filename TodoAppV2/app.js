//DOM Elements
const sidebar = document.querySelector(".sidebar");
const sidebarCloseBtn = document.querySelector(".sidebar-close-btn");
const sidebarOpenBtn = document.querySelector(".sidebar-open-btn");
const sidebarNav = document.querySelector(".sidebar-nav");

const categoriesContainer = document.querySelector(".categories-container");
const categoriesList = document.querySelector(".categories-list");
const createNewCategorySpan = document.querySelector(".create-new-category-span");

const addTaskBtn = document.querySelector(".add-task-btn");
const taskList = document.querySelector(".task-list");

const headerText = document.querySelector(".header-text");

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
    addBtn: document.querySelector(".add-task-popup .popup-nav-add"),
    titleInput: document.querySelector(".add-task-popup .task-title-input"),
    categorySelectBtn: document.querySelector(".add-task-popup .task-category-btn"),
    categoryName: document.querySelector(".add-task-popup .task-category-name"),
    selectedCategoryId: undefined,
    categoryList: document.querySelector(".add-task-popup .task-category-list")
}

const editTaskPopup ={
    element: document.querySelector(".edit-task-popup"),
    cancelBtn: document.querySelector(".edit-task-popup .popup-nav-cancel"),
    saveBtn: document.querySelector(".edit-task-popup .popup-nav-save"),
    titleInput: document.querySelector(".edit-task-popup .task-title-input"),
    categorySelectBtn: document.querySelector(".edit-task-popup .task-category-btn"),
    categoryName: document.querySelector(".edit-task-popup .task-category-name"),
    selectedCategoryId: undefined,
    categoryList: document.querySelector(".edit-task-popup .task-category-list")
}

//Var
let categories = [];
let tasks = [];
let visibleTasks = [];

let selectedCategoryId;
let selectedCategory;

let selectedTaskId;
let selectedTask;

let currentStatusFilter = "all";
let currentCategoryFilter = undefined;

let categoryClickTimer;
let showCategories = false;

const DEFAULT_CATEGORY = {
    id: null,
    name: "Todo",
    color: "#9c23ff"
} 

//Events
//Sidebar open/close and navigation
sidebarCloseBtn.addEventListener("click", ()=>{
    sidebar.classList.add("close");
    sidebarOpenBtn.classList.add("active");
});
sidebarOpenBtn.addEventListener("click", ()=>{
    sidebar.classList.remove("close");
    sidebarOpenBtn.classList.remove("active");
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

    if(clickedBtn === sidebarNavBtns.categoriesBtn){
        showCategories = true;
        updateCategoriesContainerHeight();
    }
    else{
        showCategories = false;
        updateCategoriesContainerHeight();
    }
});

//Creating a new category
createNewCategorySpan.addEventListener("click", ()=>{
    openPopup(createCategoryPopup.element);
});
createCategoryPopup.cancelBtn.addEventListener("click", ()=>{
    closePopup(createCategoryPopup.element);
});
createCategoryPopup.createBtn.addEventListener("click", createCategory);

//editing categories
categoriesList.addEventListener("dblclick", (e)=>{
    const clickedCategory = e.target.closest(".category-item")
    
    if(!clickedCategory)return;
    
    clearTimeout(categoryClickTimer);

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
editCategoryPopup.saveBtn.addEventListener("click", saveEditedCategory);

//Adding a new task
addTaskBtn.addEventListener("click", ()=>{
    openPopup(addTaskPopup.element);
});
addTaskPopup.cancelBtn.addEventListener("click", ()=>{
    closePopup(addTaskPopup.element);
});
addTaskPopup.categorySelectBtn.addEventListener("click", (e)=>{
    e.stopPropagation();

    toggleCategoryDropdown(addTaskPopup);
});
addTaskPopup.categoryList.addEventListener("click", (e)=>{
    const clickedCategory = e.target.closest(".category-item");
    
    if(!clickedCategory) return;
    selectCategoryFromDropdown(addTaskPopup, clickedCategory);
});
addTaskPopup.addBtn.addEventListener("click", addTask);

//Editing Tasks
taskList.addEventListener("click", (e)=>{
    const clickedBtn = e.target.closest("button");

    if(!clickedBtn)return;

    
    const taskItem = clickedBtn.closest(".task-item");
    selectedTaskId = taskItem.dataset.taskId;
    selectedTask = tasks.find((task)=>{
        return (selectedTaskId===task.id);
    });

    if(clickedBtn.classList.contains("task-erase-btn")){
        eraseTask(selectedTaskId);
    } else if (clickedBtn.classList.contains("task-status-btn")){
        taskStatusToggle(selectedTaskId);
    } else if (clickedBtn.classList.contains("task-edit-btn")){
        openPopup(editTaskPopup.element);

        const category =
        categories.find(category => category.id === selectedTask.categoryId)
        || DEFAULT_CATEGORY;

        editTaskPopup.titleInput.value = selectedTask.title;
        editTaskPopup.categoryName.textContent = category.name;
        editTaskPopup.selectedCategoryId = selectedTask.categoryId;
    }
});
editTaskPopup.cancelBtn.addEventListener("click", ()=>{
    closePopup(editTaskPopup.element);
});
editTaskPopup.categorySelectBtn.addEventListener("click", (e)=>{
    e.stopPropagation();
    toggleCategoryDropdown(editTaskPopup);
});
editTaskPopup.categoryList.addEventListener("click", (e)=>{
    const clickedCategory = e.target.closest(".category-item");

    if(!clickedCategory) return;
    selectCategoryFromDropdown(editTaskPopup, clickedCategory);
});
editTaskPopup.saveBtn.addEventListener("click", saveEditedTask);

//filtering tasks
taskFilterContainer.element.addEventListener("click", (e)=>{
    const clickedBtn = e.target.closest(".task-filter-btn");
    if(!clickedBtn)return;

    const activeBtn = taskFilterContainer.element.querySelector(".task-filter-btn.active");

    if(clickedBtn === activeBtn)return;

    if(activeBtn){
        activeBtn.classList.remove("active");
    }
    clickedBtn.classList.add("active");
    currentStatusFilter = clickedBtn.dataset.filter;

    updateVisibleTasks();
});
categoriesList.addEventListener("click", (e)=>{
    const clickedCategory = e.target.closest(".category-item");

    if(!clickedCategory) return;

    clearTimeout(categoryClickTimer);
    categoryClickTimer = setTimeout(() =>{
        currentCategoryFilter = clickedCategory.dataset.categoryId;
        const category = categories.find(category => {
            return category.id === currentCategoryFilter;
        });

        headerText.textContent = category.name;
        updateVisibleTasks();
    },200)
});
sidebarNavBtns.tasksBtn.addEventListener("click", ()=>{
    currentCategoryFilter = undefined;
    headerText.textContent = "All your tasks";
    updateVisibleTasks();
});

//Functions
function updateCategoriesContainerHeight(){
    if(showCategories){
        categoriesContainer.classList.add("active");
    }
    else{
        categoriesContainer.classList.remove("active");
    }
}

//popup management
function openPopup(element){
    element.classList.add("open");
}
function closePopup(element){
    element.classList.remove("open");
}

//CRUD for tasks
function saveTasks(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function updateVisibleTasks(){
    visibleTasks = tasks.filter((task)=>{
        const matchesStatus = 
            currentStatusFilter === "all" ||
            currentStatusFilter === "done" && task.done === true ||
            currentStatusFilter === "not-done" && task.done === false;

        const matchesCategory = 
            currentCategoryFilter === undefined ||
            currentCategoryFilter === task.categoryId;

            return matchesStatus&&matchesCategory;
    });

    renderTasks();
}
function addTask(){
    const taskTitle = addTaskPopup.titleInput.value.trim();
    
    if(!taskTitle)return;

    const categoryId = addTaskPopup.selectedCategoryId||DEFAULT_CATEGORY.id;

    const newTask = {
        id: crypto.randomUUID(),
        title: taskTitle,
        categoryId:  categoryId,
        done: false
    };

    addTaskPopup.titleInput.value = "";
    addTaskPopup.categoryName.textContent = "none";
    addTaskPopup.selectedCategoryId = undefined;

    tasks.push(newTask);

    saveTasks();
    updateVisibleTasks();
    closePopup(addTaskPopup.element);
}
function eraseTask(taskId){
    tasks = tasks.filter((task) =>{
        return task.id !== taskId;
    })

    saveTasks();
    updateVisibleTasks();
}
function saveEditedTask(){
    const taskTitle = editTaskPopup.titleInput.value.trim();
    
    if(!taskTitle) return;

    selectedTask.title = taskTitle;
    selectedTask.categoryId = editTaskPopup.selectedCategoryId || DEFAULT_CATEGORY.id;

    saveTasks();
    updateVisibleTasks();
    closePopup(editTaskPopup.element);
}
function taskStatusToggle(taskId){
    const selectedTask = tasks.find(task=> {
        return task.id === taskId
    });
    if(!selectedTask.done){
        selectedTask.done = true;
    } else {
        selectedTask.done = false;
    }

    saveTasks();
    updateVisibleTasks();
}
function renderTask(task){
    const taskItem = document.createElement("li");
    const category = 
        categories.find(category => category.id === task.categoryId)
        || DEFAULT_CATEGORY;
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
    categoryColor.style.backgroundColor = category.color;
    categoryName.textContent = category.name;
    if(task.done){
        taskItem.classList.add("done");
    } else {
        taskItem.classList.remove("done");
    }

    taskList.appendChild(taskItem);
}
function renderTasks(){
    taskList.innerHTML = "";

    visibleTasks.forEach((task)=>{
        renderTask(task);
    })
}
function loadTasks(){
    const savedTasks = localStorage.getItem("tasks");

    if(!savedTasks)return;

    tasks = JSON.parse(savedTasks);

    updateVisibleTasks();
}

//CRUD for category
function saveCategories(){
    localStorage.setItem("categories", JSON.stringify(categories));
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
function saveEditedCategory(){
    selectedCategory.name = editCategoryPopup.nameInput.value.trim();
    selectedCategory.color = editCategoryPopup.colorInput.value;

    saveCategories();
    renderCategories();
    updateVisibleTasks();
    closePopup(editCategoryPopup.element);
}
function deleteCategory(categoryId){
    categories = categories.filter((category) =>{
        return category.id !== categoryId;
    });

    saveCategories();
    saveTasks();
    renderCategories();
    updateVisibleTasks();
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
    editTaskPopup.categoryList.appendChild(categoryItem.cloneNode(true));
}
function renderCategories(){
    categoriesList.innerHTML = "";
    
    addTaskPopup.categoryList.innerHTML = "";
    editTaskPopup.categoryList.innerHTML = "";
    categories.forEach((category) => {
        renderCategory(category);
    });
    
    updateCategoriesContainerHeight();
    
}
function loadCategories(){
    const savedCategories = localStorage.getItem("categories");

    if(!savedCategories)return;

    categories = JSON.parse(savedCategories);

    renderCategories();
}

//Category Dropdown and selection management
function openCategoryDropdown(popup){
    popup.categorySelectBtn.classList.toggle("active");
    popup.categoryList.classList.toggle("active");

    popup.outsideClickHandler = function(e) {
        const clickedInsideDropdown = popup.categoryList.contains(e.target);
        const clickedSelectBtn = popup.categorySelectBtn.contains(e.target);

        if (clickedInsideDropdown || clickedSelectBtn) return;

        closeCategoryDropdown(popup);
    };

    document.body.addEventListener("click", popup.outsideClickHandler);
}
function closeCategoryDropdown(popup){
    popup.categorySelectBtn.classList.remove("active");
    popup.categoryList.classList.remove("active");

    document.body.removeEventListener("click", popup.outsideClickHandler);
    popup.outsideClickHandler = null;
}
function toggleCategoryDropdown(popup){
    const isOpen = popup.categorySelectBtn.classList.contains("active");

    if(isOpen){
        closeCategoryDropdown(popup);
    } else {
        openCategoryDropdown(popup)
    }
}
function selectCategoryFromDropdown(popup, clickedCategory){
    const clickedCategoryId = clickedCategory.dataset.categoryId;
    popup.selectedCategoryId = clickedCategoryId;
    
    const category = categories.find(category => {
        return category.id === clickedCategoryId;
    }) || DEFAULT_CATEGORY;

    popup.categoryName.textContent = category.name;

    closeCategoryDropdown(popup);
}

//Initialize function
function initApp(){
    loadCategories();
    loadTasks();
    sidebarNavBtns.tasksBtn.click();
    taskFilterContainer.allBtn.click();
    // sidebarCloseBtn.click();
}

//Initialize
initApp();