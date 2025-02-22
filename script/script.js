const taskTitleInput = document.querySelector('#task-title-input');
const form = document.querySelector('#todo-form');
const todoListUl = document.querySelector('#todo-list');
const prioritySelect = document.getElementById('priority-select');

window.onload = function () { // Garante que as informações salvas anteriomente irão aparecer quando a página for recarregada
  loadTasksIntoList();
};


form.addEventListener("submit", (event) => {// Chama a função para criar uma tarefa caso seja acionado o elemento form-button
  createTask(event)
});
taskTitleInput.addEventListener("keydown", (event) => {// Chama a função para criar uma tarefa caso seja acionado a tecla Enter no elemento task-title-input
  if (event.key === "Enter") {
    createTask(event);
  }
});

todoListUl.addEventListener("click", function (event) {// Remove a tarefa que pertence ao botão que recebeu o evento click
  if (event.target.tagName === "BUTTON") {
    const li = event.target.parentNode;
    const index = li.getAttribute('data-index');
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.splice(index,1);
    li.remove();
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
});

todoListUl.addEventListener("change", function (event) { // Salva qual é o status da tarefa no LocalStorage
  if (event.target.tagName === "SELECT") {
    const li = event.target.closest('li');
    const newStatus = li.querySelector('select').value;
    const index = li.getAttribute('data-index'); 
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks[index].status = newStatus;
    applyTaskStyles(tasks[index], li)
    
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
});

function createTask(event) { // Cria uma nova tarefa
  event.preventDefault(); // Evita o comportamento padrão de recarregar a página ao submeter o formulário

  const taskTitle = taskTitleInput.value;
  let taskPriorityValue = prioritySelect.value;

  if (taskTitle.length < 3 || taskPriorityValue === "0") {
    alert("Sua tarefa precisa ter, pelo menos 3 caracteres, ou você não definiu a prioridade!");
    return;
  }

  saveTask(taskTitle, taskPriorityValue);
  taskTitleInput.value = ""; // apagar o que o usúario digitou dentro do input quando for adicionado
}

function saveTask(taskTitle, taskPriorityValue) { // Armazena a tarefa no LocalStorage
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({
      title: taskTitle,
      priority: taskPriorityValue,
      status: "Pendente"
    });
    tasks = sortTasksByPriority(tasks);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasksIntoList();

  return tasks;
}

function sortTasksByPriority(tasks){
  let priority = {"Alta":1, "Média":2, "Baixa":3};
  return tasks.sort((a, b) => priority[a.priority] - priority[b.priority]);

}

function loadTasksIntoList(){
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  cleanList();
  tasks.forEach((task, index) => {
    createList(task, index);  // Passa o índice junto com a tarefa
  });
}

function cleanList(){
  while (todoListUl.firstChild) {
    todoListUl.removeChild(todoListUl.firstChild);
  }
}

function createList(task, index) { // Cria a lista de tarefas de acordo com o que está no LocalStorage
  const li = document.createElement('li');
  li.setAttribute('data-index', index);
  todoListUl.appendChild(li);

  const select = document.createElement('select');
  li.appendChild(select);

  const spanTask = document.createElement('span');
  spanTask.textContent = task.title;
  li.appendChild(spanTask);

  const button = document.createElement('button');
  button.textContent = "Remover";
  button.type = 'submit';
  li.appendChild(button);

  applyTaskStyles(task, li);
  selectedOption(task, select);
}

function selectedOption(task, select) { // Pega qual foi o último estado de status no LocalStorage e recupera a escolha feita
  const option = [document.createElement('option'), document.createElement('option'), document.createElement('option')];
  let status = ["Pendente", "Em andamento", "Concluída"];
  for (const n in option) {
    option[n].textContent = status[n];
    select.appendChild(option[n]);
  }
  select.value = task.status;
}

function applyTaskStyles(task, li) {// Define a cor do texto da tarefa de acordo com a prioridade e também define o text decoration de acordo com o status da tarefa 
  let color = {
    "Alta" : "rgb(131, 25, 25)",
    "Média" : "rgb(212, 150, 14)",
    "Baixa" : "rgb(40, 100, 55)"
  };
  let lineStyle = {
    "Concluída" : "line-through",
    "Em andamento" : "underline",
    "Pendente" : "none"
  };
 
  li.querySelector('span').style.textDecoration = lineStyle[task.status] || "none";
  li.style.color = color[task.priority] || "black";
}