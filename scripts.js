let todoList = [];

// Load from localStorage then render
loadTodos();
renderTodoList();

function onkeybtn(event) {
  if (event.key === 'Enter') {
    addTodo();
  }
}

function addTodo() {
  const nameElem = document.querySelector('.todoinput');
  const dueDateElem = document.querySelector('.dueDate');

  if (!nameElem || !dueDateElem) return; // safety

  const name = nameElem.value.trim();
  const dueDate = dueDateElem.value;

  if (!name && !dueDate) return; // don't add empty todos (optional)

  todoList.push({ name: name, dueDate: dueDate });
  nameElem.value = '';
  dueDateElem.value = '';

  saveTodos();
  renderTodoList();
}

function deleteTodo(index) {
  todoList.splice(index, 1);
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
  console.log(data)
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