import "./stylesheet.css";
import deleteTodoImage from "./icons-and-fonts/cancel-close-delete-svgrepo-com.svg";
import expandTodoImage from "./icons-and-fonts/hamburger-menu-svgrepo-com.svg";
import deleteProjectImage from "./icons-and-fonts/delete-svgrepo-com.svg";
import editTodoImage from "./icons-and-fonts/edit-3-svgrepo-com.svg";

import {
  createTodoItem,
  createProject,
  createProjectList,
  pushProjectToProjectList,
  pushItemToProject,
  removeItemFromProject,
  removeProjectFromProjectList,
  validateForm,
  refreshTodoForm,
  editTodoDetails,
} from "./logic";

let todoBeingEdited = null;
let projectOfTodoBeingEdited = null;

const projectGrid = document.querySelector(".project-grid");
function getTodoFormElements() {
  const doneStatus = document.querySelector(
    '#add-todo-form input[type="radio"]:checked'
  );
  const description = document.querySelector("#description");
  const title = document.querySelector("#title");
  const priority = document.querySelector("#priority");
  const toProject = document.querySelector("#to-project");
  const dueDate = document.querySelector("#due-date");
  const notes = document.querySelector("#notes");
  return {
    doneStatus,
    description,
    title,
    priority,
    toProject,
    dueDate,
    notes,
  };
}
// function for displaying Todo in the web
function renderTodoUI(todoContainer, projectObj, todoName) {
  todoContainer.textContent = "";
  const todoTitle = document.createElement("p");
  todoTitle.textContent = todoName.title;
  todoContainer.appendChild(todoTitle);
  const ul = document.createElement("ul");
  todoTitle.appendChild(ul);
  for (let key in todoName) {
    const li = document.createElement("li");
    li.textContent = ` ${key.toUpperCase()}: ${todoName[key]}`;
    ul.appendChild(li);
  }
  ul.style.display = "none";

  //remove Todo from its Project
  const deleteTodoButton = document.createElement("img");
  deleteTodoButton.src = deleteTodoImage;
  todoContainer.appendChild(deleteTodoButton);
  deleteTodoButton.addEventListener("click", () => {
    todoContainer.remove();
    removeItemFromProject(projectObj, todoName.title);
    saveProjectList();
  });
  //expand and show todo details
  let isShowingTodoDetails = false;
  const expandTodoButton = document.createElement("img");
  expandTodoButton.src = expandTodoImage;
  todoContainer.appendChild(expandTodoButton);
  expandTodoButton.addEventListener("click", () => {
    if (isShowingTodoDetails === false) {
      ul.style.display = "block";
      isShowingTodoDetails = true;
      return;
    }
    if (isShowingTodoDetails === true) {
      ul.style.display = "none";
      isShowingTodoDetails = false;
    }
  });
  // edit Todo details
  const editTodoButton = document.createElement("img");
  editTodoButton.src = editTodoImage;
  todoContainer.appendChild(editTodoButton);
  //show the form for users to edit todo
  editTodoButton.addEventListener("click", () => {
    todoBeingEdited = todoName;
    projectOfTodoBeingEdited = projectObj;
    addNewTodoForm.showModal();
    const { description, title, priority, toProject, dueDate, notes } =
      getTodoFormElements();
    const doneStatusYesButton = document.querySelector("input[value='Yes']");
    const doneStatusNoButton = document.querySelector("input[value='No']");

    //show current values of Todo in the form when first opening the form to edit
    description.value = todoName.description;
    title.value = todoName.title;
    priority.value = todoName.priority;
    toProject.value = projectObj.name;
    dueDate.value = todoName.dueDate;
    notes.value = todoName.notes;
    if (todoName.doneStatus === "Yes") {
      doneStatusYesButton.checked = true;
    }
    if (todoName.doneStatus === "No") {
      doneStatusNoButton.checked = true;
    }
  });
}
//function for displaying project cards in the web
function displayProjectCard(projectObj) {
  const projectCard = document.createElement("div");
  projectCard.dataset.name = projectObj.name;
  projectCard.classList.add("project-card");
  projectGrid.appendChild(projectCard);
  const projectTopCard = document.createElement("div");
  projectTopCard.classList.add("project-top-card");
  projectCard.appendChild(projectTopCard);
  const projectName = document.createElement("h2");
  projectName.textContent = projectObj.name;
  projectTopCard.appendChild(projectName);
  const projectBottomCard = document.createElement("div");
  projectBottomCard.classList.add("project-bottom-card");
  projectCard.appendChild(projectBottomCard);
  const deleteProjectButton = document.createElement("img");
  deleteProjectButton.src = deleteProjectImage;
  //delete Project from ProjectList
  deleteProjectButton.addEventListener("click", () => {
    projectCard.remove();
    removeProjectFromProjectList(projectList, projectObj.name);
    saveProjectList();
  });
  projectBottomCard.appendChild(deleteProjectButton);
}
//function for displaying todo in its project in the web
function renderTodoInProjectCard(projectObj, todoName) {
  const projectCard = document.querySelector(
    `[data-name="${projectObj.name}"]`
  );
  const projectTopCard = projectCard.querySelector(".project-top-card");
  const todoContainer = document.createElement("div");
  todoContainer.classList.add("todo-container");
  todoContainer.dataset.title = todoName.title;
  projectTopCard.appendChild(todoContainer);
  renderTodoUI(todoContainer, projectObj, todoName);
}

