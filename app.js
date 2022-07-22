"use strict";

const submitNewTodo = document.querySelector("#add-toDo");
const enterNewTodo = document.querySelector("#user-toDo");
const todoListWrapper = document.querySelector("#to-do-wrapper");

// store all created todos
const allTodo = [];

submitNewTodo.addEventListener("click", function (e) {
	e.preventDefault();
	// Check for no input and return user
	if (enterNewTodo.value === "") return;
	// store task and task ID into variables
	const userTask = enterNewTodo.value;
	const userTaskID = Math.trunc(Math.random() * 1000);
	// Pushing new todo into allTodo array AND UPDATING ARRAY OF TASKS
	allTodo.push(computeNewUserTask(userTask, userTaskID));
	// Add updated todos to localStorage
	updateLocalStorage(allTodo);
	// Creating dom elements on submit and adding userTask and generated id to the delete buttons adn dom elem
	createDOMelements(userTask, userTaskID);
	enterNewTodo.value = "";
});

// FUNCTIONS SECTION
// ==> compute new task and it's ID
function computeNewUserTask(userTask, userTaskID) {
	return {
		task: userTask,
		id: userTaskID,
	};
}
// ==> update localStorage
function updateLocalStorage(allTodo) {
	localStorage.setItem("allTodo", JSON.stringify(allTodo));
	console.log(allTodo);
}
// ==> create elements
function createDOMelements(userTask, userTaskID) {
	// Create new DOM elements
	const individualTodoContainer = document.createElement("div");
	const userTodoLabel = document.createElement("input");
	const todoActionButtonsWrapper = document.createElement("div");
	const editTodo = document.createElement("button");
	const deleteTodo = document.createElement("button");
	// adding classList to new elements
	individualTodoContainer.classList.add("individual-toDo-container");
	todoActionButtonsWrapper.classList.add("toDo-action-buttons");
	userTodoLabel.classList.add("toDo-input-element");
	editTodo.classList.add("action-on-toDo-item");
	editTodo.classList.add("edit");
	deleteTodo.classList.add("action-on-toDo-item");
	deleteTodo.classList.add("delete");
	// adding innertext and attributes to respective elements
	editTodo.innerText = "Edit";
	deleteTodo.innerText = "Delete";
	userTodoLabel.value = userTask;
	userTodoLabel.setAttribute("readonly", "readonly");
	deleteTodo.setAttribute("id", userTaskID);
	editTodo.setAttribute("id", userTaskID);
	// appending elements to parents
	todoListWrapper.appendChild(individualTodoContainer);
	individualTodoContainer.appendChild(userTodoLabel);
	individualTodoContainer.appendChild(todoActionButtonsWrapper);
	todoActionButtonsWrapper.appendChild(editTodo);
	todoActionButtonsWrapper.appendChild(deleteTodo);
	// IMPLEMENTING EDIT, DELETE AND SAVE.
	editTodo.addEventListener("click", function (e) {
		// condition to enable edit
		if (editTodo.innerText.toLowerCase() === "edit") {
			editTodo.innerText = "Save";
			userTodoLabel.removeAttribute("readonly");
			userTodoLabel.focus();
		} else {
			editTodo.innerText = "Edit";
			userTodoLabel.setAttribute("readonly", "readonly");
			// const updatedTodo = userTodoLabel.value;
			// calling isMatch fxn to check index position of array bearing same ID as the clicked Edit btn
			// const isMatch = findIsMatch(allTodo, e);
			// loop through allTodos array and set task of element bearing same id to latest edit by user
			// allTodo[isMatch].task = updatedTodo;
			// console.log(isMatch);
			// console.log(updatedTodo);
		}
	});
	// IMPLEMENTING DELETE ITEM
	deleteTodoFxn({
		deleteBtn: deleteTodo,
		individualTodoContainer: individualTodoContainer,
		todoListWrapper: todoListWrapper,
	});
}
// ==> Delete a todo by targeting todo ID
function deleteTodoFxn({
	deleteBtn,
	todoListWrapper,
	individualTodoContainer,
}) {
	deleteBtn.addEventListener("click", function (e) {
		// on clicking element, target ID of the element
		// if targeted id is a match with what's present in the allTodo array, remove element from the array.
		const todoIsMatch = findIsMatch(allTodo, e);
		console.log(todoIsMatch);
		// remove todiIsMatch element from the allTodo array and update
		allTodo.splice(todoIsMatch, 1);
		// update todos in localStorage
		updateLocalStorage(allTodo);
		// remove entire task container from the tasks elements wrapper when clicked
		todoListWrapper.removeChild(individualTodoContainer);
	});
}
// ==> loop through todos and find a todo whose id match with clicked element's ID
function findIsMatch(allTodo, e) {
	return allTodo.findIndex(
		(individialTodo) => individialTodo.id === Number(e.target.id)
	);
}

// Retrieving all todos on page load
window.onload = function () {
	// Parse in existing localstorage data into a variable
	const existingTodos = JSON.parse(localStorage.getItem("allTodo"));
	if (existingTodos !== null) {
		// loop through, at each element call the create DOM elements function and pass in task as task and id as id
		existingTodos.forEach(function (todo) {
			createDOMelements(todo.task, todo.id);
		});
		// Deleting and updating an existing todo
	}
};
