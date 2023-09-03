"use strict";

// оголошуємо змінні з якими будемо працювати
const form = document.querySelector(".create-task-form");
const taskInput = document.querySelector(".task-input");
const filterInput = document.querySelector(".filter-input");
const taskList = document.querySelector(".collection");
const clearBtn = document.querySelector(".clear-tasks");

// слухачі подій
// запускаємо функцію showTasks коли весь HTML загружений
document.addEventListener("DOMContentLoaded", showTasks);
// запускаємо функцію addTask коли відправляємо форму (клікаємо на кнопку "Додати завдання")
form.addEventListener("submit", addTask);
// запускаємо функцію deleteTask коли клік попадає на список <ul>
taskList.addEventListener("click", deleteTask);
//taskList.addEventListener("click",editTask);
// запускаємо функцію після кліку на кнопку "Видалити всі елементи"
clearBtn.addEventListener("click", deleteAllTasks);
// запускаємо функцію filterTasks після того як ввідпускаємо клавішу (тоді, коли фокус в інпуті "Пошук завдань")
filterInput.addEventListener("keyup", filterTasks);

function showTasks() {
  // перевіряємо чи є у localStorage вже якісь завдання
  if (localStorage.getItem("tasks")) {
    // якщо вони там є - витягуємо їх і присвоюємо змінній
    const tasks = JSON.parse(localStorage.getItem("tasks"));

    
    tasks.forEach((task) => {
     
      const li = document.createElement("li");
      // всередині цього елементу списку додаємо опис завдання
      li.innerHTML = task;

      
      const button = document.createElement("button");
      
      button.innerHTML = "x";
      
      button.classList.add("btn-delete");
      
      li.append(button);

      
      const editButton = document.createElement("button");
    
      editButton.innerHTML = "<i class='fas fa-edit'></i>";
    
      editButton.classList.add("btn-edit");
    
      li.append(editButton);

      
      taskList.append(li);
    });
  }
}

// створюємо таску
function addTask(event) {
  // зупиняємо поведінку браузера за замовчуванням
  event.preventDefault();

  // отримуємо значення з інпута через форму
  const value = event.target.task.value;

  // повторюємо всі дії з функції showTasks
  const li = document.createElement("li");
  li.innerHTML = value;

  const deleteButton  = document.createElement("button");
  deleteButton.classList.add("btn-delete");
  deleteButton.innerHTML = "x";

  const editButton= document.createElement("button");
  editButton.classList.add("btn-edit");
  editButton.innerHTML = "<i class='fas fa-edit'></i>";

  li.append(deleteButton );
  li.append(editButton);
  taskList.append(li);

  // але тут ще записуємо задачу в локал сторедж
  storeTaskInLocalStorage(value);
  // і чистимо інпут
  taskInput.value = "";
}
function storeTaskInLocalStorage(task) {
  // оголошуємо змінну яка буде використовуватись для списку завдань
  let tasks;

  // перевіряємо чи є у localStorage вже якісь завдання
  if (localStorage.getItem("tasks") !== null) {
    // якщо вони там є - витягуємо їх і присвоюємо змінній
    tasks = JSON.parse(localStorage.getItem("tasks"));
  } else {
    // якщо їх там нема - присвоюємо змінній значення порожнього масиву
    tasks = [];
  }

  // додаємо до списку нове завдання
  tasks.push(task);

  // зберігаємо список завданнь в Local Storage
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// видалити якусь конкретну таску
function deleteTask(event) {
    if (event.target.classList.contains("btn-delete")) {
        const listItem = event.target.closest("li");
        const taskContent = listItem.firstChild.textContent;

        let tasks = JSON.parse(localStorage.getItem("tasks"));
        const indexToRemove = tasks.findIndex(task => task === taskContent);
        if (indexToRemove !== -1) {//індекс знайдено
            tasks.splice(indexToRemove, 1);

            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
        listItem.remove();
}
};
taskList.addEventListener("click", (event) => {
  const target = event.target;
  if (target.classList.contains("btn-edit")) {
    const listItem = target.closest("li");
    const index = Array.from(taskList.children).indexOf(listItem);
    editTask(index);
  } else if (target.classList.contains("btn-delete")) {
    
  }
});


function editTask(index) {
  console.log("Edit function ");
  const listItem = taskList.children[index];
  const taskText = listItem.firstChild.textContent;

  const newTaskText = prompt("Введіть новий текст завдання:", taskText);

  if (newTaskText !== null) {
    // Перевіряємо, чи користувач не натиснув "Скасувати"
    updateTaskInLocalStorage(index, newTaskText);
    listItem.firstChild.textContent = newTaskText;
  }
}


function updateTaskInLocalStorage(index, newTaskText) {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks[index] = newTaskText;

  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function removeTaskFromLocalStorage(taskContent) {
  // перевіряємо чи є у localStorage вже якісь завдання
  if (localStorage.getItem("tasks")) {
    // якщо вони там є - витягуємо їх і присвоюємо змінній
    const tasks = JSON.parse(localStorage.getItem("tasks"));

    // фільтруємо таски і повертаємо ті, які проходять умову
    const filteredTasks = tasks.filter((task) => task !== taskContent);

    // запусиємо нові задачі в Local Storage
    localStorage.setItem("tasks", JSON.stringify(filteredTasks));
  }
}
// видалити всі таски
function deleteAllTasks() {
  if (confirm("Ви впевнені що хочете видалити всі задачі?")) {
    // видаляємо весь контент всередині списку
    taskList.innerHTML = "";
    // видалити всі елементи з Local Storage
    removeAllTasksFromLocalStorage();
  }
}
function removeAllTasksFromLocalStorage() {
  // чистимо Local Storage
  localStorage.clear();
  //   localStorage.removeItem("tasks");
}
function filterTasks(event) {
  // отримуємо всі елементи списку
  const tasks = taskList.querySelectorAll("li");
  // отримуємо значення інпуту "Пошук завдань" і робимо його в нижньому регістрі
  const searchQuery = event.target.value.toLowerCase();

  // проходимось по кожному елементу завдань
  tasks.forEach((task) => {
    // отримуємо текст завдання
    const taskValue = task.firstChild.textContent.toLowerCase();

    // перевіряємо чи текст завдання має в собі значення інпута "Пошук завдань"
    if (taskValue.includes(searchQuery)) {
      // якщо має, то display = list-item
      task.style.display = "list-item";
    } else {
      // якщо ні - ховаємо це елемент списку
      task.style.display = "none";
    }
  });
}
