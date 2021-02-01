// Define UI Variables 
const taskInput = document.querySelector('#task'); //the task input text field
const form = document.querySelector('#task-form'); //The form at the top
const filter = document.querySelector('#filter'); //the task filter text field
const taskList = document.querySelector('.collection'); //The UL
const clearBtn = document.querySelector('.clear-tasks'); //the all task clear button

const reloadIcon = document.querySelector('.fa'); //the reload button at the top navigation 

// DB variable
let DB;

// Add EventListener[on Load]
document.addEventListener('DOMContentLoaded', () => {
    let TasksDB = indexedDB.open("tasks", 1);

    TasksDB.onsuccess = function (e) {
        console.log('Database Ready!');

        DB = TasksDB.result;
        displayTaskList();
    }

    TasksDB.onerror = function (e) {
        console.log('Error occurred!')
    }

    TasksDB.onupgradeneeded = function (e) {
        let db = e.target.result;
        let objectStore = db.createObjectStore('tasks', {
            keyPath: 'id',
            autoIncrement: true
        });

        objectStore.createIndex('taskname', 'taskname', {
            unique: false
        });
        
        console.log("Database ready and fields created!");
    }

    form.addEventListener('submit', addNewTask);

    function addNewTask(e) {
        e.preventDefault();

        let newTask = {
            taskname: taskInput.value
        }

        let transaction = DB.transaction(['tasks'], 'readwrite');
        let objectStore = transaction.objectStore('tasks');
        
        let request = objectStore.add(newTask);

        request.onsuccess = () => {
            form.reset();
        }

        transaction.oncomplete = () => {
            console.log('New Task Added');
            displayTaskList();
        }

        transaction.onerror = () => {
            console.log("There was an error, try again!");
        }
    }

    function displayTaskList() {
        while (taskList.firstChild) {
            taskList.removeChild(taskList.firstChild);
        }

        let objectStore = DB.transaction('tasks').objectStore('tasks');

        objectStore.openCursor().onsuccess = function (e) {
            let cursor = e.target.result;

            if (cursor) {
                // Create an li element when the user adds a task 
                const li = document.createElement('li');

                // Add Attribute for delete 
                li.setAttribute('data-task-id', cursor.value.id);

                // Adding a class
                li.className = 'collection-item';

                // Create text node and append it 
                li.appendChild(document.createTextNode(cursor.value.taskname));

                // Create new element for the link 
                const link = document.createElement('a');

                // Add class and the x marker for a 
                link.className = 'delete-item secondary-content';
                link.innerHTML = `
                 <i class="fa fa-remove"></i>
                &nbsp;
                <a href="/Lesson 04 [Lab 06]/Finished/edit.html?id=${cursor.value.id}"><i class="fa fa-edit"></i> </a>
                `;
                // Append link to li
                li.appendChild(link);

                // Append to UL 
                taskList.appendChild(li);
                cursor.continue();
            }
        }
    }

    clearBtn.addEventListener('click', clearAllTasks);

    //clear tasks 
    function clearAllTasks() {
        let transaction = DB.transaction("tasks", "readwrite");
        let tasks = transaction.objectStore("tasks");

        // clear the table.
        tasks.clear();
        displayTaskList();
        console.log("Tasks Cleared !!!");
    }

    taskList.addEventListener('click', removeTask);

    function removeTask(e) {

        if (e.target.parentElement.classList.contains('delete-item')) {
            if (confirm('Are You Sure about that?')) {
                // get the task id
                let taskID = Number(e.target.parentElement.parentElement.getAttribute('data-task-id'));
                // use a transaction

                let transaction = DB.transaction(['tasks'], 'readwrite');
                let objectStore = transaction.objectStore('tasks');
                
                objectStore.delete(taskID);

                transaction.oncomplete = () => {
                    e.target.parentElement.parentElement.remove();
                }
            }
        }
    }
})