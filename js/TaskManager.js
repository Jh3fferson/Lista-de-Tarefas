const todoListUl = document.querySelector('#todo-list');

const PRIORITY_ORDER = { // Define qual a prioridade o value do select tem
    "Alta": 1,
    "Média": 2,
    "Baixa": 3
}

class Task { // Inicializa uma task, e talvez no futuro faça mais coisas
    constructor(title, priority, status) {
        this.title = title;
        this.priority = priority;
        this.status = status;
    }
}


class TaskManager { // Class para editar, adicionar ou remover as tarefas do localStorage e do elemento #todo-list

    constructor() { //Inicia this.tasks usando as tasks do localStorage
        this.tasks = this.loadTasks();
    }

    loadTasks() { // Retorna as task que estão no localStorage
        if (typeof (Storage) !== "undefined") { // Tratamento de erro simples
            try {
                return JSON.parse(localStorage.getItem("tasks")) || [];
            } catch (e) {
                console.error("Erro ao carregar tarefas:", e);
                return [];
            }
        } else {
            console.error("LocalStorage não suportado.");
            return [];
        }
    }

    createTask(title, priority) {
        const newTask = new Task(title, priority, "Pendente");
        this.tasks.push(newTask);
        this.reloadTasks();
    }

    saveTask() { // Salva as tasks do this.tasks no localStorage
        if (typeof (Storage) !== "undefined") { // Tratamento de erro simples
            try {
                localStorage.setItem("tasks", JSON.stringify(this.tasks));
            } catch (e) {
                console.error("Erro ao salvar no localStorage:", e);
            }
        } else {
            console.error("LocalStorage não suportado.");
        }
    }

    reloadTasks() { // Redefine as tasks
        this.sortTasks();
        this.saveTask();
        this.cleanList();
        this.tasks.forEach((task, index) => {
            this.createList(task, index);
        });
    }

    cleanList() { // Limpa o elemento #todo-list
        todoListUl.innerHTML = ""
    }

    sortTasks() { // Reorganiza this.tasks de acordo com PRIORITY_ORDER
        this.tasks.sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
    }

    createList(task, index) { // Cria a lista no html
        const li = this.createListLine(index);
        todoListUl.appendChild(li);
        const select = this.createStatusSelect(task.status);
        li.appendChild(select);
        const spanTask = this.createSpanTask(task.title);
        li.appendChild(spanTask);
        const button = this.createRemoveButton();
        li.appendChild(button);


        this.applyLineStyles(task.status, spanTask);
        this.applyLineColor(task.priority, li);
    }

    createListLine(index) { // Cria o elemento li
        const liTask = document.createElement('li');
        liTask.setAttribute('data-index', index);
        return liTask;
    }

    createStatusSelect(actualStatus) { // Cria o elemento select e define seu value
        const selectTask = document.createElement('select');
        const status = ["Pendente", "Em andamento", "Concluída"];
        status.forEach(status => {
            const option = document.createElement('option');
            option.textContent = status;
            selectTask.appendChild(option);
        });
        selectTask.value = actualStatus;
        return selectTask;
    }

    createSpanTask(title) { // Cria o elemento span e define seu text
        const spanTask = document.createElement('span');
        spanTask.textContent = title;
        return spanTask;
    }

    createRemoveButton() { // Cria um botão para remover as tarefas
        const buttonTask = document.createElement('button');
        buttonTask.textContent = "X";
        buttonTask.type = 'button';
        return buttonTask;
    }

    removeTask(li) { // remove as tarefas
        const index = li.getAttribute('data-index');
        this.tasks.splice(index, 1);
        li.remove();
        this.reloadTasks();
    }

    updateTaskStatus(li, newStatus) { // troca o status das tarefas
        const index = li.getAttribute('data-index');
        this.tasks[index].status = newStatus;
        this.reloadTasks();
    }

    applyLineStyles(status, spanTask) {// Define o text decoration de acordo com o status da tarefa 
        let lineStyle = {
            "Concluída": "line-through",
            "Em andamento": "underline",
            "Pendente": "none"
        };

        spanTask.style.textDecoration = lineStyle[status] || "none";
    }

    applyLineColor(priority, li) {// Define a cor do texto da tarefa de acordo com a prioridade
        let color = {
            "Alta": "rgb(131, 25, 25)",
            "Média": "rgb(212, 150, 14)",
            "Baixa": "rgb(40, 100, 55)"
        };
        li.style.color = color[priority] || "black";
    }

}

export { TaskManager };