//let users choose which project their todos are going too/ shows the existing projects as the options
const select = document.querySelector("#to-project");
function removeProjectSelectOptions() {
  const options = document.querySelectorAll("option");
  options.forEach((option) => {
    option.remove();
  });
}
function updateProjectSelectOptions(projectList) {
  removeProjectSelectOptions();
  for (let i = 0; i < projectList.length; i++) {
    const option = document.createElement("option");
    select.appendChild(option);
    option.textContent = projectList[i].name;
    option.setAttribute("value", projectList[i].name);
  }
}

//show a form for users to add new todo
const addNewTodoForm = document.querySelector("#add-todo-form");
const addTodoButton = document.querySelector(".add-todo-button");
const closeTodoButton = document.querySelector("#close-button-todo");
const submitTodoButton = document.querySelector("#submit-button-todo");

addTodoButton.addEventListener("click", () => {
  addNewTodoForm.showModal();
  updateProjectSelectOptions(projectList);
});
closeTodoButton.addEventListener("click", () => {
  addNewTodoForm.close();
  //reset form even if clicking close button
  const {
    doneStatus,
    description,
    title,
    priority,
    toProject,
    dueDate,
    notes,
  } = getTodoFormElements();
  refreshTodoForm(
    title,
    description,
    dueDate,
    priority,
    notes,
    doneStatus,
    toProject
  );
  todoBeingEdited = null;
});
//If users click submit todo Button, it will create the new todo and add it to the selected project. It also refresh the form after submitting and display the new todo in the screen. If users are editing todo, clicking submit button will not create new todo but help users edit todo values
submitTodoButton.addEventListener("click", () => {
  const {
    doneStatus,
    description,
    title,
    priority,
    toProject,
    dueDate,
    notes,
  } = getTodoFormElements();
  if (
    validateForm(
      doneStatus,
      description,
      title,
      priority,
      toProject,
      dueDate,
      notes
    ) === false
  ) {
    alert("Please fill out the entire form!");
    return;
  }
  //check for whether users create new todo or edit todo
  if (todoBeingEdited !== null) {
    const todoContainer = document.querySelector(
      `div[data-name="${projectOfTodoBeingEdited.name}"] div[data-title="${todoBeingEdited.title}"]`
    );
    todoContainer.dataset.title = title.value;

    editTodoDetails(
      todoBeingEdited,
      title,
      description,
      dueDate,
      priority,
      notes,
      doneStatus
    );
    saveProjectList();
    renderTodoUI(todoContainer, projectOfTodoBeingEdited, todoBeingEdited);
    addNewTodoForm.close();
    refreshTodoForm(
      title,
      description,
      dueDate,
      priority,
      notes,
      doneStatus,
      toProject
    );
    todoBeingEdited = null;
    projectOfTodoBeingEdited = null;
    return;
  }

  const newTodo = createTodoItem(
    title.value,
    description.value,
    dueDate.value,
    priority.value,
    notes.value,
    doneStatus.value
  );
  const projectIndex = projectList.findIndex(
    (project) => project.name === toProject.value
  );

  pushItemToProject(newTodo, projectList[projectIndex]);
  addNewTodoForm.close();
  refreshTodoForm(
    title,
    description,
    dueDate,
    priority,
    notes,
    doneStatus,
    toProject
  );
  renderTodoInProjectCard(projectList[projectIndex], newTodo);
  saveProjectList();
});

//show a form for users to add new project
const addNewProjectForm = document.querySelector("#add-project-form");
const addProjectButton = document.querySelector(".add-project-button");
const closeProjectButton = document.querySelector("#close-button-project");
const submitProjectButton = document.querySelector("#submit-button-project");

addProjectButton.addEventListener("click", () => {
  addNewProjectForm.showModal();
});
closeProjectButton.addEventListener("click", () => {
  addNewProjectForm.close();
  const newProjectName = document.querySelector("#project-name");
  newProjectName.value = "";
});
//If users click submit Project Button, it will create new project and display it in the screen
submitProjectButton.addEventListener("click", () => {
  const newProjectName = document.querySelector("#project-name");
  if (newProjectName.value === "") {
    alert("Please fill out the entire form!");
    return;
  }
  const newProject = createProject(newProjectName.value);
  pushProjectToProjectList(projectList, newProject);
  addNewProjectForm.close();
  newProjectName.value = "";
  displayProjectCard(newProject);
  saveProjectList();
});

//update projectList to localStorage if there are any changes
function saveProjectList() {
  localStorage.setItem("ProjectList", JSON.stringify(projectList));
}
function loadProjectList() {
  const savedData = localStorage.getItem("ProjectList");
  if (savedData) {
    return JSON.parse(savedData);
  }
  return null;
}
//check for latest projectList stored in localStorage every time refreshing the web
let projectList = loadProjectList();
//create default project if there are not any project in the projectList
if (!projectList || projectList.length === 0) {
  const defaultProject = createProject("Default project");
  projectList = createProjectList();
  pushProjectToProjectList(projectList, defaultProject);
  updateProjectSelectOptions(projectList);
}
// Show all projects stored in projectList
if (projectList) {
  projectList.forEach((project) => {
    displayProjectCard(project);
    updateProjectSelectOptions(projectList);
    project.todoList.forEach((todo) => renderTodoInProjectCard(project, todo));
  });
}
