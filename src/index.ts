const taskInput = document.getElementById("taskInput") as HTMLInputElement;
const addTaskButton = document.getElementById(
  "addTaskButton"
) as HTMLButtonElement;
const taskList = document.getElementById("taskList") as HTMLUListElement;

addTaskButton.addEventListener("click", () => {
  if (taskInput.value.trim() === "") {
    return;
  }

  const li = document.createElement("li");
  li.textContent = taskInput.value;
  taskList.appendChild(li);
  taskInput.value = ""; // Clear the input field
});
