import { useMemo, useState } from "react";
import "./App.css";

const initialProjects = [
  {
    id: 1,
    name: "Portfolio Website",
    description: "Personal portfolio website",
    progress: 80,
    status: "In Progress",
    tasks: [
      { id: 1, title: "Create homepage", status: "Completed" },
      { id: 2, title: "Add projects section", status: "Completed" },
      { id: 3, title: "Make website responsive", status: "In Progress" },
      { id: 4, title: "Deploy website", status: "Pending" },
    ],
  },
  {
    id: 2,
    name: "Task Management App",
    description: "Productivity and task management application",
    progress: 60,
    status: "In Progress",
    tasks: [
      { id: 5, title: "Design dashboard", status: "Completed" },
      { id: 6, title: "Create task API", status: "Completed" },
      { id: 7, title: "Connect database", status: "In Progress" },
      { id: 8, title: "Add authentication", status: "Pending" },
    ],
  },
  {
    id: 3,
    name: "Weather Application",
    description: "Weather information application",
    progress: 100,
    status: "Completed",
    tasks: [
      { id: 9, title: "Create weather UI", status: "Completed" },
      { id: 10, title: "Connect weather API", status: "Completed" },
      { id: 11, title: "Add search feature", status: "Completed" },
    ],
  },
];

