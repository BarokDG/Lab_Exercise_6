// Add to Local Storage
function addToDatabase(newTask) {
    let listofTasks;
    if(localStorage.getItem('tasks') == null) {
        listofTasks = [];
    }
    else {
        listofTasks = JSON.parse(localStorage.getItem('tasks'));
    }
    listofTasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(listofTasks));
}

// Load tasks from Local Storage
function loadfromDB() {
    let listofTasks;
    if (localStorage.getItem('tasks') == null) {
        listofTasks = []
    }
    else {
        listofTasks = JSON.parse(localStorage.getItem('tasks'));
    }

    return listofTasks; 
}

// Remove all tasks from Local Storage
function clearAllTasksfromDB() {
    localStorage.clear();
}

// Remove a task from Local storage
function removefromDB(taskItem) {
    let listofTasks;
    if (localStorage.getItem('tasks') == null) {
        listofTasks = []
    }
    else {
        listofTasks = JSON.parse(localStorage.getItem('tasks'));
    }

    listofTasks.forEach(function(task, index) {
        if (taskItem.textContent.trim() === task.trim()){
            listofTasks.splice(index, 1);
        }
    })
    localStorage.setItem('tasks', JSON.stringify(listofTasks));
}