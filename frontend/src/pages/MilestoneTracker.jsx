import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getMilestonesByProjectId,
  updateMilestoneStatus,
  createMilestone,
  deleteMilestone
} from '../services/milestoneService';
import { getProjects } from '../services/projectService';
import { dummyProjects } from '../mocks/projectData';
import StatusDashboard from '../components/StatusDashboard';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import ResourceAllocation from '../components/ResourceAllocation';
import FinancialDashboard from '../components/FinancialDashboard';
import InventoryManager from '../components/InventoryManager';
import WorkforceTracker from '../components/WorkforceTracker';

const MilestoneTracker = () => {
  const { id } = useParams();
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectBudget, setProjectBudget] = useState(500000);

  // Modal State for Adding New Milestone
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Foundation',
    targetDate: '',
    completionStatus: 'Pending'
  });
  const [formError, setFormError] = useState('');

  // Delete Confirmation Modal State
  const [milestoneToDelete, setMilestoneToDelete] = useState(null);

  useEffect(() => {
    fetchMilestones();
  }, [id]);

  const fetchMilestones = async () => {
    setLoading(true);
    try {
      const data = await getMilestonesByProjectId(id);
      setMilestones(data);

      const allProjects = await getProjects();
      const proj = allProjects.find((p) => p._id === id) || dummyProjects.find((p) => p._id === id);
      if (proj) {
        setProjectTitle(proj.title);
        if (proj.budget) setProjectBudget(proj.budget);
      } else {
        setProjectTitle(`Project ${id}`);
      }
    } catch (err) {
      console.error('Error fetching milestones:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (milestoneId, newStatus) => {
    setUpdatingId(milestoneId);
    try {
      const updated = await updateMilestoneStatus(milestoneId, newStatus);
      setMilestones((prev) =>
        prev.map((m) => (m._id === milestoneId ? updated : m))
      );
    } catch (err) {
      console.error('Error updating milestone status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!milestoneToDelete) return;
    setUpdatingId(milestoneToDelete._id);
    try {
      await deleteMilestone(milestoneToDelete._id);
      setMilestones((prev) => prev.filter((m) => m._id !== milestoneToDelete._id));
      setMilestoneToDelete(null);
    } catch (err) {
      console.error('Error deleting milestone:', err);
      alert('Failed to delete milestone.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title || !formData.category || !formData.targetDate) {
      setFormError('Please fill out all required fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      const created = await createMilestone({
        ...formData,
        projectId: id
      });

      setMilestones((prev) => [...prev, created]);
      setShowAddModal(false);
      setFormData({
        title: '',
        description: '',
        category: 'Foundation',
        targetDate: '',
        completionStatus: 'Pending'
      });
    } catch (err) {
      setFormError('Failed to add milestone. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Chronologically sort milestones by targetDate
  const sortedMilestones = [...milestones].sort(
    (a, b) => new Date(a.targetDate) - new Date(b.targetDate)
  );

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-success text-white';
      case 'In Progress':
        return 'bg-warning text-dark';
      case 'Pending':
        return 'bg-secondary text-white';
      default:
        return 'bg-light text-dark';
    }
  };

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case 'Foundation':
        return 'bg-primary text-white';
      case 'Structural Work':
        return 'bg-dark text-white';
      case 'Electrical Work':
        return 'bg-info text-dark';
      case 'Plumbing Work':
        return 'bg-primary text-white';
      case 'Finishing Work':
        return 'bg-secondary text-white';
      case 'Inspection Work':
        return 'bg-danger text-white';
      default:
        return 'bg-light text-dark';
    }
  };

  return (
    <div className="container py-4">
      {/* Header Navigation */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-1">
              <li className="breadcrumb-item">
                <Link to="/dashboard/projects-list" className="text-decoration-none">Projects</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Milestone Tracker
              </li>
            </ol>
          </nav>
          <h2 className="fw-bold mb-0">Milestone Tracker</h2>
          {projectTitle && <p className="text-muted mb-0">{projectTitle}</p>}
        </div>

        <div className="d-flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary fw-semibold d-flex align-items-center gap-2"
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            Add Milestone
          </button>
          <Link to="/dashboard/projects-list" className="btn btn-outline-secondary">
            &larr; Back to Projects
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading milestones...</span>
          </div>
          <p className="mt-2 text-muted">Loading milestones...</p>
        </div>
      ) : (
        <>
          {/* Status Dashboard Component at top */}
          <StatusDashboard milestones={milestones} />

          {/* Chronological Timeline / Stacked Cards View */}
          <div className="card shadow-sm border-0 bg-white rounded-3 p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-0">Milestone Timeline</h4>
              <div className="d-flex align-items-center gap-2">
                <span className="badge bg-light text-dark border">
                  {sortedMilestones.length} Milestones (Sorted by Target Date)
                </span>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn btn-sm btn-outline-primary"
                >
                  + Add Milestone
                </button>
              </div>
            </div>

            {sortedMilestones.length === 0 ? (
              <div className="text-center py-5 text-muted bg-light rounded-3 p-4 border border-dashed">
                <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" className="mb-3 text-secondary">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h5 className="fw-bold text-dark mb-1">No Milestones Found</h5>
                <p className="small text-muted mb-3">Get started by creating your first milestone for this project.</p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="btn btn-primary btn-sm px-4 fw-semibold"
                >
                  + Create First Milestone
                </button>
              </div>
            ) : (
              <div className="timeline-container position-relative">
                {/* Timeline vertical bar */}
                <div
                  className="position-absolute h-100 border-start border-2 border-primary"
                  style={{ left: '20px', top: '0', zIndex: 1 }}
                ></div>

                <div className="d-flex flex-column gap-4">
                  {sortedMilestones.map((milestone, index) => {
                    const formattedDate = new Date(milestone.targetDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    });

                    return (
                      <div key={milestone._id} className="position-relative ps-5">
                        {/* Timeline Step Node Indicator */}
                        <div
                          className={`position-absolute rounded-circle d-flex align-items-center justify-content-center border border-3 border-white shadow-sm ${
                            milestone.completionStatus === 'Completed'
                              ? 'bg-success text-white'
                              : milestone.completionStatus === 'In Progress'
                              ? 'bg-warning text-dark'
                              : 'bg-secondary text-white'
                          }`}
                          style={{
                            left: '8px',
                            top: '16px',
                            width: '26px',
                            height: '26px',
                            zIndex: 2,
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}
                        >
                          {index + 1}
                        </div>

                        {/* Milestone Card */}
                        <div className="card border-0 bg-light shadow-sm rounded-3">
                          <div className="card-body p-3 p-md-4">
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-2 mb-2">
                              <div>
                                <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                                  <span className={`badge ${getCategoryBadgeClass(milestone.category)}`}>
                                    {milestone.category}
                                  </span>
                                  <span className={`badge ${getStatusBadgeClass(milestone.completionStatus)}`}>
                                    {milestone.completionStatus}
                                  </span>
                                </div>
                                <h5 className="fw-bold mb-1 text-dark">{milestone.title}</h5>
                              </div>
                              <div className="d-flex align-items-center gap-3">
                                <div className="text-md-end">
                                  <span className="text-muted small d-block">Target Date</span>
                                  <span className="fw-semibold text-dark">{formattedDate}</span>
                                </div>
                                <button
                                  onClick={() => setMilestoneToDelete(milestone)}
                                  className="btn btn-link text-danger p-0 border-0 ms-2"
                                  title="Delete Milestone"
                                  disabled={updatingId === milestone._id}
                                >
                                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>

                            <p className="text-muted mb-3 small">{milestone.description}</p>

                            {/* Dropdown / Button mechanism to update status */}
                            <div className="d-flex align-items-center justify-content-between pt-3 border-top">
                              <span className="small text-muted fw-medium">Update Completion Status:</span>
                              <div className="d-flex gap-2 align-items-center">
                                {updatingId === milestone._id && (
                                  <span className="spinner-border spinner-border-sm text-primary me-1" role="status" />
                                )}
                                
                                {/* Dropdown Select Mechanism */}
                                <select
                                  className="form-select form-select-sm"
                                  style={{ width: 'auto', minWidth: '130px' }}
                                  value={milestone.completionStatus}
                                  onChange={(e) => handleStatusChange(milestone._id, e.target.value)}
                                  disabled={updatingId === milestone._id}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="In Progress">In Progress</option>
                                  <option value="Completed">Completed</option>
                                </select>

                                {/* Quick Action Button Group */}
                                <div className="btn-group btn-group-sm d-none d-sm-inline-flex" role="group">
                                  <button
                                    type="button"
                                    className={`btn ${milestone.completionStatus === 'Pending' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                                    onClick={() => handleStatusChange(milestone._id, 'Pending')}
                                    disabled={updatingId === milestone._id}
                                  >
                                    Pending
                                  </button>
                                  <button
                                    type="button"
                                    className={`btn ${milestone.completionStatus === 'In Progress' ? 'btn-warning' : 'btn-outline-warning text-dark'}`}
                                    onClick={() => handleStatusChange(milestone._id, 'In Progress')}
                                    disabled={updatingId === milestone._id}
                                  >
                                    In Progress
                                  </button>
                                  <button
                                    type="button"
                                    className={`btn ${milestone.completionStatus === 'Completed' ? 'btn-success' : 'btn-outline-success'}`}
                                    onClick={() => handleStatusChange(milestone._id, 'Completed')}
                                    disabled={updatingId === milestone._id}
                                  >
                                    Completed
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Day 3 Resource Allocation Component */}
          <ResourceAllocation projectId={id} />

          {/* Day 4 Financial Dashboard Component */}
          <FinancialDashboard projectId={id} totalBudget={projectBudget} />

          {/* Day 5 Inventory Manager Component */}
          <InventoryManager projectId={id} />

          {/* Workforce Management Component */}
          <WorkforceTracker projectId={id} />
        </>
      )}

      {/* Add New Milestone Modal */}
      {showAddModal && (
        <div
          className="modal show fade d-block animate-fade-in"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
            <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <div className="modal-header border-bottom bg-light px-4 py-3 d-flex justify-content-between align-items-center">
                <h5 className="modal-title fw-bold text-dark mb-0">Add New Milestone</h5>
                <button
                  type="button"
                  className="btn-close m-0"
                  aria-label="Close"
                  onClick={() => setShowAddModal(false)}
                ></button>
              </div>

              <form onSubmit={handleAddSubmit}>
                <div className="modal-body p-4 bg-white">
                  {formError && (
                    <div className="alert alert-danger mb-4" role="alert">
                      {formError}
                    </div>
                  )}

                  <div className="row g-4 mb-3">
                    <div className="col-12 col-md-7">
                      <label className="form-label fw-semibold text-dark">Milestone Title *</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g. Foundation Concrete Pouring"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-5">
                      <label className="form-label fw-semibold text-dark">Category *</label>
                      <select
                        className="form-select"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        required
                      >
                        <option value="Foundation">Foundation</option>
                        <option value="Structural Work">Structural Work</option>
                        <option value="Electrical Work">Electrical Work</option>
                        <option value="Plumbing Work">Plumbing Work</option>
                        <option value="Finishing Work">Finishing Work</option>
                        <option value="Inspection Work">Inspection Work</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold text-dark">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Detailed description of the milestone task..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>

                  <div className="row g-4">
                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-dark">Target Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        value={formData.targetDate}
                        onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                        required
                      />
                    </div>

                    <div className="col-12 col-md-6">
                      <label className="form-label fw-semibold text-dark">Initial Status</label>
                      <select
                        className="form-select"
                        value={formData.completionStatus}
                        onChange={(e) => setFormData({ ...formData, completionStatus: e.target.value })}
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light border-top px-4 py-3 d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={() => setShowAddModal(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-4 fw-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Milestone'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={!!milestoneToDelete}
        title="Delete Milestone?"
        itemName={milestoneToDelete?.title || ''}
        onClose={() => setMilestoneToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default MilestoneTracker;
