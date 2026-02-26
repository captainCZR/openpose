const STORAGE_KEY = "todolist-items";

/** @type {{ id: string, text: string, completed: boolean }[]} */
let todos = loadTodos();
let currentFilter = "all";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const count = document.getElementById("todo-count");
const clearCompletedBtn = document.getElementById("clear-completed");
const template = document.getElementById("todo-item-template");
const filterButtons = document.querySelectorAll(".filter-btn");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  todos.unshift({
    id: crypto.randomUUID(),
    text,
    completed: false,
  });

  input.value = "";
  saveTodos();
  render();
});

clearCompletedBtn.addEventListener("click", () => {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  render();
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter || "all";
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    render();
  });
});

function render() {
  list.innerHTML = "";

  const filteredTodos = todos.filter((todo) => {
    if (currentFilter === "active") return !todo.completed;
    if (currentFilter === "completed") return todo.completed;
    return true;
  });

  for (const todo of filteredTodos) {
    const item = template.content.firstElementChild.cloneNode(true);
    const checkbox = item.querySelector(".toggle");
    const text = item.querySelector(".text");
    const deleteBtn = item.querySelector(".delete");

    checkbox.checked = todo.completed;
    text.textContent = todo.text;

    if (todo.completed) {
      item.classList.add("completed");
    }

    checkbox.addEventListener("change", () => {
      todo.completed = checkbox.checked;
      saveTodos();
      render();
    });

    deleteBtn.addEventListener("click", () => {
      todos = todos.filter((entry) => entry.id !== todo.id);
      saveTodos();
      render();
    });

    list.appendChild(item);
  }

  const activeCount = todos.filter((todo) => !todo.completed).length;
  count.textContent = `${activeCount} 项未完成`;
}

function loadTodos() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item) => {
      return (
        item &&
        typeof item.id === "string" &&
        typeof item.text === "string" &&
        typeof item.completed === "boolean"
      );
    });
  } catch {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

render();