function App() {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);

  const [aiProject, setAiProject] = useState("");
  const [aiDescription, setAiDescription] = useState("");
  const [aiTasks, setAiTasks] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState("");

  const allTasks = projects.flatMap((project) => project.tasks);

  const completedTasks = allTasks.filter(
    (task) => task.status === "Completed"
  );

  const inProgressTasks = allTasks.filter(
    (task) => task.status === "In Progress"
  );

  const productivity =
    allTasks.length > 0
      ? Math.round((completedTasks.length / allTasks.length) * 100)
      : 0;

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.description.toLowerCase().includes(search.toLowerCase());

      let matchesFilter = true;

      if (filter === "Completed") {
        matchesFilter = project.status === "Completed";
      }

      if (filter === "In Progress") {
        matchesFilter = project.status === "In Progress";
      }

      if (filter === "Pending") {
        matchesFilter = project.progress === 0;
      }

      return matchesSearch && matchesFilter;
    });
  }, [projects, search, filter]);

  const toggleTask = (projectId, taskId) => {
    setProjects((currentProjects) =>
      currentProjects.map((project) => {
        if (project.id !== projectId) {
          return project;
        }

        const updatedTasks = project.tasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                status:
                  task.status === "Completed" ? "In Progress" : "Completed",
              }
            : task
        );

        const completed = updatedTasks.filter(
          (task) => task.status === "Completed"
        ).length;

        const progress = Math.round(
          (completed / updatedTasks.length) * 100
        );

        return {
          ...project,
          tasks: updatedTasks,
          progress,
          status: progress === 100 ? "Completed" : "In Progress",
        };
      })
    );
  };

  const refreshDashboard = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 700);
  };

  const generateAITasks = async () => {
    if (!aiProject || !aiDescription) {
      setAiError("Please enter project name and description.");
      return;
    }

    setAiLoading(true);
    setAiError("");
    setAiTasks([]);

    try {
      const response = await fetch("http://localhost:5000/api/ai/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName: aiProject,
          description: aiDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to generate tasks");
      }

      setAiTasks(data.tasks || []);
    } catch (error) {
      setAiError(
        "Unable to connect with backend. Make sure the backend server is running."
      );
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="app">
      {/* ================= SIDEBAR ================= */}

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">D</div>

          <div>
            <h2>DevFlow</h2>
            <span>Productivity Hub</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item active">
            <span>▦</span>
            Dashboard
          </div>

          <div className="nav-item">
            <span>◫</span>
            Projects
          </div>

          <div className="nav-item">
            <span>✓</span>
            Tasks
          </div>

          <div className="nav-item">
            <span>◒</span>
            Analytics
          </div>

          <div className="nav-item">
            <span>⚙</span>
            Settings
          </div>
        </nav>

        <div className="weekly-goal">
          <p>Weekly Goal</p>

          <h3>{completedTasks.length}/10 Tasks</h3>

          <div className="goal-bar">
            <div
              className="goal-progress"
              style={{
                width: `${Math.min(completedTasks.length * 10, 100)}%`,
              }}
            ></div>
          </div>

          <small>Keep going!</small>
        </div>

        <div className="profile">
          <div className="profile-avatar">DK</div>

          <div>
            <strong>Developer</strong>
            <small>Full Stack Intern</small>
          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="date">Tuesday, September 22, 2026</p>
            <h1>Good Morning, Developer 👋</h1>
            <p className="subtitle">
              Here's what's happening with your projects today.
            </p>
          </div>

          <button className="refresh-btn" onClick={refreshDashboard}>
            ↻ Refresh
          </button>
        </header>

        {/* ================= STATS ================= */}

        <section className="stats-grid">
          <div className="stat-card">
            <span className="stat-icon">▣</span>
            <div>
              <p>Total Projects</p>
              <h2>{projects.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">✓</span>
            <div>
              <p>Completed Tasks</p>
              <h2>{completedTasks.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">◔</span>
            <div>
              <p>In Progress</p>
              <h2>{inProgressTasks.length}</h2>
            </div>
          </div>

          <div className="stat-card">
            <span className="stat-icon">↗</span>
            <div>
              <p>Productivity</p>
              <h2>{productivity}%</h2>
            </div>
          </div>
        </section>

        {/* ================= SEARCH ================= */}

        <section className="toolbar">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="filter-buttons">
            {["All", "In Progress", "Completed", "Pending"].map((item) => (
              <button
                key={item}
                className={filter === item ? "filter-active" : ""}
                onClick={() => setFilter(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* ================= PROJECTS ================= */}

        <section className="section-header">
          <div>
            <h2>Your Projects</h2>
            <p>Track your current development work.</p>
          </div>
        </section>

        {loading ? (
          <div className="loading-state">Loading dashboard...</div>
        ) : filteredProjects.length === 0 ? (
          <div className="empty-state">
            <h3>No projects found</h3>
            <p>Try another search or filter.</p>
          </div>
        ) : (
          <section className="projects-grid">
            {filteredProjects.map((project) => (
              <div className="project-card" key={project.id}>
                <div className="project-card-header">
                  <div>
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                  </div>

                  <span
                    className={
                      project.status === "Completed"
                        ? "status completed"
                        : "status progress"
                    }
                  >
                    {project.status}
                  </span>
                </div>

                <div className="progress-info">
                  <span>Progress</span>
                  <strong>{project.progress}%</strong>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>

                <div className="task-list">
                  {project.tasks.map((task) => (
                    <div className="task-row" key={task.id}>
                      <button
                        className={
                          task.status === "Completed"
                            ? "task-check checked"
                            : "task-check"
                        }
                        onClick={() => toggleTask(project.id, task.id)}
                      >
                        {task.status === "Completed" ? "✓" : ""}
                      </button>

                      <span
                        className={
                          task.status === "Completed"
                            ? "task-title done"
                            : "task-title"
                        }
                      >
                        {task.title}
                      </span>

                      <span className="task-status">
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>

                <button className="view-project">
                  View Project →
                </button>
              </div>
            ))}
          </section>
        )}

        {/* =================================================
            AI TASK ASSISTANT
        ================================================= */}

        <section
          className="ai-section"
          style={{
            marginTop: "32px",
            padding: "24px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
            border: "1px solid #e2e8f0",
          }}
        >
          <div style={{ marginBottom: "20px" }}>
            <h2 style={{ marginBottom: "6px" }}>
              🤖 Smart Task Assistant
            </h2>

            <p style={{ margin: 0, color: "#64748b" }}>
              Generate useful project tasks from your project description.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
            }}
          >
            <input
              type="text"
              placeholder="Project name"
              value={aiProject}
              onChange={(e) => setAiProject(e.target.value)}
              style={{
                padding: "13px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                fontSize: "14px",
              }}
            />

            <input
              type="text"
              placeholder="Example: React frontend, Node.js backend and database"
              value={aiDescription}
              onChange={(e) => setAiDescription(e.target.value)}
              style={{
                padding: "13px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                fontSize: "14px",
              }}
            />
          </div>

          <button
            onClick={generateAITasks}
            disabled={aiLoading}
            style={{
              marginTop: "14px",
              padding: "12px 20px",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "600",
              background: "#4f46e5",
              color: "white",
            }}
          >
            {aiLoading ? "Generating..." : "✨ Generate Tasks"}
          </button>

          {aiError && (
            <p
              style={{
                color: "#dc2626",
                marginTop: "14px",
              }}
            >
              {aiError}
            </p>
          )}

          {aiTasks.length > 0 && (
            <div style={{ marginTop: "22px" }}>
              <h3 style={{ marginBottom: "12px" }}>
                Suggested Tasks
              </h3>

              <div
                style={{
                  display: "grid",
                  gap: "10px",
                }}
              >
                {aiTasks.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "14px",
                      background: "white",
                      border: "1px solid #e2e8f0",
                      borderRadius: "10px",
                    }}
                  >
                    <span>
                      <strong>{task.id}. </strong>
                      {task.title}
                    </span>

                    <span
                      style={{
                        fontSize: "12px",
                        padding: "5px 9px",
                        borderRadius: "20px",
                        background:
                          task.priority === "High"
                            ? "#fee2e2"
                            : "#fef3c7",
                        color:
                          task.priority === "High"
                            ? "#b91c1c"
                            : "#92400e",
                      }}
                    >
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <footer
          style={{
            textAlign: "center",
            padding: "30px 0 10px",
            color: "#64748b",
            fontSize: "13px",
          }}
        >
          DevFlow Productivity Hub • Innovation Hacks Full Stack Development
          Internship
        </footer>
      </main>
    </div>
  );
}

export default App;