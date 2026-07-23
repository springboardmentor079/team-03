import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import WorkforceTracker from '../components/WorkforceTracker';
import AttendanceTracker from '../components/AttendanceTracker';
import { dummyProjects } from '../mocks/projectData';
import { getProjects } from '../services/projectService';

const WorkforcePage = () => {
  const { id } = useParams();
  const [projects, setProjects] = useState(dummyProjects);
  const [selectedProjectId, setSelectedProjectId] = useState(id || 'proj-001');
  const [activeTab, setActiveTab] = useState('attendance');

  useEffect(() => {
    if (id) {
      setSelectedProjectId(id);
    }
  }, [id]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await getProjects();
      if (data && data.length > 0) {
        setProjects(data);
      }
    } catch (err) {
      console.error('Error loading projects:', err);
    }
  };

  const selectedProject = projects.find((p) => p._id === selectedProjectId);

  return (
    <div className="container py-4">
      {/* Header & Project Selector */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-1">
              <li className="breadcrumb-item">
                <Link to="/dashboard/projects-list" className="text-decoration-none">Projects</Link>
              </li>
              {selectedProject && (
                <li className="breadcrumb-item">
                  <Link to={`/dashboard/projects/${selectedProject._id}/milestones`} className="text-decoration-none">
                    {selectedProject.title}
                  </Link>
                </li>
              )}
              <li className="breadcrumb-item active" aria-current="page">
                Workforce & Attendance
              </li>
            </ol>
          </nav>
          <h2 className="fw-bold mb-0">Workforce & Attendance Management</h2>
          {selectedProject && (
            <p className="text-primary fw-semibold mb-0">Project: {selectedProject.title} ({selectedProject.category})</p>
          )}
        </div>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          <label className="fw-semibold small text-muted mb-0">Select Project:</label>
          <select
            className="form-select form-select-sm shadow-sm"
            style={{ width: 'auto', minWidth: '220px' }}
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title}
              </option>
            ))}
          </select>
          <Link to="/dashboard/projects-list" className="btn btn-outline-secondary btn-sm fw-semibold">
            &larr; Projects List
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4 border-bottom">
        <li className="nav-item">
          <button
            className={`nav-link fw-bold ${activeTab === 'attendance' ? 'active text-primary' : 'text-secondary'}`}
            onClick={() => setActiveTab('attendance')}
          >
            📋 Daily Attendance Tracking
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link fw-bold ${activeTab === 'timesheets' ? 'active text-primary' : 'text-secondary'}`}
            onClick={() => setActiveTab('timesheets')}
          >
            ⏱️ Timesheets & Labor Hours
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      {activeTab === 'attendance' ? (
        <AttendanceTracker projectId={selectedProjectId} />
      ) : (
        <WorkforceTracker projectId={selectedProjectId} />
      )}
    </div>
  );
};

export default WorkforcePage;
