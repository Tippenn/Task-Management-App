const addTaskButton = document.getElementById("addTaskButton")
const taskInputField = document.getElementById("taskInputField")
const taskList = document.getElementById("taskList")
const levelText = document.getElementById("levelText")
const expBar = document.getElementById("expBar");
const taskTemplate = {
    name: "workout",
    completed: false
}

let title = ""
let exp = 0;
let taskExpIncrease = 25;
let expNeededToLevelUp = 100;
let tasks = [];

LoadAll()

taskInputField.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        CreateTask(taskInputField.value, false)
        taskInputField.value = ""
    }
})

addTaskButton.addEventListener("click", () => {
    if (taskInputField.value.trim() === "") return;
    CreateTask(taskInputField.value, false)
    taskInputField.value = ""
})

function UpdateExperience() {
    let level = (Math.floor(exp / expNeededToLevelUp) + 1)
    const progress =
        (exp % expNeededToLevelUp) / expNeededToLevelUp * 100;

    expBar.style.width = `${progress}%`;
    levelText.textContent = "Level: " + level + " - " + GetPlayerTitle(level)
    SaveAll()
}

function GetPlayerTitle(level) {
    if (level >= 20) return "Legend";
    if (level >= 10) return "Hero";
    if (level >= 5) return "Adventurer";

    return "Novice";
}

function CreateTask(taskName, taskCompletion) {
    const task = document.createElement("li")
    task.textContent = taskName
    const taskData = {
        name: taskName,
        completed: taskCompletion
    }
    tasks.push(taskData)
    RenderTask(taskData);

    SaveAll();
}

function RenderTask(taskData) {
    const task = document.createElement("li");
    const taskText = document.createElement("span");
    const deleteButton = document.createElement("button");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    deleteButton.textContent = "❌";

    taskText.textContent = taskData.name;
    task.appendChild(checkbox)
    task.appendChild(taskText)
    task.appendChild(deleteButton)

    if (taskData.completed) {
        taskText.classList.add("completed");
        checkbox.checked = true;
        checkbox.disabled = true
    }

    checkbox.addEventListener("change", () => {
        OnTaskClicked(taskText, checkbox, taskData);
    });
    deleteButton.addEventListener("click", (event) => {
        event.stopPropagation()
        OnTaskDeleteClicked(task, taskData)
    })
    taskList.appendChild(task);
}

function OnTaskClicked(taskText, checkbox, taskData) {
    if (taskData.completed) {
        return;
    }
    taskText.classList.add("completed")
    taskData.completed = true;
    checkbox.disabled = true
    exp += taskExpIncrease
    SaveAll()
    UpdateExperience()
}

function OnTaskDeleteClicked(task, taskData) {
    const index = tasks.indexOf(taskData);

    if (index !== -1) {
        tasks.splice(index, 1);
    }
    task.remove()

    SaveAll()
}


function SaveAll() {
    localStorage.setItem("exp", exp)
    localStorage.setItem("tasks", JSON.stringify(tasks))
}

function LoadAll() {
    exp = Number(localStorage.getItem("exp")) || 0
    tasks = JSON.parse(
        localStorage.getItem("tasks")
    ) || []
    UpdateExperience()
    for (const taskData of tasks) {
        RenderTask(taskData);
    }
}