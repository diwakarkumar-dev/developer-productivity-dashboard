const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== DATA ====================

let users = [
  {
    id: 1,
    name: "Diwakar Kumar",
    email: "diwakar@example.com"
  }
];

let projects = [
  {
    id: 1,
    name: "Portfolio Website",
    description: "Personal portfolio project",
    status: "In Progress",
    userId: 1
  },
  {
    id: 2,
    name: "Task Management App",
    description: "Productivity task management application",
    status: "Completed",
    userId: 1
  }
];

let tasks = [
  {
    id: 1,
    title: "Design homepage",
    description: "Create the main dashboard homepage",
    status: "Completed",
    priority: "High",
    projectId: 1
  },
  {
    id: 2,
    title: "Build REST API",
    description: "Create users, projects and tasks APIs",
    status: "In Progress",
    priority: "High",
    projectId: 1
  },
  {
    id: 3,
    title: "Connect database",
    description: "Add persistent database storage",
    status: "Pending",
    priority: "Medium",
    projectId: 2
  }
];

// ==================== MIDDLEWARE ====================

app.use(cors());
app.use(express.json());

// ==================== USERS API ====================

// GET all users
app.get("/api/users", (req, res) => {
  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});

// POST user
app.post("/api/users", (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: "Name and email are required"
    });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    message: "User created successfully",
    data: newUser
  });
});

// GET single user
app.get("/api/users/:id", (req, res) => {
  const user = users.find(
    (u) => u.id === Number(req.params.id)
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  res.status(200).json({
    success: true,
    data: user
  });
});

// PUT user
app.put("/api/users/:id", (req, res) => {
  const user = users.find(
    (u) => u.id === Number(req.params.id)
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: "Name and email are required"
    });
  }

  user.name = name;
  user.email = email;

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: user
  });
});

// DELETE user
app.delete("/api/users/:id", (req, res) => {
  const index = users.findIndex(
    (u) => u.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  const deletedUser = users.splice(index, 1);

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
    data: deletedUser[0]
  });
});

// ==================== TASKS API ====================

// GET all tasks
app.get("/api/tasks", (req, res) => {
  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

// GET single task
app.get("/api/tasks/:id", (req, res) => {
  const task = tasks.find(
    (t) => t.id === Number(req.params.id)
  );

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  res.status(200).json({
    success: true,
    data: task
  });
});

// POST task
app.post("/api/tasks", (req, res) => {
  const {
    title,
    description,
    status,
    priority,
    projectId
  } = req.body;

  if (!title || !description || !status || !priority || !projectId) {
    return res.status(400).json({
      success: false,
      message:
        "Title, description, status, priority and projectId are required"
    });
  }

  const newTask = {
    id: tasks.length + 1,
    title,
    description,
    status,
    priority,
    projectId
  };

  tasks.push(newTask);

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: newTask
  });
});

// PUT task
app.put("/api/tasks/:id", (req, res) => {
  const task = tasks.find(
    (t) => t.id === Number(req.params.id)
  );

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  const {
    title,
    description,
    status,
    priority,
    projectId
  } = req.body;

  if (!title || !description || !status || !priority || !projectId) {
    return res.status(400).json({
      success: false,
      message:
        "Title, description, status, priority and projectId are required"
    });
  }

  task.title = title;
  task.description = description;
  task.status = status;
  task.priority = priority;
  task.projectId = projectId;

  res.status(200).json({
    success: true,
    message: "Task updated successfully",
    data: task
  });
});

// DELETE task
app.delete("/api/tasks/:id", (req, res) => {
  const index = tasks.findIndex(
    (t) => t.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Task not found"
    });
  }

  const deletedTask = tasks.splice(index, 1);

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
    data: deletedTask[0]
  });
});

// ==================== PROJECTS API ====================

// GET all projects
app.get("/api/projects", (req, res) => {
  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects
  });
});

// GET single project
app.get("/api/projects/:id", (req, res) => {
  const project = projects.find(
    (p) => p.id === Number(req.params.id)
  );

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found"
    });
  }

  res.status(200).json({
    success: true,
    data: project
  });
});

// POST project
app.post("/api/projects", (req, res) => {
  const { name, description, status, userId } = req.body;

  if (!name || !description || !status || !userId) {
    return res.status(400).json({
      success: false,
      message: "Name, description, status and userId are required"
    });
  }

  const newProject = {
    id: projects.length + 1,
    name,
    description,
    status,
    userId
  };

  projects.push(newProject);

  res.status(201).json({
    success: true,
    message: "Project created successfully",
    data: newProject
  });
});

// PUT project
app.put("/api/projects/:id", (req, res) => {
  const project = projects.find(
    (p) => p.id === Number(req.params.id)
  );

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found"
    });
  }

  const { name, description, status, userId } = req.body;

  if (!name || !description || !status || !userId) {
    return res.status(400).json({
      success: false,
      message: "Name, description, status and userId are required"
    });
  }

  project.name = name;
  project.description = description;
  project.status = status;
  project.userId = userId;

  res.status(200).json({
    success: true,
    message: "Project updated successfully",
    data: project
  });
});

// DELETE project
app.delete("/api/projects/:id", (req, res) => {
  const index = projects.findIndex(
    (p) => p.id === Number(req.params.id)
  );

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Project not found"
    });
  }

  const deletedProject = projects.splice(index, 1);

  res.status(200).json({
    success: true,
    message: "Project deleted successfully",
    data: deletedProject[0]
  });
});

// ==================== GENERAL ====================

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Developer Productivity API is running"
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy"
  });
});

// ==================== SERVER ====================

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

console.log("Server process is still running...");