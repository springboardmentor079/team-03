import React, { useState, useEffect } from 'react';
import { getExpensesByProjectId, logExpense } from '../services/expenseService';

const FinancialDashboard = ({ projectId, totalBudget = 500000 }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchExpenses();
  }, [projectId]);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const data = await getExpensesByProjectId(projectId);
      setExpenses(data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalSpent = expenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const budgetNum = Number(totalBudget) || 500000;
  const rawPercentage = budgetNum > 0 ? (totalSpent / budgetNum) * 100 : 0;
  const formattedPercentage = rawPercentage.toFixed(1);
  const clampedPercentage = Math.min(Math.max(rawPercentage, 0), 100);

  // Dynamic progress bar styling based on prompt: green (<75%), yellow (75%-90%), red (>90%)
  let progressBarClass = 'bg-success';
  let statusLabel = 'Within Budget';
  let badgeClass = 'bg-success';

  if (rawPercentage > 90) {
    progressBarClass = 'bg-danger';
    statusLabel = 'Critical Budget Warning';
    badgeClass = 'bg-danger';
  } else if (rawPercentage >= 75) {
    progressBarClass = 'bg-warning text-dark';
    statusLabel = 'Budget Near Capacity';
    badgeClass = 'bg-warning text-dark';
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.description.trim() || !formData.amount || Number(formData.amount) <= 0) {
      setFormError('Please provide a valid description and an amount greater than 0.');
      return;
    }

    try {
      setSubmitting(true);
      const newExpense = await logExpense({
        projectId,
        description: formData.description,
        amount: formData.amount,
        date: formData.date
      });

      setExpenses((prev) => [...prev, newExpense]);
      setFormData({
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0]
      });
    } catch (err) {
      setFormError('Failed to log expense. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="card shadow-sm border-0 rounded-3 mb-4 bg-white">
      <div className="card-header bg-white border-bottom py-3 d-flex justify-content-between align-items-center">
        <div>
          <h5 className="fw-bold text-dark mb-0">Financial Dashboard & Budget Tracker</h5>
          <small className="text-muted">Real-time expenditure tracking and budget monitoring</small>
        </div>
        <span className={`badge ${badgeClass}`}>
          {statusLabel}
        </span>
      </div>

      <div className="card-body p-4">
        {/* Visual Budget Tracker */}
        <div className="bg-light p-4 rounded-3 border mb-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-2 gap-2">
            <div>
              <span className="text-muted small fw-semibold text-uppercase">Total Spent / Total Budget</span>
              <h4 className="fw-bold text-dark mb-0">
                {formatCurrency(totalSpent)}{' '}
                <span className="text-muted fs-6 fw-normal">of {formatCurrency(budgetNum)}</span>
              </h4>
            </div>
            <div className="text-md-end">
              <span className="fs-5 fw-bold text-dark">{formattedPercentage}%</span>
              <span className="text-muted small d-block">Budget Utilized</span>
            </div>
          </div>

          {/* Bootstrap Progress Bar */}
          <div className="progress rounded-pill mb-2" style={{ height: '16px' }}>
            <div
              className={`progress-bar progress-bar-striped progress-bar-animated ${progressBarClass}`}
              role="progressbar"
              style={{ width: `${clampedPercentage}%` }}
              aria-valuenow={clampedPercentage}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>

          <div className="d-flex justify-content-between text-muted extra-small">
            <span>$0</span>
            <span>75% Warning Threshold</span>
            <span>90% Critical Threshold</span>
            <span>{formatCurrency(budgetNum)}</span>
          </div>
        </div>

        {/* Expense Form */}
        <div className="bg-light p-3 p-md-4 rounded-3 border mb-4">
          <h6 className="fw-bold text-dark mb-3">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="me-2 text-primary">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Log New Expense
          </h6>

          {formError && (
            <div className="alert alert-danger py-2 px-3 small" role="alert">
              {formError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="row g-3 align-items-end">
            <div className="col-12 col-md-5">
              <label className="form-label small fw-semibold text-dark mb-1">Description *</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="e.g. Steel rebar procurement"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>

            <div className="col-12 col-md-3">
              <label className="form-label small fw-semibold text-dark mb-1">Amount ($) *</label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                className="form-control form-control-sm"
                placeholder="e.g. 15000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>

            <div className="col-12 col-md-2">
              <label className="form-label small fw-semibold text-dark mb-1">Date</label>
              <input
                type="date"
                className="form-control form-control-sm"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
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
                    Logging...
                  </>
                ) : (
                  '+ Log Expense'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Itemized Expenses List / Table */}
        <h6 className="fw-bold text-dark mb-3">Itemized Expenses</h6>
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
            <span className="ms-2 small text-muted">Loading financial records...</span>
          </div>
        ) : expenses.length === 0 ? (
          <div className="text-center py-4 bg-light rounded-3 text-muted border border-dashed">
            <p className="mb-0 small">No expenses logged for this project yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle border mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="small text-muted fw-semibold">Description</th>
                  <th scope="col" className="small text-muted fw-semibold">Date</th>
                  <th scope="col" className="small text-muted fw-semibold text-end">Amount</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense._id}>
                    <td className="fw-semibold text-dark">{expense.description}</td>
                    <td className="text-muted small">
                      {new Date(expense.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="fw-bold text-dark text-end">
                      {formatCurrency(expense.amount)}
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

export default FinancialDashboard;
