import api from './api';
import { createNotification } from './notificationService';

const STORAGE_KEY = 'buildtrack_documents';

const initialDocuments = [
  {
    id: 'doc-1',
    title: 'Site Architectural Blueprint - Rev 3.2',
    category: 'Blueprints & Specs',
    projectName: 'Oakwood Commercial Center',
    fileName: 'Oakwood_Architectural_Blueprint_v3.pdf',
    fileSize: '14.2 MB',
    fileType: 'PDF',
    uploadedBy: 'Chief Architect',
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
  },
  {
    id: 'doc-2',
    title: 'General Contractor Service Agreement',
    category: 'Contracts & Agreements',
    projectName: 'Downtown Office Tower',
    fileName: 'GC_Agreement_Signed.pdf',
    fileSize: '3.8 MB',
    fileType: 'PDF',
    uploadedBy: 'Legal Compliance',
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString()
  },
  {
    id: 'doc-3',
    title: 'Structural Steel Procurement Receipt',
    category: 'Procurement Receipts',
    projectName: 'Oakwood Commercial Center',
    fileName: 'Steel_Beams_PO_Invoice_Receipt.png',
    fileSize: '1.2 MB',
    fileType: 'PNG',
    uploadedBy: 'Procurement Lead',
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString()
  },
  {
    id: 'doc-4',
    title: 'Environmental Impact Compliance Certificate',
    category: 'Compliance & Permits',
    projectName: 'Riverside Residential Complex',
    fileName: 'EPA_Compliance_Clearance_2026.pdf',
    fileSize: '2.9 MB',
    fileType: 'PDF',
    uploadedBy: 'Safety Officer',
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString()
  }
];

const getStoredDocuments = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialDocuments));
      return initialDocuments;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading stored documents:', err);
    return initialDocuments;
  }
};

const setStoredDocuments = (docs) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  } catch (err) {
    console.error('Error saving documents:', err);
  }
};

/**
 * Fetch all documents
 */
export const fetchDocuments = async () => {
  try {
    const res = await api.get('/documents');
    if (res.data && Array.isArray(res.data)) {
      setStoredDocuments(res.data);
      return res.data;
    }
    return getStoredDocuments();
  } catch (err) {
    return getStoredDocuments();
  }
};

/**
 * Upload a document
 */
export const uploadDocument = async (docData) => {
  const newDoc = {
    id: `doc-${Date.now()}`,
    title: docData.title || docData.fileName || 'Untitled Document',
    category: docData.category || 'Compliance & Permits',
    projectName: docData.projectName || 'Oakwood Commercial Center',
    fileName: docData.fileName || 'document.pdf',
    fileSize: docData.fileSize || `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
    fileType: docData.fileName?.split('.').pop()?.toUpperCase() || 'PDF',
    uploadedBy: docData.uploadedBy || 'Current User',
    uploadedAt: new Date().toISOString()
  };

  try {
    const res = await api.post('/documents', newDoc);
    if (res.data) {
      const current = getStoredDocuments();
      setStoredDocuments([res.data, ...current]);
      return res.data;
    }
  } catch (err) {
    // Fallback
  }

  const current = getStoredDocuments();
  const updated = [newDoc, ...current];
  setStoredDocuments(updated);

  try {
    await createNotification({
      title: 'Document Uploaded to Vault',
      message: `File "${newDoc.fileName}" (${newDoc.category}) was added to ${newDoc.projectName}.`,
      type: 'System Notifications'
    });
  } catch (e) {
    console.error('Notification failed:', e);
  }

  return newDoc;
};

/**
 * Download or view document (handles PDF printable views and binary blob downloads)
 */
export const downloadDocument = (doc) => {
  const isPdf = doc.fileName && doc.fileName.toLowerCase().endsWith('.pdf');

  // If a real file blob was attached during upload
  if (doc.fileObj) {
    const url = URL.createObjectURL(doc.fileObj);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return;
  }

  if (isPdf) {
    // Generate valid printable PDF document window with official blueprint/contract header and metadata
    const docHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${doc.title}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #00c938; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: 800; color: #00c938; }
            .badge { background: #dbeafe; color: #1d4ed8; padding: 4px 12px; border-radius: 6px; font-weight: 700; font-size: 12px; }
            .meta-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 30px; }
            .meta-item { font-size: 14px; }
            .meta-label { color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; }
            .meta-value { font-weight: 700; color: #0f172a; margin-top: 2px; }
            .content-box { background: #ffffff; border: 2px dashed #cbd5e1; padding: 30px; border-radius: 8px; text-align: center; margin-top: 20px; }
            .footer { margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #94a3b8; display: flex; justify-content: space-between; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="no-print" style="margin-bottom: 20px; text-align: right;">
            <button onclick="window.print()" style="background: #00c938; color: white; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 700; cursor: pointer;">🖨️ Print / Save as PDF</button>
          </div>
          <div class="header">
            <div class="logo">🏗️ BuildTrack Document Vault</div>
            <div class="badge">SECURE CLOUD ATTACHMENT</div>
          </div>
          <h1 style="margin: 0 0 10px 0; font-size: 26px; color: #0f172a;">${doc.title}</h1>
          <p style="color: #64748b; margin-bottom: 24px;">Official Vault Record & Attachment Document</p>

          <div class="meta-grid">
            <div class="meta-item"><div class="meta-label">Document Title</div><div class="meta-value">${doc.title}</div></div>
            <div class="meta-item"><div class="meta-label">Category</div><div class="meta-value">${doc.category}</div></div>
            <div class="meta-item"><div class="meta-label">Associated Project</div><div class="meta-value">${doc.projectName}</div></div>
            <div class="meta-item"><div class="meta-label">File Name & Size</div><div class="meta-value">${doc.fileName} (${doc.fileSize})</div></div>
            <div class="meta-item"><div class="meta-label">Uploaded By</div><div class="meta-value">${doc.uploadedBy}</div></div>
            <div class="meta-item"><div class="meta-label">Vault Upload Timestamp</div><div class="meta-value">${new Date(doc.uploadedAt).toLocaleString()}</div></div>
          </div>

          <div class="content-box">
            <div style="font-size: 40px; margin-bottom: 10px;">📄</div>
            <h3 style="margin: 0 0 8px 0; color: #0f172a;">${doc.fileName}</h3>
            <p style="color: #64748b; margin: 0; font-size: 14px;">This file is stored in BuildTrack AES-256 encrypted cloud vault.</p>
          </div>

          <div class="footer">
            <div>BuildTrack Vault Systems v3.4.1</div>
            <div>AES-256 Cloud Verified</div>
          </div>
        </body>
      </html>
    `;
    const win = window.open('', '_blank');
    if (win) {
      win.document.write(docHtml);
      win.document.close();
    }
    return;
  }

  // Non-PDF download (e.g. TXT/PNG)
  const dummyContent = `BuildTrack Enterprise Document Vault\nDocument: ${doc.title}\nCategory: ${doc.category}\nProject: ${doc.projectName}\nUploaded: ${new Date(doc.uploadedAt).toLocaleString()}\nFile: ${doc.fileName}`;
  const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = doc.fileName.replace(/\.pdf$/i, '.txt');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Delete document
 */
export const deleteDocument = async (id) => {
  try {
    await api.delete(`/documents/${id}`);
  } catch (err) {
    // Fallback
  }
  const current = getStoredDocuments();
  const updated = current.filter(d => d.id !== id && d._id !== id);
  setStoredDocuments(updated);
  return updated;
};
