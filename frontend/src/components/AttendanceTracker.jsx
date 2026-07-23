import React, { useState, useEffect } from 'react';
import { getAttendanceByProjectId, markAttendance } from '../services/attendanceService';

const AttendanceTracker = ({ projectId }) => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const [formData, setFormData] = useState({
    workerName: '',
    role: 'Mason / Steel Fixer',
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
    hours: '8.0',
    remarks: ''
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchAttendance();
  }, [projectId]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const data = await getAttendanceByProjectId(projectId);
      setAttendance(data);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  const presentCount = attendance.filter((a) => a.status === 'Present' || a.status === 'Overtime').length;
  const halfDayCount = attendance.filter((a) => a.status === 'Half-day').length;
  const absentCount = attendance.filter((a) => a.status === 'Absent').length;
  const totalRecords = attendance.length;
  const attendanceRate = totalRecords > 0 ? (((presentCount + halfDayCount * 0.5) / totalRecords) * 100).toFixed(1) : '100';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.workerName.trim() || !formData.date) {
      setFormError('Please provide worker name and date.');
      return;
    }

    try {
      setSubmitting(true);
      const updatedRecord = await markAttendance({
        projectId,
        workerName: formData.workerName,
        role: formData.role,
        date: formData.date,
        status: formData.status,
        hours: formData.status === 'Absent' ? 0 : formData.hours,
        remarks: formData.remarks
      });

      setAttendance((prev) => {
        const idx = prev.findIndex((a) => a._id === updatedRecord._id);
        if (idx !== -1) {
          const newArr = [...prev];
          newArr[idx] = updatedRecord;
          return newArr;
        }
        return [...prev, updatedRecord];
      });

      setFormData({
        workerName: '',
        role: 'Mason / Steel Fixer',
        date: new Date().toISOString().split('T')[0],
        status: 'Present',
        hours: '8.0',
        remarks: ''
      });
    } catch (err) {
      setFormError('Failed to mark attendance.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickStatusChange = async (record, newStatus) => {
    try {
      setUpdatingId(record._id);
      let newHours = record.hours;
      if (newStatus === 'Absent') newHours = 0;
      else if (newStatus === 'Half-day') newHours = 4.0;
      else if (newStatus === 'Present' && record.hours === 0) newHours = 8.0;

      const updated = await markAttendance({
        ...record,
        status: newStatus,
        hours: newHours
      });

      setAttendance((prev) =>
        prev.map((item) => (item._id === record._id ? updated : item))
      );
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Present':
        return 'bg-success text-white';
      case 'Overtime':
        return 'bg-primary text-white';
      case 'Half-day':
        return 'bg-warning text-dark';
      case 'Absent':
        return 'bg-danger text-white';
      default:
        return 'bg-secondary text-white';
    }
  };

  return (
    <div className="card shadow-sm border-0 rounded-3 mb-4 bg-white">
      <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
        <div>
          <h5 className="fw-bold text-dark mb-0">Daily Site Attendance Tracking</h5>
          <small className="text-muted">Monitor daily worker presence, shifts, and absence logs</small>
        </div>
        <span className="badge bg-success fs-6 px-3 py-2">
          Rate: {attendanceRate}% Present
        </span>
      </div>

      <div className="card-body p-4">
        {/* Attendance Summary Cards */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="bg-light p-3 rounded-3 border border-start border-4 border-success">
              <span className="text-muted small fw-semibold text-uppercase d-block">Present</span>
              <h4 className="fw-bold text-success mb-0">{presentCount}</h4>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="bg-light p-3 rounded-3 border border-start border-4 border-warning">
              <span className="text-muted small fw-semibold text-uppercase d-block">Half-Day</span>
              <h4 className="fw-bold text-warning mb-0">{halfDayCount}</h4>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="bg-light p-3 rounded-3 border border-start border-4 border-danger">
              <span className="text-muted small fw-semibold text-uppercase d-block">Absent</span>
              <h4 className="fw-bold text-danger mb-0">{absentCount}</h4>
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="bg-light p-3 rounded-3 border border-start border-4 border-info">
              <span className="text-muted small fw-semibold text-uppercase d-block">Headcount</span>
              <h4 className="fw-bold text-info mb-0">{totalRecords}</h4>
            </div>
          </div>
        </div>

        {/* Mark Attendance Form */}
        <div className="bg-light p-3 p-md-4 rounded-3 border mb-4">
          <h6 className="fw-bold text-dark mb-3">Mark Worker Attendance</h6>

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
              <label className="form-label small fw-semibold text-dark mb-1">Role</label>
              <select
                className="form-select form-select-sm"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="Mason / Steel Fixer">Mason / Steel Fixer</option>
                <option value="Equipment Operator">Equipment Operator</option>
                <option value="Site Electrician">Site Electrician</option>
                <option value="Safety Supervisor">Safety Supervisor</option>
                <option value="Carpenter">Carpenter</option>
                <option value="General Laborer">General Laborer</option>
              </select>
            </div>

            <div className="col-6 col-md-2">
              <label className="form-label small fw-semibold text-dark mb-1">Date *</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>

            <div className="col-6 col-md-2">
              <label className="form-label small fw-semibold text-dark mb-1">Status</label>
              <select
                className="form-select form-select-sm"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="Present">Present</option>
                <option value="Half-day">Half-day</option>
                <option value="Overtime">Overtime</option>
                <option value="Absent">Absent</option>
              </select>
            </div>

            <div className="col-12 col-md-3">
              <button
                type="submit"
                className="btn btn-primary btn-sm w-100 fw-semibold"
                disabled={submitting}
              >
                {submitting ? 'Marking...' : 'Mark Attendance'}
              </button>
            </div>
          </form>
        </div>

        {/* Attendance Roster Table */}
        <h6 className="fw-bold text-dark mb-3">Daily Attendance Roster</h6>
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
            <span className="ms-2 small text-muted">Loading attendance records...</span>
          </div>
        ) : attendance.length === 0 ? (
          <div className="text-center py-4 bg-light rounded-3 text-muted border border-dashed">
            <p className="mb-0 small">No attendance records logged for this project today.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle border mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="small text-muted fw-semibold">Worker Name</th>
                  <th scope="col" className="small text-muted fw-semibold">Role</th>
                  <th scope="col" className="small text-muted fw-semibold">Date</th>
                  <th scope="col" className="small text-muted fw-semibold">Status</th>
                  <th scope="col" className="small text-muted fw-semibold">Hours</th>
                  <th scope="col" className="small text-muted fw-semibold text-end">Quick Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((rec) => (
                  <tr key={rec._id}>
                    <td className="fw-semibold text-dark">{rec.workerName}</td>
                    <td className="text-muted small">{rec.role}</td>
                    <td className="text-muted small">
                      {new Date(rec.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(rec.status)}`}>
                        {rec.status}
                      </span>
                    </td>
                    <td className="fw-bold text-dark">{rec.hours} hrs</td>
                    <td className="text-end">
                      <div className="btn-group btn-group-sm" role="group">
                        <button
                          type="button"
                          className={`btn ${rec.status === 'Present' ? 'btn-success' : 'btn-outline-success'}`}
                          onClick={() => handleQuickStatusChange(rec, 'Present')}
                          disabled={updatingId === rec._id}
                        >
                          Present
                        </button>
                        <button
                          type="button"
                          className={`btn ${rec.status === 'Half-day' ? 'btn-warning' : 'btn-outline-warning text-dark'}`}
                          onClick={() => handleQuickStatusChange(rec, 'Half-day')}
                          disabled={updatingId === rec._id}
                        >
                          Half-day
                        </button>
                        <button
                          type="button"
                          className={`btn ${rec.status === 'Absent' ? 'btn-danger' : 'btn-outline-danger'}`}
                          onClick={() => handleQuickStatusChange(rec, 'Absent')}
                          disabled={updatingId === rec._id}
                        >
                          Absent
                        </button>
                      </div>
                    </td>
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

export default AttendanceTracker;
