const fs = require("fs");

const FILE = "tasks.json";

// =========================
// Helper Functions
// =========================

function loadTasks() {
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, "[]");
  }

  const data = fs.readFileSync(FILE, "utf-8");

  if (!data.trim()) {
    return [];
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    console.log("Error: tasks.json contains invalid JSON.");
    process.exit(1);
  }
}

function saveTasks(tasks) {
  fs.writeFileSync(FILE, JSON.stringify(tasks, null, 2));
}

function generateId(tasks) {
  if (tasks.length === 0) {
    return 1;
  }

  return Math.max(...tasks.map(task => task.id)) + 1;
}

// =========================
// ADD
// =========================

function addTask(description) {
  if (!description) {
    console.log("Error: description must be provided.");
    return;
  }

  const tasks = loadTasks();

  const now = new Date().toISOString();

  const newTask = {
    id: generateId(tasks),
    description: description,
    status: "todo",
    createdAt: now,
    updatedAt: now
  };

  tasks.push(newTask);

  saveTasks(tasks);

  console.log(`Task has been added successfully (ID: ${newTask.id})`);
}

// =========================
// UPDATE
// =========================

function updateTask(id, description) {
  const tasks = loadTasks();

  const task = tasks.find(task => task.id === id);

  if (!task) {
    console.log(`Error: task with ID ${id} is not found.`);
    return;
  }

  if (!description) {
    console.log("Error: new description must be provided.");
    return;
  }

  task.description = description;
  task.updatedAt = new Date().toISOString();

  saveTasks(tasks);

  console.log(`Task ${id} is successfully updated.`);
}

// =========================
// DELETE
// =========================

function deleteTask(id) {
  const tasks = loadTasks();

  const index = tasks.findIndex(task => task.id === id);

  if (index === -1) {
    console.log(`Error: task with ID ${id} is not found.`);
    return;
  }

  tasks.splice(index, 1);

  saveTasks(tasks);

  console.log(`Task ${id} is successfully deleted.`);
}

// =========================
// UPDATE STATUS
// =========================

function updateStatus(id, status) {
  const tasks = loadTasks();

  const task = tasks.find(task => task.id === id);

  if (!task) {
    console.log(`Error: task with ID ${id} is not found.`);
    return;
  }

  task.status = status;
  task.updatedAt = new Date().toISOString();

  saveTasks(tasks);

  console.log(`Task ${id} is marked as ${status}.`);
}

// =========================
// LIST
// =========================

function listTasks(status) {
  const tasks = loadTasks();

  let filteredTasks = tasks;

  if (status) {
    const validStatus = ["todo", "in-progress", "done"];

    if (!validStatus.includes(status)) {
      console.log(
        "Error: status must be todo, in-progress, or done."
      );
      return;
    }

    filteredTasks = tasks.filter(task => task.status === status);
  }

  if (filteredTasks.length === 0) {
    console.log("No task.");
    return;
  }

  filteredTasks.forEach(task => {
    console.log(`
ID          : ${task.id}
Description : ${task.description}
Status      : ${task.status}
Created     : ${task.createdAt}
Updated     : ${task.updatedAt}
------------------------------
`);
  });
}

// =========================
// CLI
// =========================

const args = process.argv.slice(2);

const command = args[0];

switch (command) {

  case "add":
    addTask(args[1]);
    break;

  case "update": {
    const id = Number(args[1]);

    if (!Number.isInteger(id)) {
      console.log("Error: ID must be an integer.");
      break;
    }

    updateTask(id, args[2]);
    break;
  }

  case "delete": {
    const id = Number(args[1]);

    if (!Number.isInteger(id)) {
      console.log("Error: ID must be an integer.");
      break;
    }

    deleteTask(id);
    break;
  }

  case "mark-in-progress": {
    const id = Number(args[1]);

    if (!Number.isInteger(id)) {
      console.log("Error: ID must be an integer.");
      break;
    }

    updateStatus(id, "in-progress");
    break;
  }

  case "mark-done": {
    const id = Number(args[1]);

    if (!Number.isInteger(id)) {
      console.log("Error: ID must be an integer.");
      break;
    }

    updateStatus(id, "done");
    break;
  }

  case "list":
    listTasks(args[1]);
    break;

  default:
    console.log(`
Task Tracker CLI

Commands:

node app.js add "task description"

node app.js update <id> "new description"

node app.js delete <id>

node app.js mark-in-progress <id>

node app.js mark-done <id>

node app.js list

node app.js list todo

node app.js list in-progress

node app.js list done
`);
}