import React, { useState, useEffect } from 'react';
import { fetchReports, generateReport, downloadReportCSV, deleteReport } from '../services/reportService';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Delete modal state
  const [deletingReport, setDeletingReport] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    reportType: 'Project Progress Reports',
    projectName: 'Oakwood Commercial Center',
    fileFormat: 'PDF'
  });

  const loadData = async () => {
    setLoading(true);
    const data = await fetchReports();
    setReports(data || []);
    setLoading(false);
  };

  const handleRefreshList = async () => {
    setIsRefreshing(true);
    const data = await fetchReports();
    setReports(data || []);
    setTimeout(() => {
      setIsRefreshing(false);
      setToastMessage(`✓ Reports list refreshed! (${data ? data.length : 0} items verified)`);
      setTimeout(() => setToastMessage(''), 3000);
    }, 400);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    const newRep = await generateReport(formData);
    setReports([newRep, ...reports]);
    setIsGenerating(false);
    setShowGenerateModal(false);
    setFormData({
      title: '',
      reportType: 'Project Progress Reports',
      projectName: 'Oakwood Commercial Center',
      fileFormat: 'PDF'
    });
  };

  const handleConfirmDelete = async () => {
    if (!deletingReport) return;
    const updated = await deleteReport(deletingReport.id || deletingReport._id);
    setReports(updated);
    setDeletingReport(null);
  };

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.projectName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || r.reportType === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto', fontFamily: 'Inter, system-ui, sans-serif', position: 'relative' }}>
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '600',
          boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderLeft: '4px solid #00c938'
        }}>
          {toastMessage}
        </div>
      )}

      {/* Title & Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
            Enterprise Reporting Hub
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>
            Generate, schedule, and export project audit reports, financial summaries, and workforce metrics.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={handleRefreshList}
            disabled={isRefreshing}
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              fontWeight: '600',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <span style={{
              display: 'inline-block',
              transition: 'transform 0.5s ease',
              transform: isRefreshing ? 'rotate(360deg)' : 'none'
            }}>
              🔄
            </span>
            {isRefreshing ? 'Refreshing...' : 'Refresh List'}
          </button>
          <button
            onClick={() => setShowGenerateModal(true)}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#00c938',
              color: '#ffffff',
              fontWeight: '700',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0, 201, 56, 0.25)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            ⚡ Generate Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Total Archived Reports</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>{reports.length}</div>
          <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>✓ Verified & Backed up</div>
        </div>

        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Latest Generated Report</div>
          <div style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginTop: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {reports[0]?.title || 'None'}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
            {reports[0] ? new Date(reports[0].createdAt).toLocaleDateString() : '--'}
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Supported Export Formats</div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
            <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>PDF</span>
            <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>CSV</span>
            <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700' }}>EXCEL</span>
          </div>
        </div>
      </div>

      {/* Reports Archive Table (Full Width) */}
      <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '12px', flex: 1, maxWidth: '600px' }}>
            <input
              type="text"
              placeholder="Search reports by title or project name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '9px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', width: '100%' }}
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ padding: '9px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: '#fff', cursor: 'pointer' }}
          >
            <option value="All">All Categories</option>
            <option value="Project Progress Reports">Project Progress</option>
            <option value="Resource Utilization Reports">Resource Utilization</option>
            <option value="Budget Reports">Budget Reports</option>
            <option value="Workforce Reports">Workforce Reports</option>
            <option value="Procurement Reports">Procurement Reports</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 14px' }}>Report Title</th>
                <th style={{ padding: '12px 14px' }}>Category</th>
                <th style={{ padding: '12px 14px' }}>Project</th>
                <th style={{ padding: '12px 14px' }}>Format</th>
                <th style={{ padding: '12px 14px' }}>Date</th>
                <th style={{ padding: '12px 14px', textAlign: 'right', width: '150px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length > 0 ? (
                filteredReports.map((rep) => (
                  <tr key={rep.id || rep._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px', fontWeight: '600', color: '#0f172a' }}>
                      {rep.title}
                    </td>
                    <td style={{ padding: '14px', color: '#475569', fontSize: '12px' }}>
                      {rep.reportType}
                    </td>
                    <td style={{ padding: '14px', color: '#64748b' }}>
                      {rep.projectName}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '700',
                        backgroundColor: rep.fileFormat === 'PDF' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                        color: rep.fileFormat === 'PDF' ? '#ef4444' : '#10b981'
                      }}>
                        {rep.fileFormat}
                      </span>
                    </td>
                    <td style={{ padding: '14px', color: '#94a3b8', fontSize: '12px' }}>
                      {new Date(rep.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '14px', width: '150px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          onClick={() => downloadReportCSV(rep)}
                          style={{
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            padding: '5px 10px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#0f172a',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          ⬇️ Download
                        </button>
                        <button
                          onClick={() => setDeletingReport(rep)}
                          style={{
                            background: '#fef2f2',
                            border: '1px solid #fee2e2',
                            padding: '5px 9px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            color: '#ef4444',
                            display: 'inline-flex',
                            alignItems: 'center'
                          }}
                          title="Delete Report"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                    No reports found matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1050,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '520px',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>⚡</span> Generate New Audit Report
              </h2>
              <button
                onClick={() => setShowGenerateModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Report Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Weekly Safety & Milestone Audit"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Report Category *
                </label>
                <select
                  value={formData.reportType}
                  onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                >
                  <option value="Project Progress Reports">Project Progress Reports</option>
                  <option value="Resource Utilization Reports">Resource Utilization Reports</option>
                  <option value="Budget Reports">Budget Reports</option>
                  <option value="Workforce Reports">Workforce Reports</option>
                  <option value="Procurement Reports">Procurement Reports</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Target Project *
                </label>
                <select
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                >
                  <option value="Oakwood Commercial Center">Oakwood Commercial Center</option>
                  <option value="Downtown Office Tower">Downtown Office Tower</option>
                  <option value="Riverside Residential Complex">Riverside Residential Complex</option>
                  <option value="Metro Highway Extension Phase 2">Metro Highway Extension Phase 2</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Export Format *
                </label>
                <select
                  value={formData.fileFormat}
                  onChange={(e) => setFormData({ ...formData, fileFormat: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                >
                  <option value="PDF">PDF Document (.pdf)</option>
                  <option value="CSV">CSV Data File (.csv)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowGenerateModal(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    fontWeight: '600',
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#00c938',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: '700',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  {isGenerating ? 'Generating...' : '📥 Generate & Export'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reusable Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={Boolean(deletingReport)}
        title="Delete Report Record"
        itemName={deletingReport?.title}
        message={`Are you sure you want to delete "${deletingReport?.title}" from the audit history archive?`}
        onClose={() => setDeletingReport(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default ReportsPage;
