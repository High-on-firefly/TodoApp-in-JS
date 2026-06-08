//Dom elements
const inputBox = document.querySelector(".input-box");
const inputBtn = document.querySelector(".input-btn");

const listContainer = document.querySelector(".list-container");

//Add Task
function addTask(){
    const task = inputBox.value.trim();

    if(!task)return;

    const listItem = document.createElement("li");
    listItem.textContent = task;
    listItem.classList.add("list-item");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = '✕';
    deleteBtn.classList.add("delete-btn");

    listItem.appendChild(deleteBtn);
    listContainer.appendChild(listItem);

    //inputBox.value = '';
}

//Events
inputBox.addEventListener("keydown", (event)=>{
    if(event.key === "Enter"){
        addTask();
    }
})
inputBtn.addEventListener("click",addTask());
listContainer.addEventListener("click", (e)=>{
    if(e.target.classList.contains("list-item")){
        e.target.classList.toggle("checked");
        return;
    }
    
    if(e.target.classList.contains("delete-btn")){
        e.target.parentElement.remove();
    }
})
