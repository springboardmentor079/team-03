import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, updateProject, deleteProject } from '../services/projectService';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States for Edit Modal
  const [editingProject, setEditingProject] = useState(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    category: '',
    status: ''
  });
  const [editError, setEditError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleEditClick = (project) => {
    setEditingProject(project);
    setEditFormData({
      title: project.title || '',
      description: project.description || '',
      startDate: project.startDate || '',
      endDate: project.endDate || '',
      budget: project.budget || '',
      category: project.category || '',
      status: project.status || 'Planning'
    });
    setEditError('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');

    if (!editFormData.title || !editFormData.category || !editFormData.startDate || !editFormData.budget) {
      setEditError('Please fill out all required fields.');
      return;
    }

    if (new Date(editFormData.endDate) < new Date(editFormData.startDate)) {
      setEditError('End Date cannot be earlier than Start Date.');
      return;
    }

    if (Number(editFormData.budget) <= 0) {
      setEditError('Budget must be a positive number.');
      return;
    }

    try {
      setIsUpdating(true);
      const updated = await updateProject(editingProject._id, editFormData);
      
      // Update state
      setProjects(projects.map(p => p._id === editingProject._id ? updated : p));
      setEditingProject(null);
      setIsUpdating(false);
    } catch (err) {
      setEditError('Failed to update project. Please try again.');
      setIsUpdating(false);
    }
  };

  // States for Delete Modal
  const [projectToDelete, setProjectToDelete] = useState(null);

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
  };

  const handleConfirmDelete = async () => {
    if (!projectToDelete) return;
    try {
      await deleteProject(projectToDelete._id);
      setProjects(projects.filter(p => p._id !== projectToDelete._id));
      setProjectToDelete(null);
    } catch (err) {
      alert('Failed to delete project. Please try again.');
    }
  };


  useEffect(() => {
    let isMounted = true;
    getProjects()
      .then((data) => {
        if (isMounted) {
          setProjects(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError('Failed to fetch projects. Please try again.');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Format budget to USD currency format
  const formatBudget = (value) => {
    if (value === undefined || value === null) return '$0';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  // Helper to format date strings into human-readable text
  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Dynamic category badge colors
  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Residential':
        return 'bg-primary-subtle text-primary border border-primary-subtle';
      case 'Commercial':
        return 'bg-success-subtle text-success border border-success-subtle';
      case 'Industrial':
        return 'bg-warning-subtle text-warning-emphasis border border-warning-subtle';
      case 'Infrastructure':
        return 'bg-info-subtle text-info-emphasis border border-info-subtle';
      case 'Government Projects':
        return 'bg-secondary-subtle text-secondary-emphasis border border-secondary-subtle';
      default:
        return 'bg-light text-dark border border-secondary';
    }
  };

  // Dynamic status badge styling
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'Planning':
        return { backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.3)' };
      case 'Active':
        return { backgroundColor: 'rgba(0, 201, 56, 0.1)', color: '#00c938', border: '1px solid rgba(0, 201, 56, 0.3)' };
      case 'Completed':
        return { backgroundColor: 'rgba(0, 201, 56, 0.2)', color: '#00b031', border: '1px solid rgba(0, 201, 56, 0.5)' };
      case 'Delayed':
        return { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' };
      default:
        return { backgroundColor: 'rgba(100, 116, 139, 0.1)', color: '#64748b', border: '1px solid rgba(100, 116, 139, 0.3)' };
    }
  };

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#f8fafc', minHeight: '85vh' }}>
      
      {/* Styles for dynamic card zoom hover effects */}
      <style>{`
        .project-card-hover {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          border: 1px solid #e2e8f0 !important;
          border-radius: 12px !important;
        }
        .project-card-hover:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 20px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.08) !important;
          border-color: #cbd5e1 !important;
        }
        .create-btn-hover {
          transition: all 0.2s ease;
        }
        .create-btn-hover:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 201, 56, 0.3);
        }
      `}</style>

      {/* Header Panel */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-4 pb-3 border-bottom">
        <div>
          <h1 className="h2 fw-bold text-dark mb-1">Project Portfolio</h1>
          <p className="text-secondary mb-0">Monitor, filter, and schedule infrastructure and construction projects.</p>
        </div>
        <Link 
          to="/dashboard/projects-new" 
          className="btn btn-success create-btn-hover fw-bold d-flex align-items-center gap-2 mt-3 mt-sm-0 px-4 py-2"
          style={{ backgroundColor: '#00c938', borderColor: '#00c938' }}
        >
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          Create New Project
        </Link>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="d-flex flex-column align-items-center justify-content-center py-5" style={{ minHeight: '40vh' }}>
          <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading projects...</span>
          </div>
          <p className="mt-3 text-secondary fw-semibold">Loading projects database...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger d-flex align-items-center" role="alert">
          <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
          </svg>
          <div>{error}</div>
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-5 bg-white rounded-3 shadow-sm border border-light-subtle">
          <svg className="text-muted mb-3" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 012.008 1.24l.885 1.77a2.25 2.25 0 002.007 1.24h1.98a2.25 2.25 0 002.007-1.24l.885-1.77a2.25 2.25 0 012.007-1.24h3.86m-18 0h18m-18 0V9a2.25 2.25 0 012.25-2.25h5.379a1.5 1.5 0 011.06.44L11.75 8.25h5a2.25 2.25 0 012.25 2.25v3M10.5 3.75h3"/>
          </svg>
          <h3 className="h5 text-dark fw-bold mb-2">No Projects Registered</h3>
          <p className="text-secondary max-w-sm mx-auto mb-4">It looks like there are no projects in the system. Click the button below to start one.</p>
          <Link to="/dashboard/projects-new" className="btn btn-outline-success btn-sm fw-bold">
            Add Your First Project
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {projects.map((project) => (
            <div className="col-12 col-md-6 col-lg-4" key={project._id}>
              <div className="card h-100 shadow-sm project-card-hover bg-white">
                <div className="card-body d-flex flex-column p-4">
                  
                  {/* Category & Status Badges */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <span className={`badge px-2.5 py-1.5 rounded-pill fw-semibold text-xs ${getCategoryBadgeClass(project.category)}`}>
                      {project.category}
                    </span>
                    <span 
                      className="badge px-2.5 py-1.5 rounded-pill fw-semibold text-xs" 
                      style={getStatusBadgeStyle(project.status)}
                    >
                      {project.status}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="card-title h5 fw-bold text-dark mb-2 text-truncate-2">
                    {project.title}
                  </h3>
                  <p className="card-text text-secondary text-sm flex-grow-1 mb-4" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '60px' }}>
                    {project.description}
                  </p>

                  <hr className="my-3 text-light-subtle" />

                  {/* Financials & Timeline */}
                  <div className="row g-3 mb-3">
                    
                    {/* Budget */}
                    <div className="col-6">
                      <span className="text-muted d-block text-xs text-uppercase fw-semibold tracking-wider mb-1">Budget</span>
                      <strong className="text-success fs-5 fw-bold">{formatBudget(project.budget)}</strong>
                    </div>

                    {/* Timeline */}
                    <div className="col-6 text-end">
                      <span className="text-muted d-block text-xs text-uppercase fw-semibold tracking-wider mb-1">Timeline</span>
                      <small className="text-dark fw-medium d-block">{formatDate(project.startDate)}</small>
                      <small className="text-secondary text-xs d-block">to {formatDate(project.endDate)}</small>
                    </div>

                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex justify-content-end gap-2 mt-auto pt-2 border-top flex-wrap">
                    <Link
                      to={`/dashboard/projects/${project._id}/workforce`}
                      className="btn btn-outline-success btn-sm d-flex align-items-center gap-1 px-3 py-1.5 fw-semibold"
                      style={{ fontSize: '13px' }}
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Workforce
                    </Link>
                    <Link
                      to={`/dashboard/projects/${project._id}/inventory`}
                      className="btn btn-outline-warning text-dark btn-sm d-flex align-items-center gap-1 px-3 py-1.5 fw-semibold"
                      style={{ fontSize: '13px' }}
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      Inventory
                    </Link>
                    <Link
                      to={`/dashboard/projects/${project._id}/milestones`}
                      className="btn btn-outline-info btn-sm d-flex align-items-center gap-1 px-3 py-1.5 fw-semibold"
                      style={{ fontSize: '13px' }}
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      Milestones
                    </Link>
                    <button 
                      onClick={() => handleEditClick(project)}
                      className="btn btn-outline-primary btn-sm d-flex align-items-center gap-1 px-3 py-1.5 fw-semibold"
                      style={{ fontSize: '13px' }}
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                      </svg>
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(project)}
                      className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 px-3 py-1.5 fw-semibold"
                      style={{ fontSize: '13px' }}
                    >
                      <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <div 
          className="modal show fade d-block animate-fade-in" 
          tabIndex="-1" 
          role="dialog"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <div className="modal-header border-bottom bg-light px-4 py-3 d-flex justify-content-between align-items-center">
                <h5 className="modal-title fw-bold text-dark mb-0">Edit Project: {editingProject.title}</h5>
                <button 
                  type="button" 
                  className="btn-close m-0" 
                  aria-label="Close"
                  onClick={() => setEditingProject(null)}
                ></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body p-4 bg-white">
                  {editError && (
                    <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
                      <svg className="bi flex-shrink-0 me-2" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                      </svg>
                      <div>{editError}</div>
                    </div>
                  )}

                  <div className="row g-4 mb-4">
                    <div className="col-12 col-md-7">
                      <label className="form-label fw-semibold text-dark">Project Title</label>
                      <input 
                        type="text" 
                        className="form-control text-dark bg-white" 
                        value={editFormData.title}
                        onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-5">
                      <label className="form-label fw-semibold text-dark">Category</label>
                      <select 
                        className="form-select text-dark bg-white" 
                        value={editFormData.category}
                        onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                        required
                      >
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Industrial">Industrial</option>
                        <option value="Infrastructure">Infrastructure</option>
                        <option value="Government Projects">Government Projects</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold text-dark">Description</label>
                    <textarea 
                      className="form-control text-dark bg-white" 
                      rows="4"
                      value={editFormData.description}
                      onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="row g-4 mb-4">
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-dark">Start Date</label>
                      <input 
                        type="date" 
                        className="form-control text-dark bg-white" 
                        value={editFormData.startDate}
                        onChange={(e) => setEditFormData({ ...editFormData, startDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-dark">Estimated End Date</label>
                      <input 
                        type="date" 
                        className="form-control text-dark bg-white" 
                        value={editFormData.endDate}
                        onChange={(e) => setEditFormData({ ...editFormData, endDate: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="row g-4">
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-dark">Capital Budget (USD)</label>
                      <input 
                        type="number" 
                        className="form-control text-dark bg-white" 
                        value={editFormData.budget}
                        onChange={(e) => setEditFormData({ ...editFormData, budget: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-dark">Status</label>
                      <select 
                        className="form-select text-dark bg-white" 
                        value={editFormData.status}
                        onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                        required
                      >
                        <option value="Planning">Planning</option>
                        <option value="Active">Active</option>
                        <option value="Completed">Completed</option>
                        <option value="Delayed">Delayed</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer bg-light border-top px-4 py-3 d-flex justify-content-end gap-3">
                  <button 
                    type="button" 
                    className="btn btn-light border px-4 py-2 text-secondary fw-semibold"
                    onClick={() => setEditingProject(null)}
                    disabled={isUpdating}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-success fw-bold text-white px-5 py-2"
                    disabled={isUpdating}
                    style={{ backgroundColor: '#00c938', borderColor: '#00c938' }}
                  >
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={!!projectToDelete}
        projectName={projectToDelete?.title || ''}
        onClose={() => setProjectToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ProjectList;
