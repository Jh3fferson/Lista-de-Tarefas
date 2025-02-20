const taskTitleInput = document.querySelector("#task-title-input");
const form = document.querySelector("#todo-form");
const todoListUl = document.querySelector("#todo-list");
const prioritySelect = document.getElementById("priority-select");

window.onload = function () { // Garante que as informações salvas anteriomente irão aparecer quando a página for recarregada
  recreateList();
};


form.addEventListener("submit", (event) => {// Cria uma nova tarefa
  event.preventDefault(); // Evita o comportamento padrão de recarregar a página ao submeter o formulário

  const taskTitle = taskTitleInput.value;
  let taskPriorityValue = prioritySelect.value;

  if (taskTitle.length < 3 || taskPriorityValue === "0") {
    alert("Sua tarefa precisa ter, pelo menos 3 caracteres, ou você não definiu a prioridade!");
    return;
  }

  recreateList(taskTitle, taskPriorityValue);
  taskTitleInput.value = ""; // apagar o que o usúario digitou dentro do input quando for adicionado
});

todoListUl.addEventListener("click", function (event) {// Remove a tarefa que pertence ao botão que recebeu o evento click
  if (event.target.tagName === "BUTTON") {
    const li = event.target.parentNode;
    const titleToRemove = li.querySelector("span").textContent;
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter((t) => t.title !== titleToRemove);
    li.remove();
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
});

todoListUl.addEventListener("change", function (event) { // Salva qual é o status da tarefa no LocalStorage
  if (event.target.tagName === "SELECT") {
    const li = event.target.parentNode;
    const titleToChange = li.querySelector("span").textContent;
    const text = li.querySelector("select").value;
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    for (n in tasks) {
      if (tasks[n].title == titleToChange) {
        tasks[n].status = text;
      }
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
});

function createList(task) { // Cria a lista de tarefas de acordo com o que está no LocalStorage
  const li = document.createElement('li');
  todoListUl.appendChild(li);

  const select = document.createElement('select');
  li.appendChild(select);

  const spanTask = document.createElement('span');
  spanTask.textContent = task.title;
  li.appendChild(spanTask);

  const button = document.createElement('button');
  button.textContent = "Remover";
  button.setAttribute('type', 'submit');
  li.appendChild(button);

  defineStyle(li, select, task.priority);
  selectedOption(task, select);
}

function StorageTasks(taskTitle, taskPriorityValue) { // Armazena a tarefa no LocalStorage
  document.getElementById("todo-list").innerHTML = "";
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push({
    title: taskTitle,
    priority: taskPriorityValue,
    done: false,
    status: "Pendente"
  });

  let priorityOfSort = ["Alta", "Média", "Baixa"];
  let tasksSort = [];
  for (const p of priorityOfSort) {
    for (const n in tasks) {
      if (tasks[n].priority === p) {
        tasksSort.push(tasks[n]);
        continue;
      }
    }
  }
  tasks = tasksSort;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  return tasks;
}

function recreateList(taskTitle, taskPriorityValue) { // Recria a lista se necessário atualizar
  for (const n of StorageTasks(taskTitle, taskPriorityValue)) {
    createList(n);
  }
}

function selectedOption(task, select) { // Pega qual foi o último estado de status no LocalStorage e recupera a escolha feita
  const option = [document.createElement('option'), document.createElement('option'), document.createElement('option')];
  let status = ["Pendente", "Em andamento", "Concluída"];
  status = status.filter((t) => t !== task.status);
  status.unshift(task.status);
  for (const n in option) {
    option[n].textContent = status[n];
    select.appendChild(option[n]);
  }
}


function defineStyle(li, select, priority) { // Define o style do css de elementos dinâmicos
  li.style.color = colorsOfPriority(priority);
  li.style.background = "rgb(236, 233, 233)";
  select.style.background = "rgb(157, 192, 183)";
  select.style.borderRadius = "5px"
  select.style.height = "1.9rem"
  select.style.border = "none"
  select.style.color = "rgba(255, 255, 255, 0.86)"
}

function colorsOfPriority(priority) { // Define as cores que serão usadas nos títulos das tarefas
  if (priority === "Alta") {
    return "rgb(131, 25, 25)";
  }
  else if (priority === "Média") {
    return "rgb(212, 150, 14)";
  }
  else if (priority === "Baixa") {
    return "rgb(40, 100, 55)";
  }
}
