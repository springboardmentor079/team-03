import React, { useState, useEffect } from 'react';
import { getTimesheetsByProjectId, logLaborHours } from '../services/workforceService';

const WorkforceTracker = ({ projectId }) => {
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    workerName: '',
    date: new Date().toISOString().split('T')[0],
    hoursWorked: '',
    taskDescription: ''
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchTimesheets();
  }, [projectId]);

  const fetchTimesheets = async () => {
    setLoading(true);
    try {
      const data = await getTimesheetsByProjectId(projectId);
      setTimesheets(data);
    } catch (err) {
      console.error('Error fetching timesheets:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalLaborHours = timesheets.reduce(
    (sum, entry) => sum + (Number(entry.hoursWorked) || 0),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (
      !formData.workerName.trim() ||
      !formData.date ||
      !formData.hoursWorked ||
      Number(formData.hoursWorked) <= 0 ||
      !formData.taskDescription.trim()
    ) {
      setFormError('Please fill out all fields with valid information and hours > 0.');
      return;
    }

    try {
      setSubmitting(true);
      const newEntry = await logLaborHours({
        projectId,
        workerName: formData.workerName,
        date: formData.date,
        hoursWorked: formData.hoursWorked,
        taskDescription: formData.taskDescription
      });

      setTimesheets((prev) => [...prev, newEntry]);
      setFormData({
        workerName: '',
        date: new Date().toISOString().split('T')[0],
        hoursWorked: '',
        taskDescription: ''
      });
    } catch (err) {
      setFormError('Failed to log labor hours. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-3 mb-4 bg-white">
      <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
        <div>
          <h5 className="fw-bold text-dark mb-0">Workforce Management & Timesheet Tracker</h5>
          <small className="text-muted">Track site labor hours, daily timesheets, and task allocations</small>
        </div>
        <span className="badge bg-primary fs-6 px-3 py-2">
          ⏱️ Total Labor: {totalLaborHours.toFixed(1)} Hours
        </span>
      </div>

      <div className="card-body p-4">
        {/* Labor Overview Section */}
        <div className="alert alert-info border-0 shadow-sm d-flex flex-column flex-md-row justify-content-between align-items-md-center p-3 mb-4 rounded-3">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary text-white p-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px' }}>
              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h6 className="fw-bold text-dark mb-0">Labor Utilization Overview</h6>
              <p className="small text-muted mb-0">
                {timesheets.length} Timesheet Log{timesheets.length !== 1 ? 's' : ''} recorded for this project site.
              </p>
            </div>
          </div>
          <div className="mt-2 mt-md-0 text-md-end">
            <span className="text-muted small fw-semibold d-block text-uppercase">Cumulative Man-Hours</span>
            <span className="fs-4 fw-bold text-primary">{totalLaborHours.toFixed(1)} hrs</span>
          </div>
        </div>

        {/* Daily Timesheet Log Form */}
        <div className="bg-light p-3 p-md-4 rounded-3 border mb-4">
          <h6 className="fw-bold text-dark mb-3">Daily Timesheet Log</h6>

          {formError && (
            <div className="alert alert-danger py-2 px-3 small" role="alert">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="row g-3 align-items-end">
            <div className="col-12 col-md-3">
              <label className="form-label small fw-semibold text-dark mb-1">Worker Name *</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="e.g. Carlos Mendez"
                value={formData.workerName}
                onChange={(e) => setFormData({ ...formData, workerName: e.target.value })}
                required
              />
            </div>

            <div className="col-12 col-md-2">
              <label className="form-label small fw-semibold text-dark mb-1">Date *</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="col-12 col-md-2">
              <label className="form-label small fw-semibold text-dark mb-1">Hours Worked *</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                className="form-control form-control-sm"
                placeholder="e.g. 8.0"
                value={formData.hoursWorked}
                onChange={(e) => setFormData({ ...formData, hoursWorked: e.target.value })}
                required
              />
            </div>

            <div className="col-12 col-md-3">
              <label className="form-label small fw-semibold text-dark mb-1">Task Description *</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="e.g. Steel rebar binding"
                value={formData.taskDescription}
                onChange={(e) => setFormData({ ...formData, taskDescription: e.target.value })}
                required
              />
            </div>

            <div className="col-12 col-md-2">
              <button
                type="submit"
                className="btn btn-primary btn-sm w-100 fw-semibold"
                disabled={submitting}
              >
                {submitting ? 'Logging...' : '+ Log Hours'}
              </button>
            </div>
          </form>
        </div>

        {/* Timesheet History Table */}
        <h6 className="fw-bold text-dark mb-3">Historical Timesheet Logs</h6>
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
            <span className="ms-2 small text-muted">Loading timesheet records...</span>
          </div>
        ) : timesheets.length === 0 ? (
          <div className="text-center py-4 bg-light rounded-3 text-muted border border-dashed">
            <p className="mb-0 small">No workforce hours logged for this project yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle border mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="small text-muted fw-semibold">Worker Name</th>
                  <th scope="col" className="small text-muted fw-semibold">Date</th>
                  <th scope="col" className="small text-muted fw-semibold">Hours Worked</th>
                  <th scope="col" className="small text-muted fw-semibold">Task Description</th>
                </tr>
              </thead>
              <tbody>
                {timesheets.map((entry) => (
                  <tr key={entry._id}>
                    <td className="fw-semibold text-dark">{entry.workerName}</td>
                    <td className="text-muted small">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td>
                      <span className="badge bg-light text-dark border fw-bold">
                        {Number(entry.hoursWorked).toFixed(1)} hrs
                      </span>
                    </td>
                    <td className="text-muted small">{entry.taskDescription}</td>
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

export default WorkforceTracker;
