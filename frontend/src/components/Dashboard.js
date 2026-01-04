import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import {
  Code2,
  Plus,
  LogOut,
  MessageSquare,
  Folder,
  Trash2,
  Globe,
  Smartphone,
  Terminal,
  Package
} from 'lucide-react';
import './Dashboard.css';

function Dashboard() {
  const { user, logout, API_URL } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    projectType: 'other',
    language: 'javascript'
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_URL}/projects`);
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/projects`, newProject);
      setNewProject({
        name: '',
        description: '',
        projectType: 'other',
        language: 'javascript'
      });
      setShowNewProject(false);
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`${API_URL}/projects/${id}`);
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const getProjectIcon = (type) => {
    const icons = {
      'web-static': <Globe size={24} />,
      'web-dynamic': <Globe size={24} />,
      'web-complex': <Globe size={24} />,
      'android-app': <Smartphone size={24} />,
      'ios-app': <Smartphone size={24} />,
      'cli-tool': <Terminal size={24} />,
      'library': <Package size={24} />,
      'other': <Code2 size={24} />
    };
    return icons[type] || icons['other'];
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <Code2 size={32} />
            <h1>AI Coding Assistant</h1>
          </div>
          <div className="header-right">
            <span>Welcome, {user?.username}!</span>
            <button onClick={() => navigate('/chat')} className="btn-new-chat">
              <MessageSquare size={20} />
              New Chat
            </button>
            <button onClick={logout} className="btn-logout">
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="container">
          <div className="projects-header">
            <h2>
              <Folder size={28} />
              Your Projects
            </h2>
            <button onClick={() => setShowNewProject(!showNewProject)} className="btn-primary">
              <Plus size={20} />
              New Project
            </button>
          </div>

          {showNewProject && (
            <div className="new-project-form">
              <h3>Create New Project</h3>
              <form onSubmit={handleCreateProject}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Project Name</label>
                    <input
                      type="text"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      placeholder="My Awesome Project"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Primary Language</label>
                    <select
                      value={newProject.language}
                      onChange={(e) => setNewProject({ ...newProject, language: e.target.value })}
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="c">C</option>
                      <option value="cpp">C++</option>
                      <option value="csharp">C#</option>
                      <option value="go">Go</option>
                      <option value="rust">Rust</option>
                      <option value="php">PHP</option>
                      <option value="ruby">Ruby</option>
                      <option value="swift">Swift</option>
                      <option value="kotlin">Kotlin</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Project Type</label>
                  <select
                    value={newProject.projectType}
                    onChange={(e) => setNewProject({ ...newProject, projectType: e.target.value })}
                  >
                    <option value="web-static">Static Website</option>
                    <option value="web-dynamic">Dynamic Web App</option>
                    <option value="web-complex">Complex Web App (E-commerce, etc.)</option>
                    <option value="android-app">Android App</option>
                    <option value="ios-app">iOS App</option>
                    <option value="desktop-app">Desktop Application</option>
                    <option value="cli-tool">CLI Tool</option>
                    <option value="library">Library/Package</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Description (optional)</label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Describe your project..."
                    rows={3}
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">Create Project</button>
                  <button
                    type="button"
                    onClick={() => setShowNewProject(false)}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="projects-grid">
            {projects.length === 0 ? (
              <div className="empty-state">
                <Code2 size={64} />
                <h3>No projects yet</h3>
                <p>Create your first project or start a new chat to begin coding!</p>
                <button onClick={() => setShowNewProject(true)} className="btn-primary">
                  <Plus size={20} />
                  Create Project
                </button>
              </div>
            ) : (
              projects.map((project) => (
                <div key={project._id} className="project-card">
                  <div className="project-icon">
                    {getProjectIcon(project.projectType)}
                  </div>
                  <div className="project-info">
                    <h3>{project.name}</h3>
                    <p>{project.description || 'No description'}</p>
                    <div className="project-meta">
                      <span className="badge">{project.language}</span>
                      <span className="badge">{project.projectType}</span>
                    </div>
                  </div>
                  <div className="project-actions">
                    <button
                      onClick={() => navigate(`/chat/${project._id}`)}
                      className="btn-icon"
                      title="Open in chat"
                    >
                      <MessageSquare size={20} />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project._id)}
                      className="btn-icon btn-danger"
                      title="Delete project"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
