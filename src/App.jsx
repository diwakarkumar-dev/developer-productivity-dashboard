import { useMemo, useState } from "react";
import "./App.css";

const initialProjects = [
  {
    id: 1,
    name: "Portfolio Website",
    description: "Personal developer portfolio and case studies.",
    progress: 78,
    tasks: [
      { id: 1, title: "Design homepage", status: "done" },
      { id: 2, title: "Build projects section", status: "done" },
      { id: 3, title: "Add responsive layout", status: "in-progress" },
      { id: 4, title: "Deploy website", status: "todo" },
    ],
  },
  {
    id: 2,
    name: "Task Management App",
    description: "A productivity application for managing daily tasks.",
    progress: 52,
    tasks: [
      { id: 5, title: "Create dashboard UI", status: "done" },
      { id: 6, title: "Build task cards", status: "in-progress" },
      { id: 7, title: "Add filters", status: "todo" },
    ],
  },
  {
    id: 3,
    name: "Weather Application",
    description: "Weather tracking application with API integration.",
    progress: 30,
    tasks: [
      { id: 8, title: "Create search interface", status: "done" },
      { id: 9, title: "Connect weather API", status: "in-progress" },
      { id: 10, title: "Add forecast section", status: "todo" },
    ],
  },
];

function App() {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);

  const allTasks = projects.flatMap((project) => project.tasks);

  const completedTasks = allTasks.filter(
    (task) => task.status === "done"
  ).length;

  const inProgressTasks = allTasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  const filteredProjects = useMemo(() => {
    return projects
      .map((project) => ({
        ...project,
        tasks: project.tasks.filter((task) => {
          const matchesSearch =
            task.title.toLowerCase().includes(search.toLowerCase()) ||
            project.name.toLowerCase().includes(search.toLowerCase());

          const matchesFilter =
            filter === "all" || task.status === filter;

          return matchesSearch && matchesFilter;
        }),
      }))
      .filter(
        (project) =>
          project.tasks.length > 0 ||
          project.name.toLowerCase().includes(search.toLowerCase())
      );
  }, [projects, search, filter]);

  const toggleTask = (projectId, taskId) => {
    setProjects((currentProjects) =>
      currentProjects.map((project) => {
        if (project.id !== projectId) return project;

        const updatedTasks = project.tasks.map((task) => {
          if (task.id !== taskId) return task;

          return {
            ...task,
            status: task.status === "done" ? "todo" : "done",
          };
        });

        const completed = updatedTasks.filter(
          (task) => task.status === "done"
        ).length;

        const progress = Math.round(
          (completed / updatedTasks.length) * 100
        );

        return {
          ...project,
          tasks: updatedTasks,
          progress,
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

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">⚡</div>
          <div>
            <h2>DevFlow</h2>
            <span>Productivity Hub</span>
          </div>
        </div>

        <nav className="navigation">
          <a className="nav-item active" href="#dashboard">
            <span>▦</span>
            Dashboard
          </a>

          <a className="nav-item" href="#projects">
            <span>◈</span>
            Projects
          </a>

          <a className="nav-item" href="#tasks">
            <span>✓</span>
            Tasks
          </a>

          <a className="nav-item" href="#analytics">
            <span>◒</span>
            Analytics
          </a>

          <a className="nav-item" href="#settings">
            <span>⚙</span>
            Settings
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="mini-card">
            <strong>Weekly Goal</strong>
            <p>Keep your momentum going!</p>

            <div className="mini-progress">
              <span style={{ width: "72%" }}></span>
            </div>

            <small>72% completed</small>
          </div>

          <div className="user-profile">
            <div className="avatar">DK</div>
            <div>
              <strong>Developer</strong>
              <span>Frontend Developer</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">MONDAY, SEPTEMBER 21</p>
            <h1>Good evening, Developer 👋</h1>
            <p className="subtitle">
              Here's what's happening with your projects today.
            </p>
          </div>

          <button className="refresh-btn" onClick={refreshDashboard}>
            ↻ Refresh
          </button>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon purple">◈</div>
            <div>
              <span>Total Projects</span>
              <strong>{projects.length}</strong>
              <small>Active projects</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">✓</div>
            <div>
              <span>Completed Tasks</span>
              <strong>{completedTasks}</strong>
              <small>Great progress!</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">◷</div>
            <div>
              <span>In Progress</span>
              <strong>{inProgressTasks}</strong>
              <small>Keep going</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon blue">↗</div>
            <div>
              <span>Productivity</span>
              <strong>84%</strong>
              <small>↑ 12% this week</small>
            </div>
          </div>
        </section>

        <section className="toolbar" id="tasks">
          <div className="search-box">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search projects or tasks..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <div className="filters">
            {["all", "todo", "in-progress", "done"].map((item) => (
              <button
                key={item}
                className={filter === item ? "filter active-filter" : "filter"}
                onClick={() => setFilter(item)}
              >
                {item === "all"
                  ? "All"
                  : item === "in-progress"
                  ? "In Progress"
                  : item === "todo"
                  ? "To Do"
                  : "Completed"}
              </button>
            ))}
          </div>
        </section>

        <section className="section-heading" id="projects">
          <div>
            <h2>My Projects</h2>
            <p>Track your current development work.</p>
          </div>

          <button className="add-btn">+ New Project</button>
        </section>

        {loading ? (
          <div className="state-card">
            <div className="spinner"></div>
            <h3>Loading dashboard...</h3>
            <p>Getting your latest project information.</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="state-card">
            <div className="empty-icon">⌕</div>
            <h3>No projects found</h3>
            <p>Try changing your search or filter.</p>
          </div>
        ) : (
          <section className="projects-grid">
            {filteredProjects.map((project) => (
              <article className="project-card" key={project.id}>
                <div className="project-header">
                  <div className="project-symbol">◈</div>

                  <button className="more-btn">•••</button>
                </div>

                <h3>{project.name}</h3>
                <p className="project-description">
                  {project.description}
                </p>

                <div className="progress-row">
                  <span>Progress</span>
                  <strong>{project.progress}%</strong>
                </div>

                <div className="progress-bar">
                  <span style={{ width: `${project.progress}%` }}></span>
                </div>

                <div className="task-list">
                  {project.tasks.map((task) => (
                    <div className="task-row" key={task.id}>
                      <button
                        className={
                          task.status === "done"
                            ? "task-check completed"
                            : "task-check"
                        }
                        onClick={() => toggleTask(project.id, task.id)}
                      >
                        {task.status === "done" ? "✓" : ""}
                      </button>

                      <span
                        className={
                          task.status === "done"
                            ? "task-title completed-text"
                            : "task-title"
                        }
                      >
                        {task.title}
                      </span>

                      <span className={`status ${task.status}`}>
                        {task.status === "in-progress"
                          ? "Progress"
                          : task.status === "done"
                          ? "Done"
                          : "To Do"}
                      </span>
                    </div>
                  ))}
                </div>

                <button className="view-btn">View project →</button>
              </article>
            ))}
          </section>
        )}

        <footer>
          <span>DevFlow Dashboard</span>
          <span>Built for Developer Productivity</span>
        </footer>
      </main>
    </div>
  );
}

export default App;