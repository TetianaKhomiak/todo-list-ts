"use strict";
var taskInput = document.getElementById("taskInput");
var addTaskButton = document.getElementById("addTaskButton");
var taskList = document.getElementById("taskList");
addTaskButton.addEventListener("click", function () {
    if (taskInput.value.trim() === "") {
        return;
    }
    var li = document.createElement("li");
    li.textContent = taskInput.value;
    taskList.appendChild(li);
    taskInput.value = ""; // Clear the input field
});
