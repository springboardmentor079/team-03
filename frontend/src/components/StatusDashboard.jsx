import React from 'react';

const StatusDashboard = ({ milestones = [] }) => {
  const total = milestones.length;
  const completedCount = milestones.filter((m) => m.completionStatus === 'Completed').length;
  const inProgressCount = milestones.filter((m) => m.completionStatus === 'In Progress').length;
  const pendingCount = milestones.filter((m) => m.completionStatus === 'Pending').length;

  // Calculate percentage of completed milestones
  const percentage = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  // Select progress bar color variant based on percentage
  let progressVariant = 'info';
  if (percentage === 100) progressVariant = 'success';
  else if (percentage >= 50) progressVariant = 'primary';
  else if (percentage > 0) progressVariant = 'warning';

  return (
    <div className="card shadow-sm border-0 mb-4 bg-white rounded-3">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="fw-bold mb-1 text-dark">Project Status Dashboard</h5>
            <p className="text-muted small mb-0">Overview of overall milestone progress & health</p>
          </div>
          <div className="text-end">
            <span className="display-6 fw-bold text-primary">{percentage}%</span>
            <span className="text-muted d-block small">Overall Completion</span>
          </div>
        </div>

        {/* Dynamic Bootstrap Progress Bar */}
        <div className="mb-4">
          <div className="d-flex justify-content-between text-muted small mb-1">
            <span>Overall Progress</span>
            <span>{completedCount} of {total} Milestones Completed</span>
          </div>
          <div className="progress" style={{ height: '22px', borderRadius: '11px', backgroundColor: '#e9ecef' }}>
            <div
              className={`progress-bar progress-bar-striped progress-bar-animated bg-${progressVariant}`}
              role="progressbar"
              style={{ width: `${percentage}%`, borderRadius: '11px', transition: 'width 0.4s ease' }}
              aria-valuenow={percentage}
              aria-valuemin="0"
              aria-valuemax="100"
            >
              {percentage > 5 && `${percentage}%`}
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="row g-3 text-center">
          <div className="col-4">
            <div className="p-3 rounded bg-light border-start border-4 border-secondary">
              <div className="fs-4 fw-bold text-secondary">{pendingCount}</div>
              <div className="text-uppercase small fw-semibold text-muted">Pending</div>
            </div>
          </div>
          <div className="col-4">
            <div className="p-3 rounded bg-light border-start border-4 border-warning">
              <div className="fs-4 fw-bold text-warning">{inProgressCount}</div>
              <div className="text-uppercase small fw-semibold text-warning">In Progress</div>
            </div>
          </div>
          <div className="col-4">
            <div className="p-3 rounded bg-light border-start border-4 border-success">
              <div className="fs-4 fw-bold text-success">{completedCount}</div>
              <div className="text-uppercase small fw-semibold text-success">Completed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusDashboard;
