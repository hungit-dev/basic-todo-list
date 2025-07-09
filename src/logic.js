function createTodoItem(
  title,
  description,
  dueDate,
  priority,
  notes,
  doneStatus
) {
  return { title, description, dueDate, priority, notes, doneStatus };
}
function createProject(name) {
  return { name, todoList: [] };
}
function createProjectList() {
  const projectList = [];
  return projectList;
}
function pushProjectToProjectList(projectList, project) {
  projectList.push(project);
}
function pushItemToProject(item, project) {
  project.todoList.push(item);
}
function removeItemFromProject(project, value) {
  const todoItemIndex = project.todoList.findIndex(
    (item) => item.title === value
  );
  if (todoItemIndex !== -1) {
    project.todoList.splice(todoItemIndex, 1);
  }
}
function removeProjectFromProjectList(projectList, value) {
  const projectIndex = projectList.findIndex(
    (project) => project.name === value
  );
  if (projectIndex !== -1) {
    projectList.splice(projectIndex, 1);
  }
}
function validateForm(
  doneStatus,
  description,
  title,
  priority,
  toProject = null,
  dueDate,
  notes
) {
  if (toProject) {
    if (
      !doneStatus ||
      description.value === "" ||
      title.value === "" ||
      priority.value === "" ||
      toProject.value === "" ||
      dueDate.value === "" ||
      notes.value === ""
    ) {
      return false;
    }
  }
  if (toProject === null) {
    if (
      !doneStatus ||
      description.value === "" ||
      title.value === "" ||
      priority.value === "" ||
      dueDate.value === "" ||
      notes.value === ""
    ) {
      return false;
    }
  }
  return true;
}
function refreshTodoForm(
  title,
  description,
  dueDate,
  priority,
  notes,
  doneStatus = null,
  toProject = null
) {
  title.value = "";
  description.value = "";
  dueDate.value = "";
  priority.value = "";
  notes.value = "";
  if (doneStatus) {
    doneStatus.checked = false;
  }
  if (toProject) {
    toProject.value = "Default project";
  }
}
function editTodoDetails(
  todoName,
  newTitle,
  newDescription,
  newDueDate,
  newPriority,
  newNotes,
  newDoneStatus
) {
  todoName.title = newTitle.value;
  todoName.description = newDescription.value;
  todoName.dueDate = newDueDate.value;
  todoName.priority = newPriority.value;
  todoName.notes = newNotes.value;
  todoName.doneStatus = newDoneStatus.value;
}
export {
  createTodoItem,
  createProject,
  createProjectList,
  pushProjectToProjectList,
  pushItemToProject,
  removeItemFromProject,
  removeProjectFromProjectList,
  editTodoDetails,
  validateForm,
  refreshTodoForm,
};
