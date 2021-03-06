// Define UI Variables
const taskInput = document.querySelector("#task"); //the task input text field
const form = document.querySelector("#task-form"); //The form at the top
const filter = document.querySelector("#filter"); //the task filter text field
const taskList = document.querySelector(".collection"); //The UL
const clearBtn = document.querySelector(".clear-tasks"); //the all task clear button
const sortAscBtn = document.querySelector("#sortAsc");
const sortDescBtn = document.querySelector("#sortDesc");

const reloadIcon = document.querySelector(".fa"); //the reload button at the top navigation

//DB variable

let DB;

// Add Event Listener [on Load]
document.addEventListener("DOMContentLoaded", () => {

    // create the database
    let TasksDB = indexedDB.open("tasks", 1);

    // if there's an error
    TasksDB.onerror = function () {
        console.log("There was an error");
    };
    // if everything is fine, assign the result to the instance
    TasksDB.onsuccess = function () {
        console.log("Database Ready");
        // save the result
        DB = TasksDB.result;
        // display the Task List
        displayTaskList();
        // sortDesc();
    };
    // This method runs once (great for creating the schema)
    TasksDB.onupgradeneeded = function (e) {
        // the event will be the database
        let db = e.target.result;

        // create an object store,
        let objectStore = db.createObjectStore("tasks", {
            keyPath: "id",
            autoIncrement: true,
        });

        // createindex: 1) field name 2) keypath 3) options
        objectStore.createIndex("taskname", "taskname", {
            unique: false
        });
        objectStore.createIndex("taskDate", "taskDate", {
            unique: false
        });

        console.log("Database ready and fields created!");
    };

    form.addEventListener("submit", addNewTask);

    function addNewTask(e) {
        e.preventDefault();

        // Check empty entry
        if (taskInput.value === "") {
            taskInput.style.borderColor = "red";

            return;
        }

        // create a new object with the form info
        let today = new Date();
        let dateValue =
            today.getDate() +
            "-" +
            today.getMonth() +
            "-" +
            today.getFullYear() +
            " " +
            today.getHours() +
            ":" +
            today.getMinutes() +
            ":" +
            today.getSeconds();

        let newTask = {
            taskname: taskInput.value,
            taskDate: dateValue,
        };

        // Insert the object into the database
        let transaction = DB.transaction(["tasks"], "readwrite");
        let objectStore = transaction.objectStore("tasks");

        let request = objectStore.add(newTask);

        // on success
        request.onsuccess = () => {
            form.reset();
        };
        transaction.oncomplete = () => {
            console.log("New appointment added");

            displayTaskList();
        };
        transaction.onerror = () => {
            console.log("There was an error, try again!");
        };
    }

    function displayTaskList() {
        // clear the previous task list
        while (taskList.firstChild) {
            taskList.removeChild(taskList.firstChild);
        }

        // create the object store
        let objectStore = DB.transaction("tasks").objectStore("tasks");
        let x;
        let y = [];

        objectStore.openCursor().onsuccess = function (e) {
            // assign the current cursor
            let cursor = e.target.result;

            if (cursor) {
                // Create an li element when the user adds a task
                const li = document.createElement("li");
                //add Attribute for delete
                li.setAttribute("data-task-id", cursor.value.id);

                // Adding a class
                li.className = "collection-item";
                // Create text node and append it

                li.appendChild(document.createTextNode(cursor.value.taskname));
                x = {
                    taskName: cursor.value.taskname,
                    taskDate: cursor.value.taskDate,
                };

                y.push(JSON.stringify(x));

                // Create new element for the link
                const link = document.createElement("a");
                // Add class and the x marker for a
                link.className = "delete-item secondary-content";
                link.innerHTML = `
                 <i class="fa fa-remove"></i>
                &nbsp;
                <a href="./edit.html?id=${cursor.value.id}"><i class="fa fa-edit"></i> </a>
                `;
                // Append link to li
                li.appendChild(link);
                // Append to UL
                taskList.appendChild(li);
                cursor.continue();
            }
        };
    }
    // Remove task event [event delegation]
    taskList.addEventListener("click", removeTask);

    function removeTask(e) {
        if (e.target.parentElement.classList.contains("delete-item")) {
            if (confirm("Are You Sure about that ?")) {
                // get the task id
                let taskID = Number(
                    e.target.parentElement.parentElement.getAttribute("data-task-id")
                );
                // use a transaction
                let transaction = DB.transaction("tasks", "readwrite");
                let ObjectStore = transaction.objectStore("tasks");
                ObjectStore.delete(taskID);
                transaction.oncomplete = () => {
                    e.target.parentElement.parentElement.remove();
                };
            }
        }
    }

    //clear button event listener
    clearBtn.addEventListener("click", clearAllTasks);

    //clear tasks
    function clearAllTasks() {
        let transaction = DB.transaction("tasks", "readwrite");
        let tasks = transaction.objectStore("tasks");
        // clear the table.
        tasks.clear();
        displayTaskList();
        console.log("Tasks Cleared !!!");
    }

    // Filtering
    filter.addEventListener("keyup", filterTasks);

    function filterTasks(e) {

        // create the object store
        let objectStore = DB.transaction("tasks").objectStore("tasks");
        while (taskList.firstChild) {
            taskList.removeChild(taskList.firstChild);
        }

        objectStore.openCursor().onsuccess = function (e) {
            // assign the current cursor
            let cursor = e.target.result;

            if (cursor) {
                if (cursor.value.taskname.indexOf(filter.value)) {} else {
                    // Create an li element when the user adds a task
                    const li = document.createElement("li");
                    //add Attribute for delete
                    li.setAttribute("data-task-id", cursor.value.id);

                    // Adding a class
                    li.className = "collection-item";
                    // Create text node and append it

                    li.appendChild(document.createTextNode(cursor.value.taskname));

                    // Create new element for the link
                    const link = document.createElement("a");
                    // Add class and the x marker for a
                    link.className = "delete-item secondary-content";
                    link.innerHTML = `
                 <i class="fa fa-remove"></i>
                &nbsp;
                <a href="./edit.html?id=${cursor.value.id}"><i class="fa fa-edit"></i> </a>
                `;
                    // Append link to li
                    li.appendChild(link);
                    // Append to UL
                    taskList.appendChild(li);
                }
                cursor.continue();
            }
        };
    }

    sortAscBtn.addEventListener("click", displayTaskList);
    sortDescBtn.addEventListener("click", sort);

    function sort() {
        let tasks = [];
        let cursor;
        let readRequest = DB.transaction(["tasks"])
            .objectStore("tasks")
            .openCursor();

        readRequest.onerror = function () {
            console.log("Error Reading");
        };

        readRequest.onsuccess = function (e) {
            cursor = e.target.result;

            if (cursor) {
                tasks.push(cursor.value);
                cursor.continue();
            }
        };

        setTimeout(() => {
            let sortedArray = Array.from(bubbleSortD(tasks));
            while (taskList.firstChild) {
                taskList.removeChild(taskList.firstChild);
            }

            for (let i = 0; i < sortedArray.length; i++) {
                const li = document.createElement("li");
                //add Attribute for delete
                li.setAttribute("data-task-id", sortedArray[i].id);
                li.className = "collection-item";
                // Create text node and append it

                li.appendChild(document.createTextNode(sortedArray[i].taskname));

                // Create new element for the link
                const link = document.createElement("a");
                // Add class and the x marker for a
                link.className = "delete-item secondary-content";
                link.innerHTML = `
                <i class="fa fa-remove"></i>
               &nbsp;
               <a href="./edit.html?id=${sortedArray[i].id}"><i class="fa fa-edit"></i> </a>
               `;
                // Append link to li
                li.appendChild(link);
                // Append to UL
                taskList.appendChild(li);
            }
        }, 100);
    }
});

function bubbleSortD(arr) {
    var len = arr.length;
    for (var i = len - 1; i >= 0; i--) {
        for (var j = 1; j <= i; j++) {
            if (arr[j - 1].taskDate < arr[j].taskDate) {
                var temp = arr[j - 1];
                arr[j - 1] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;
}

// Materialize Dropdown
$(".dropdown-trigger").dropdown();