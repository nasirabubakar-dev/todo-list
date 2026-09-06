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

  if (!nameElem || !dueDateElem) return;

  const name = nameElem.value.trim();
  const dueDate = dueDateElem.value;

  if (!name && !dueDate) return;

  // New tasks always start as incomplete.
  todoList.push({ name: name, dueDate: dueDate, completed: false });
  nameElem.value = '';
  dueDateElem.value = '';

  saveTodos();
  renderTodoList();
}

function toggleTodo(index) {
  if (!todoList[index]) return;

  todoList[index].completed = !todoList[index].completed;
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

  if (todoList.length === 0) {
    todoListHTML = '<div class="empty">No tasks yet. Add one above.</div>';
  }

  for (let i = 0; i < todoList.length; i++) {
    const { name, dueDate, completed } = todoList[i];
    const isCompleted = completed === true;

    todoListHTML += `
      <div class="todo-row ${isCompleted ? 'completed' : ''}">
        <label class="todo-check">
          <input type="checkbox" ${isCompleted ? 'checked' : ''} onchange="toggleTodo(${i})" aria-label="Mark ${escapeHtml(name)} as ${isCompleted ? 'incomplete' : 'complete'}">
          <span class="checkmark"></span>
        </label>
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
    try {
      todoList = JSON.parse(data);

      // Keep older saved tasks compatible with the new completed property.
      if (!Array.isArray(todoList)) {
        todoList = [];
      }
    } catch (error) {
      todoList = [];
      console.error('Could not load saved todos:', error);
    }
  } else {
    todoList = [];
  }
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