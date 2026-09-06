let todoList = [];

// Stores the index of the todo currently being edited.
let editingTodoIndex = null;

// Load from localStorage then render
loadTodos();
renderTodoList();

function onkeybtn(event) {
  if (event.key === 'Enter') {
    if (editingTodoIndex !== null) {
      saveEdit();
    } else {
      addTodo();
    }
  }
}

function addTodo() {
  const nameElem = document.querySelector('.todoinput');
  const dueDateElem = document.querySelector('.dueDate');

  if (!nameElem || !dueDateElem) return;

  const name = nameElem.value.trim();
  const dueDate = dueDateElem.value;

  if (!name && !dueDate) return;

  todoList.push({ name: name, dueDate: dueDate });
  nameElem.value = '';
  dueDateElem.value = '';

  saveTodos();
  renderTodoList();
}

function editTodo(index) {
  const todo = todoList[index];
  const nameElem = document.querySelector('.todoinput');
  const dueDateElem = document.querySelector('.dueDate');
  const addButton = document.querySelector('.add-todo-button');

  if (!todo || !nameElem || !dueDateElem || !addButton) return;

  editingTodoIndex = index;
  nameElem.value = todo.name;
  dueDateElem.value = todo.dueDate;
  addButton.textContent = 'Save';
  nameElem.focus();
}

function saveEdit() {
  const nameElem = document.querySelector('.todoinput');
  const dueDateElem = document.querySelector('.dueDate');
  const addButton = document.querySelector('.add-todo-button');

  if (editingTodoIndex === null || !nameElem || !dueDateElem || !addButton) return;

  const name = nameElem.value.trim();
  const dueDate = dueDateElem.value;

  if (!name && !dueDate) return;

  todoList[editingTodoIndex] = {
    name: name,
    dueDate: dueDate
  };

  editingTodoIndex = null;
  nameElem.value = '';
  dueDateElem.value = '';
  addButton.textContent = 'Add';

  saveTodos();
  renderTodoList();
}

function cancelEdit() {
  const nameElem = document.querySelector('.todoinput');
  const dueDateElem = document.querySelector('.dueDate');
  const addButton = document.querySelector('.add-todo-button');

  editingTodoIndex = null;

  if (nameElem) nameElem.value = '';
  if (dueDateElem) dueDateElem.value = '';
  if (addButton) addButton.textContent = 'Add';
}

function deleteTodo(index) {
  todoList.splice(index, 1);

  if (editingTodoIndex === index) {
    cancelEdit();
  } else if (editingTodoIndex !== null && editingTodoIndex > index) {
    editingTodoIndex--;
  }

  saveTodos();
  renderTodoList();
}

function renderTodoList() {
  let todoListHTML = '';

  for (let i = 0; i < todoList.length; i++) {
    const { name, dueDate } = todoList[i];
    todoListHTML += `
      <div class="todo-row">
        <div class="todo-name">${escapeHtml(name)}</div>
        <div class="todo-due">${escapeHtml(dueDate)}</div>
        <button class="edit-todo-button" onclick="editTodo(${i})">Edit</button>
        <button class="delete-todo-button" onclick="deleteTodo(${i})">Delete</button>
      </div>`;
  }

  document.getElementById('todoListOutput').innerHTML = todoListHTML;
}

// Save the todoList array to localStorage
function saveTodos() {
  localStorage.setItem('todoList', JSON.stringify(todoList));
}

// Load the todoList array from localStorage
function loadTodos() {
  const data = localStorage.getItem('todoList');

  if (data) {
    todoList = JSON.parse(data);
  } else {
    todoList = [];
  }

  console.log(data);
}

// Small helper to avoid injecting raw HTML (protects against accidental HTML in names)
function escapeHtml(str) {
  if (!str) return '';

  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');
}