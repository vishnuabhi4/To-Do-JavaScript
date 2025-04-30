document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const emptyList = document.getElementById('emptyList');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    
    // Load tasks from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Render tasks on page load
    renderTasks();
    
    // Add task event
    addTaskBtn.addEventListener('click', addTask);
    
    // Add task when Enter key is pressed
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // Clear completed tasks
    clearCompletedBtn.addEventListener('click', clearCompleted);
    
    // Clear all tasks
    clearAllBtn.addEventListener('click', clearAll);
    
    // Function to add a new task
    function addTask() {
        const taskText = taskInput.value.trim();
        
        if (taskText !== '') {
            // Create new task object
            const newTask = {
                id: Date.now(),
                text: taskText,
                completed: false
            };
            
            // Add to tasks array
            tasks.push(newTask);
            
            // Save to localStorage
            saveTasks();
            
            // Render tasks
            renderTasks();
            
            // Clear input
            taskInput.value = '';
            taskInput.focus();
        }
    }
    
    // Function to toggle task completion
    function toggleTask(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        
        saveTasks();
        renderTasks();
    }
    
    // Function to edit a task
    function editTask(id) {
        const task = tasks.find(task => task.id === id);
        
        if (task) {
            const newText = prompt('Edit task:', task.text);
            
            if (newText !== null && newText.trim() !== '') {
                tasks = tasks.map(task => {
                    if (task.id === id) {
                        return { ...task, text: newText.trim() };
                    }
                    return task;
                });
                
                saveTasks();
                renderTasks();
            }
        }
    }
    
    // Function to delete a task
    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
    }
    
    // Function to clear completed tasks
    function clearCompleted() {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
    }
    
    // Function to clear all tasks
    function clearAll() {
        if (confirm('Are you sure you want to delete all tasks?')) {
            tasks = [];
            saveTasks();
            renderTasks();
        }
    }
    
    // Function to save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Function to render tasks
    function renderTasks() {
        // Clear the task list
        taskList.innerHTML = '';
        
        if (tasks.length === 0) {
            emptyList.style.display = 'block';
        } else {
            emptyList.style.display = 'none';
            
            // Loop through tasks and create list items
            tasks.forEach(task => {
                // Create list item
                const li = document.createElement('li');
                li.className = 'list-group-item';
                
                // Create checkbox for completion toggle
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'form-check-input';
                checkbox.checked = task.completed;
                checkbox.addEventListener('change', () => toggleTask(task.id));
                
                // Create span for task text
                const span = document.createElement('span');
                span.className = `task-text ${task.completed ? 'completed' : ''}`;
                span.textContent = task.text;
                span.addEventListener('click', () => toggleTask(task.id));
                
                // Create action buttons container
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'task-actions';
                
                // Create edit button
                const editBtn = document.createElement('button');
                editBtn.className = 'btn btn-sm btn-info btn-action';
                editBtn.innerHTML = '<i class="bi bi-pencil"></i> Edit';
                editBtn.addEventListener('click', () => editTask(task.id));
                
                // Create delete button
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'btn btn-sm btn-danger btn-action';
                deleteBtn.innerHTML = '<i class="bi bi-trash"></i> Delete';
                deleteBtn.addEventListener('click', () => deleteTask(task.id));
                
                // Append buttons to actions div
                actionsDiv.appendChild(editBtn);
                actionsDiv.appendChild(deleteBtn);
                
                // Append elements to list item
                li.appendChild(checkbox);
                li.appendChild(span);
                li.appendChild(actionsDiv);
                
                // Append list item to task list
                taskList.appendChild(li);
            });
        }
    }
});
