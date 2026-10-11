// Todo App with persistence, completion toggle, and stats

const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');
const stats = document.getElementById('stats');

// Load tasks from localStorage or start empty
let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateStats() {
    const remaining = tasks.filter(t => !t.completed).length;
    stats.textContent = `${remaining} item${remaining !== 1 ? 's' : ''} left`;
}

function createTaskElement(task, index) {
    const li = document.createElement('li');
    li.classList.add('task-item');

    // Checkbox for completion
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.className = 'task-checkbox';
    checkbox.addEventListener('change', () => {
        task.completed = checkbox.checked;
        li.classList.toggle('completed', task.completed);
        saveTasks();
        updateStats();
    });

    // Task text
    const span = document.createElement('span');
    span.textContent = task.text;
    span.className = 'task-text';

    // Delete button
    const delBtn = document.createElement('button');
    delBtn.textContent = '✕';
    delBtn.title = 'Delete task';
    delBtn.className = 'delete-btn';
    delBtn.addEventListener('click', () => {
        tasks.splice(index, 1);
        render();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(delBtn);
    if (task.completed) li.classList.add('completed');
    return li;
}

function render() {
    // Clear list
    list.innerHTML = '';
    tasks.forEach((task, i) => {
        const li = createTaskElement(task, i);
        list.appendChild(li);
    });
    updateStats();
    saveTasks();
}

function addTodo() {
    const text = input.value.trim();
    if (!text) return;
    tasks.push({ text, completed: false });
    input.value = '';
    input.focus();
    render();
}

addBtn.addEventListener('click', addTodo);
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo();
});

// Initial render
render();
