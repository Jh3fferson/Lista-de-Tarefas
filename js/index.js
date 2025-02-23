import { TaskManager } from "./TaskManager.js"

const taskTitleInput = document.querySelector('#task-title-input');
const form = document.querySelector('#todo-form');
const todoListUl = document.querySelector('#todo-list');
const prioritySelect = document.querySelector('#priority-select');

const taskManager = new TaskManager();

window.onload = function () { // Garante que as informações salvas anteriormente irão aparecer quando a página for recarregada
  taskManager.reloadTasks();
};

form.addEventListener("submit", (event) => {// Chama a função para criar uma tarefa caso seja acionado o elemento form-button
  initializeTask(event)
});
taskTitleInput.addEventListener("keydown", (event) => {// Chama a função para criar uma tarefa caso seja acionado a tecla Enter no elemento task-title-input
  if (event.key === "Enter") {
    initializeTask(event);
  }
});

todoListUl.addEventListener("click", function (event) {// Remove a tarefa que pertence ao botão que recebeu o evento click
  if (event.target.tagName === "BUTTON") {
    const li = event.target.parentNode;
    taskManager.removeTask(li);
  }
});

todoListUl.addEventListener("change", function (event) { // Salva qual é o status da tarefa no LocalStorage
  if (event.target.tagName === "SELECT") {
    const li = event.target.closest('li');
    const newStatus = li.querySelector('select').value;
    taskManager.updateTaskStatus(li, newStatus);
  }
});

function initializeTask(event) { // Inicializa uma nova tarefa
  event.preventDefault(); // Evita o comportamento padrão de recarregar a página ao submeter o formulário
  
  const taskTitle = taskTitleInput.value;
  let taskPriorityValue = prioritySelect.value;
  
  removeErrorMessage();
  if(errorTest(taskTitle.length, taskPriorityValue) < 0){
    return;
  }

  taskManager.createTask(taskTitle, taskPriorityValue);
  taskTitleInput.value = "";
}


function errorTest(taskTitleLength, taskPriorityValue){ // Faz uma verificação para que o úsuario não insira valores inválidos, e indica aonde ele errou através da mudança de cor da borda do elemento

  if(taskTitleLength < 3 && taskPriorityValue === ""){
    showErrorMessage("Sua tarefa precisa ter pelo menos 3 caracteres e também deve ter sua prioridade definida!");
      taskTitleInput.style.borderColor = "rgb(223, 58, 58)";
      prioritySelect.style.borderColor = "rgb(223, 58, 58)";
      return -1;
    }
    if(taskTitleLength < 3){
      showErrorMessage("Sua tarefa precisa ter, pelo menos 3 caracteres");
      taskTitleInput.style.borderColor = "rgb(223, 58, 58)";
      return -1;
    }
    else if(taskPriorityValue === ""){
      showErrorMessage("Antes de adicionar a tarefa, defina a prioridade");
      prioritySelect.style.borderColor = "rgb(223, 58, 58)";
      return -1;
    }

    return 0;
}

function showErrorMessage(message) { // Apresenta uma mensagem de erro para mostrar aonde o úsuario errou
  const messageError = document.querySelector('#message-error');

  messageError.textContent = message;
  messageError.style.color = 'rgb(223, 58, 58)';
}

function removeErrorMessage() { // remove a mensagem de erro
  const messageError = document.querySelector('#message-error');
  messageError.textContent = "";
  taskTitleInput.style.borderColor = "black";
  prioritySelect.style.borderColor = "black";
}