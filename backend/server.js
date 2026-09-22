const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================

app.use(cors());
app.use(express.json());

// ==================== MONGOOSE SCHEMAS ====================

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    role: {
      type: String,
      default: "Developer",
    },
  },
  {
    timestamps: true,
  }
);

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "In Progress",
    },
    progress: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "Pending",
    },
    priority: {
      type: String,
      default: "Medium",
    },
    projectId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
const Project = mongoose.model("Project", projectSchema);
const Task = mongoose.model("Task", taskSchema);

// ==================== BASIC ROUTES ====================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Developer Productivity Dashboard API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "API is healthy",
    database: mongoose.connection.readyState === 1 ? "connected" : "not connected",
  });
});

// ======================================================
// USERS CRUD
// ======================================================

// GET ALL USERS
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
});

// GET SINGLE USER
app.get("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid user ID",
    });
  }
});

// CREATE USER
app.post("/api/users", async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
    }

    const user = await User.create({
      name,
      email,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create user",
    });
  }
});

// UPDATE USER
app.put("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update user",
    });
  }
});

// DELETE USER
app.delete("/api/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to delete user",
    });
  }
});

// ======================================================
// PROJECTS CRUD
// ======================================================

// GET ALL PROJECTS
app.get("/api/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects",
    });
  }
});

// GET SINGLE PROJECT
app.get("/api/projects/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid project ID",
    });
  }
});

// CREATE PROJECT
app.post("/api/projects", async (req, res) => {
  try {
    const { name, description, status, progress } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Project name is required",
      });
    }

    const project = await Project.create({
      name,
      description,
      status,
      progress,
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: project,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create project",
    });
  }
});

// UPDATE PROJECT
app.put("/api/projects/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: project,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update project",
    });
  }
});

// DELETE PROJECT
app.delete("/api/projects/:id", async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to delete project",
    });
  }
});

// ======================================================
// TASKS CRUD
// ======================================================

// GET ALL TASKS
app.get("/api/tasks", async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
});

// GET SINGLE TASK
app.get("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid task ID",
    });
  }
});

// CREATE TASK
app.post("/api/tasks", async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      priority,
      projectId,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    const task = await Task.create({
      title,
      description,
      status,
      priority,
      projectId,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create task",
    });
  }
});

// UPDATE TASK
app.put("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update task",
    });
  }
});

// DELETE TASK
app.delete("/api/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to delete task",
    });
  }
});

// ======================================================
// SMART TASK ASSISTANT
// ======================================================

app.post("/api/ai/suggest", (req, res) => {
  const { projectName, description } = req.body;

  if (!projectName || !description) {
    return res.status(400).json({
      success: false,
      message: "projectName and description are required",
    });
  }

  const text = description.toLowerCase();

  const suggestions = [];

  suggestions.push(`Set up the project structure for ${projectName}`);

  if (text.includes("frontend") || text.includes("react")) {
    suggestions.push("Create responsive React components");
    suggestions.push("Build dashboard and navigation UI");
  }

  if (text.includes("backend") || text.includes("api") || text.includes("node")) {
    suggestions.push("Create REST API endpoints");
    suggestions.push("Add request validation and error handling");
  }

  if (
    text.includes("database") ||
    text.includes("mongodb") ||
    text.includes("mysql")
  ) {
    suggestions.push("Create database schemas and models");
    suggestions.push("Implement CRUD operations");
  }

  if (text.includes("authentication") || text.includes("login")) {
    suggestions.push("Implement user authentication");
    suggestions.push("Add protected routes");
  }

  suggestions.push("Test the complete application");
  suggestions.push("Update project documentation");

  res.status(200).json({
    success: true,
    project: projectName,
    message: "Smart task suggestions generated successfully",
    tasks: suggestions.map((title, index) => ({
      id: index + 1,
      title,
      priority: index < 2 ? "High" : "Medium",
      status: "Suggested",
    })),
  });
});

// ======================================================
// SERVER START
// ======================================================

// Start server FIRST.
// MongoDB connection is optional, so the API can still start
// even if Atlas connection has a problem.

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Try MongoDB connection separately.

if (process.env.MONGODB_URI) {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log("MongoDB connected successfully");
    })
    .catch(() => {
      console.log("MongoDB unavailable - continuing without database");
    });
} else {
  console.log("MONGODB_URI not found - running without database");
}