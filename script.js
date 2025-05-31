document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('addTaskForm');
    const taskNameInput = document.getElementById('taskNameInput');
    const taskTagInput = document.getElementById('taskTagInput');
    const taskList = document.getElementById('taskList');
    const taskCounter = document.getElementById('taskCounter');

    let tasks = getTasksFromLocalStorage();

    function getCurrentDateFormatted() {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function saveTasksToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function getTasksFromLocalStorage() {
        const storedTasks = localStorage.getItem('tasks');
        return storedTasks ? JSON.parse(storedTasks) : [];
    }
    
    function normalizeTagName(tag) {
        if (!tag || tag.trim() === '') return 'default';
        return tag.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    }

    function renderTasks() {
        taskList.innerHTML = '';
        let completedCount = 0;

        if (tasks.length === 0) {
            const emptyMessage = document.createElement('p');
            emptyMessage.textContent = 'Nenhuma tarefa por aqui ainda!';
            emptyMessage.style.textAlign = 'center';
            emptyMessage.style.color = '#6b7280';
            emptyMessage.style.padding = '1rem 0';
            taskList.appendChild(emptyMessage);
        } else {
            tasks.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.classList.add('task-item');
                taskItem.dataset.id = task.id;

                if (task.completed) {
                    taskItem.classList.add('completed');
                    completedCount++;
                }

                const taskInfo = document.createElement('div');
                taskInfo.classList.add('task-info');

                const taskName = document.createElement('h3');
                taskName.classList.add('task-name');
                taskName.textContent = task.name;

                const taskMeta = document.createElement('div');
                taskMeta.classList.add('task-meta');

                if (task.tag && task.tag.trim() !== '') {
                    const taskTagElement = document.createElement('span');
                    taskTagElement.classList.add('task-tag');
                    const normalizedTag = normalizeTagName(task.tag);
                    taskTagElement.classList.add(normalizedTag); 
                    taskTagElement.textContent = task.tag;
                    taskMeta.appendChild(taskTagElement);
                }
                
                const taskDate = document.createElement('span');
                taskDate.classList.add('task-date');
                taskDate.textContent = `Criado em: ${task.date}`;
                
                taskMeta.appendChild(taskDate);
                
                taskInfo.appendChild(taskName);
                taskInfo.appendChild(taskMeta);
                taskItem.appendChild(taskInfo);

                if (task.completed) {
                    const completedIcon = document.createElement('img');
                    completedIcon.classList.add('completed-icon');
                    completedIcon.src = 'check-circle.svg'; 
                    completedIcon.alt = 'Tarefa Concluída';
                    taskItem.appendChild(completedIcon);
                } else {
                    const completeButton = document.createElement('button');
                    completeButton.classList.add('complete-btn');
                    completeButton.textContent = 'Concluir';
                    completeButton.addEventListener('click', () => toggleCompleteTask(task.id));
                    taskItem.appendChild(completeButton);
                }
                taskList.appendChild(taskItem);
            });
        }
        updateTaskCounter(completedCount);
        saveTasksToLocalStorage();
    }

    function addTask(event) {
        event.preventDefault(); 

        const taskName = taskNameInput.value.trim();
        const taskTag = taskTagInput.value.trim();

        if (taskName === '') {
            alert('Por favor, insira um nome para a tarefa.');
            taskNameInput.focus();
            return;
        }

        const newTask = {
            id: Date.now(), 
            name: taskName,
            tag: taskTag,
            date: getCurrentDateFormatted(),
            completed: false
        };

        tasks.unshift(newTask); 
        renderTasks();

        taskNameInput.value = '';
        taskTagInput.value = '';
        taskNameInput.focus();
    }

    function toggleCompleteTask(taskId) {
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex > -1) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
            renderTasks();
        }
    }

    function updateTaskCounter(count) {
        taskCounter.textContent = `${count} tarefa${count !== 1 ? 's' : ''} concluída${count !== 1 ? 's' : ''}`;
    }

    taskForm.addEventListener('submit', addTask);

    function initializeApp() {
        if (tasks.length === 0) { 
            tasks.push(
                { id: Date.now() + 1, name: 'Implementar tela de listagem de tarefas', tag: 'frontend', date: getCurrentDateFormatted(), completed: false },
                { id: Date.now() + 2, name: 'Criar endpoint para cadastro de tarefas', tag: 'backend', date: getCurrentDateFormatted(), completed: false },
                { id: Date.now() + 3, name: 'Implementar protótipo da listagem de tarefas', tag: 'UX', date: getCurrentDateFormatted(), completed: true }
            );
        }
        renderTasks();
    }

    initializeApp();
});