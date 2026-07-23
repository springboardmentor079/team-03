import React, { useState, useEffect } from 'react';
import { getTeamByProjectId, assignTeamMember } from '../services/resourceService';

const ResourceAllocation = ({ projectId }) => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    role: 'Site Engineer',
    contact: ''
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchTeam();
  }, [projectId]);

  const fetchTeam = async () => {
    setLoading(true);
    try {
      const data = await getTeamByProjectId(projectId);
      setTeam(data);
    } catch (err) {
      console.error('Error fetching team members:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name.trim() || !formData.contact.trim()) {
      setFormError('Please fill out all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      const newMember = await assignTeamMember(projectId, formData);
      setTeam((prev) => [...prev, newMember]);
      setFormData({
        name: '',
        role: 'Site Engineer',
        contact: ''
      });
    } catch (err) {
      setFormError('Failed to assign team member. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'Project Manager':
        return 'bg-primary text-white';
      case 'Site Engineer':
        return 'bg-info text-dark';
      case 'Subcontractor':
        return 'bg-warning text-dark';
      default:
        return 'bg-secondary text-white';
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-3 mb-4 bg-white">
      <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
        <div>
          <h5 className="fw-bold text-dark mb-0">Resource Allocation & Team Roster</h5>
          <small className="text-muted">Manage assigned site personnel and subcontractors</small>
        </div>
        <span className="badge bg-light text-dark border">
          {team.length} Team Members Assigned
        </span>
      </div>

      <div className="card-body p-4">
        {/* Resource Assignment Form */}
        <div className="bg-light p-3 p-md-4 rounded-3 border mb-4">
          <h6 className="fw-bold text-dark mb-3">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="me-2 text-primary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Assign New Team Member
          </h6>

          {formError && (
            <div className="alert alert-danger py-2 px-3 small" role="alert">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="row g-3 align-items-end">
            <div className="col-12 col-md-4">
              <label className="form-label small fw-semibold text-dark mb-1">Full Name *</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="e.g. David Miller"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="col-12 col-md-3">
              <label className="form-label small fw-semibold text-dark mb-1">Role *</label>
              <select
                className="form-select form-select-sm"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="Site Engineer">Site Engineer</option>
                <option value="Subcontractor">Subcontractor</option>
                <option value="Project Manager">Project Manager</option>
              </select>
            </div>

            <div className="col-12 col-md-3">
              <label className="form-label small fw-semibold text-dark mb-1">Contact Info *</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="Email or Phone"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                required
              />
            </div>

            <div className="col-12 col-md-2">
              <button
                type="submit"
                className="btn btn-primary btn-sm w-100 fw-semibold d-flex justify-content-center align-items-center gap-1"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Assigning...
                  </>
                ) : (
                  '+ Assign'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Team Roster View */}
        <h6 className="fw-bold text-dark mb-3">Team Roster</h6>
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
            <span className="ms-2 small text-muted">Loading team roster...</span>
          </div>
        ) : team.length === 0 ? (
          <div className="text-center py-4 bg-light rounded-3 text-muted border border-dashed">
            <p className="mb-0 small">No team members assigned to this project yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle border mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="small text-muted fw-semibold">Name</th>
                  <th scope="col" className="small text-muted fw-semibold">Role</th>
                  <th scope="col" className="small text-muted fw-semibold">Contact</th>
                </tr>
              </thead>
              <tbody>
                {team.map((member) => (
                  <tr key={member._id}>
                    <td className="fw-semibold text-dark">{member.name}</td>
                    <td>
                      <span className={`badge ${getRoleBadge(member.role)}`}>
                        {member.role}
                      </span>
                    </td>
                    <td className="text-muted small">{member.contact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceAllocation;
