// Define UI Variables 
const taskInput = document.querySelector('#task'); //the task input text field
const form = document.querySelector('#task-form'); //The form at the top
const filter = document.querySelector('#filter'); //the task filter text field
const taskList = document.querySelector('.collection'); //The UL
const clearBtn = document.querySelector('.clear-tasks'); //the all task clear button

const reloadIcon = document.querySelector('.fa'); //the reload button at the top navigation 

// Add Event Listener  [Form , clearBtn and filter search input ]

// form submit 
form.addEventListener('submit', addNewTask);
// Clear All Tasks
clearBtn.addEventListener('click', clearAllTasks);
//   Filter Task 
filter.addEventListener('keyup', filterTasks);
// Remove task event [event delegation]
taskList.addEventListener('click', removeTask);
// Event Listener for reload 
reloadIcon.addEventListener('click', reloadPage);

// DOM load event
document.addEventListener('DOMContentLoaded', loadTasksfromDB)


// Add New  Task Function definition 
function addNewTask(e) {

    e.preventDefault(); //disable form submission


    // Check empty entry
    if (taskInput.value === '') {
        taskInput.style.borderColor = "red";

        return;
    }

    // Create an li element when the user adds a task 
    const li = document.createElement('li');

    // Adding a class
    li.className = 'collection-item';

    // Create text node and append it 
    li.appendChild(document.createTextNode(taskInput.value));

    // Create new element for the link 
    const link = document.createElement('a');

    // Add class and the x marker for a 
    link.className = 'delete-item secondary-content';
    link.innerHTML = '<i class="fa fa-remove"></i>';

    // Append link to li
    li.appendChild(link);

    // Append to UL 
    taskList.appendChild(li);

    addToDatabase(taskInput.value);

    taskInput.value = '';

}


// Load task from Storage Database
function loadTasksfromDB() {
    let listofTasks = loadfromDB();
    if (listofTasks.length != 0) {
        listofTasks.forEach(eachTask => {
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.appendChild(document.createTextNode(eachTask));

            const link = document.createElement('a');
            link.className = 'delete-item secondary-content';
            link.innerHTML = '<i class="fa fa-remove"></i>';
            li.appendChild(link);

            taskList.appendChild(li);
        });
    }
}


// Clear Task Function definition 
function clearAllTasks() {
    while (taskList.firstChild) {
        taskList.removeChild(taskList.firstChild);
    }

    clearAllTasksfromDB();
}



// Filter tasks function definition 
function filterTasks(e) {

    let filterSearch = filter.value;
    let listItems = document.querySelectorAll(".collection-item");

    listItems.forEach((item) => {
        if (item.textContent.indexOf(filterSearch)) {
            item.style.display = "none";
        } else {
            item.style.display = "block";
        }
    })
}

// Remove Task function definition 
function removeTask(e) {
    if (e.target.parentElement.classList.contains('delete-item')) {
        e.target.parentElement.parentElement.remove();
    }

    removefromDB(e.target.parentElement.parentElement);
}


// Reload Page Function 
function reloadPage() {
    //using the reload fun on location object 
    location.reload();
}
