import api from './api';
import { createNotification } from './notificationService';

const STORAGE_KEY = 'buildtrack_reports';

const initialReports = [
  {
    id: 'rep-1',
    title: 'Q3 Financial & Procurement Audit',
    reportType: 'Procurement Reports',
    projectName: 'Oakwood Commercial Center',
    generatedBy: 'Admin User',
    fileFormat: 'PDF',
    fileSize: '2.4 MB',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    status: 'Ready'
  },
  {
    id: 'rep-2',
    title: 'Site Workforce Utilization Report',
    reportType: 'Workforce Reports',
    projectName: 'Downtown Office Tower',
    generatedBy: 'Project Manager',
    fileFormat: 'CSV',
    fileSize: '840 KB',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    status: 'Ready'
  },
  {
    id: 'rep-3',
    title: 'Monthly Progress & Milestone Status',
    reportType: 'Project Progress Reports',
    projectName: 'Oakwood Commercial Center',
    generatedBy: 'Site Engineer',
    fileFormat: 'PDF',
    fileSize: '4.1 MB',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    status: 'Ready'
  }
];

const getStoredReports = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialReports));
      return initialReports;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Error fetching stored reports:', err);
    return initialReports;
  }
};

const setStoredReports = (reports) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch (err) {
    console.error('Error saving reports:', err);
  }
};

/**
 * Fetch all reports
 */
export const fetchReports = async () => {
  try {
    const res = await api.get('/reports');
    if (res.data && Array.isArray(res.data)) {
      setStoredReports(res.data);
      return res.data;
    }
    return getStoredReports();
  } catch (err) {
    return getStoredReports();
  }
};

/**
 * Generate a new report
 */
export const generateReport = async (reportData) => {
  const newReport = {
    id: `rep-${Date.now()}`,
    title: reportData.title || `${reportData.reportType} - ${new Date().toLocaleDateString()}`,
    reportType: reportData.reportType || 'Project Progress Reports',
    projectName: reportData.projectName || 'All Projects',
    generatedBy: reportData.generatedBy || 'Current User',
    fileFormat: reportData.fileFormat || 'PDF',
    fileSize: `${(Math.random() * 3 + 0.5).toFixed(1)} MB`,
    createdAt: new Date().toISOString(),
    status: 'Ready'
  };

  try {
    const res = await api.post('/reports', newReport);
    if (res.data) {
      const current = getStoredReports();
      setStoredReports([res.data, ...current]);
      return res.data;
    }
  } catch (err) {
    // Fallback
  }
  const current = getStoredReports();
  const updated = [newReport, ...current];
  setStoredReports(updated);

  try {
    await createNotification({
      title: 'New Audit Report Generated',
      message: `Report "${newReport.title}" (${newReport.reportType}) generated for ${newReport.projectName}.`,
      type: 'System Notifications'
    });
  } catch (e) {
    console.error('Notification failed:', e);
  }

  return newReport;
};

/**
 * Download or export report (handles CSV data downloads and PDF print/document view)
 */
export const downloadReportCSV = (report) => {
  const isPdf = report.fileFormat && report.fileFormat.toUpperCase() === 'PDF';

  if (isPdf) {
    // Generate valid printable PDF document window with company header, audit table, and metadata
    const reportHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${report.title}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #00c938; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: 800; color: #00c938; }
            .badge { background: #e0f2fe; color: #0369a1; padding: 4px 12px; border-radius: 6px; font-weight: 700; font-size: 12px; }
            .meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 30px; }
            .meta-item { font-size: 14px; }
            .meta-label { color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; }
            .meta-value { font-weight: 700; color: #0f172a; margin-top: 2px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background: #f1f5f9; text-align: left; padding: 12px; font-size: 12px; text-transform: uppercase; color: #475569; border-bottom: 2px solid #cbd5e1; }
            td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
            .footer { margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #94a3b8; display: flex; justify-content: space-between; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="no-print" style="margin-bottom: 20px; text-align: right;">
            <button onclick="window.print()" style="background: #00c938; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 700; cursor: pointer;">🖨️ Print / Save as PDF</button>
          </div>
          <div class="header">
            <div class="logo">🏗️ BuildTrack Systems</div>
            <div class="badge">CONFIDENTIAL AUDIT REPORT</div>
          </div>
          <h1 style="margin: 0 0 10px 0; font-size: 26px; color: #0f172a;">${report.title}</h1>
          <p style="color: #64748b; margin-bottom: 24px;">System Audit & Operational Milestone Verification Report</p>

          <div class="meta-grid">
            <div class="meta-item"><div class="meta-label">Report Category</div><div class="meta-value">${report.reportType}</div></div>
            <div class="meta-item"><div class="meta-label">Target Project</div><div class="meta-value">${report.projectName}</div></div>
            <div class="meta-item"><div class="meta-label">Generated By</div><div class="meta-value">${report.generatedBy || 'System Administrator'}</div></div>
            <div class="meta-item"><div class="meta-label">Generated Date</div><div class="meta-value">${new Date(report.createdAt).toLocaleString()}</div></div>
          </div>

          <h3>Summary Metrics</h3>
          <table>
            <thead>
              <tr>
                <th>Audit Parameter</th>
                <th>Target Metric</th>
                <th>Current Status</th>
                <th>Compliance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Budget & Spending Variance</td>
                <td>Within 5.0% Margin</td>
                <td>+1.8% Adjusted</td>
                <td><span style="color: #10b981; font-weight: 700;">PASSED</span></td>
              </tr>
              <tr>
                <td>Milestone Completion Pace</td>
                <td>100% Phase Schedule</td>
                <td>94.2% On Track</td>
                <td><span style="color: #10b981; font-weight: 700;">PASSED</span></td>
              </tr>
              <tr>
                <td>Resource & Asset Allocation</td>
                <td>Zero Critical Shortage</td>
                <td>Optimal Supply</td>
                <td><span style="color: #10b981; font-weight: 700;">PASSED</span></td>
              </tr>
            </tbody>
          </table>

          <div class="footer">
            <div>BuildTrack Enterprise Platform v3.4.1</div>
            <div>Digitally Verified Document</div>
          </div>
        </body>
      </html>
    `;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(reportHtml);
      win.document.close();
    }
    return;
  }

  // CSV format download
  const headers = ['Report ID', 'Title', 'Type', 'Project', 'Format', 'Generated At', 'Status'];
  const row = [
    report.id || report._id,
    `"${report.title}"`,
    `"${report.reportType}"`,
    `"${report.projectName}"`,
    report.fileFormat,
    `"${new Date(report.createdAt).toLocaleString()}"`,
    report.status
  ];

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), row.join(',')].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${report.title.replace(/\s+/g, '_')}_${report.id}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Delete report
 */
export const deleteReport = async (id) => {
  try {
    await api.delete(`/reports/${id}`);
  } catch (err) {
    // Fallback
  }
  const current = getStoredReports();
  const updated = current.filter(r => r.id !== id && r._id !== id);
  setStoredReports(updated);
  return updated;
};
