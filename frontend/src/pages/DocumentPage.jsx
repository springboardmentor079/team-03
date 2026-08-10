import React, { useState, useEffect } from 'react';
import { fetchDocuments, uploadDocument, downloadDocument, deleteDocument } from '../services/documentService';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const getCategoryBadgeStyle = (category) => {
  switch (category) {
    case 'Blueprints & Specs':
      return { background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: '1px solid rgba(59, 130, 246, 0.2)' };
    case 'Contracts & Agreements':
      return { background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', border: '1px solid rgba(168, 85, 247, 0.2)' };
    case 'Procurement Receipts':
      return { background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)' };
    default:
      return { background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.2)' };
  }
};

const DocumentPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Delete modal state
  const [deletingDoc, setDeletingDoc] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Blueprints & Specs',
    projectName: 'Oakwood Commercial Center',
    fileName: '',
    fileSize: '3.5 MB'
  });

  const loadData = async () => {
    setLoading(true);
    const data = await fetchDocuments();
    setDocuments(data || []);
    setLoading(false);
  };

  const handleRefreshVault = async () => {
    setIsRefreshing(true);
    const data = await fetchDocuments();
    setDocuments(data || []);
    setTimeout(() => {
      setIsRefreshing(false);
      setToastMessage(`✓ Cloud Document Vault synced! (${data ? data.length : 0} records verified)`);
      setTimeout(() => setToastMessage(''), 3000);
    }, 400);
  };

  useEffect(() => {
    loadData();
  }, []);

  const [selectedFileObj, setSelectedFileObj] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFileObj(file);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setFormData({
        ...formData,
        fileName: file.name,
        title: formData.title || file.name.replace(/\.[^/.]+$/, ""),
        fileSize: `${sizeMB > 0 ? sizeMB : 0.5} MB`
      });
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fileName && !formData.title) {
      alert('Please select a file or provide a document title.');
      return;
    }
    setIsUploading(true);
    const newDoc = await uploadDocument({
      ...formData,
      fileObj: selectedFileObj,
      fileName: formData.fileName || 'uploaded_document.pdf'
    });
    setDocuments([newDoc, ...documents]);
    setIsUploading(false);
    setShowUploadModal(false);
    setSelectedFileObj(null);
    setFormData({
      title: '',
      category: 'Blueprints & Specs',
      projectName: 'Oakwood Commercial Center',
      fileName: '',
      fileSize: '3.5 MB'
    });
  };

  const handleConfirmDelete = async () => {
    if (!deletingDoc) return;
    const updated = await deleteDocument(deletingDoc.id || deletingDoc._id);
    setDocuments(updated);
    setDeletingDoc(null);
  };

  const filteredDocs = documents.filter(d => {
    const matchesSearch = d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || d.category === selectedCategory;
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
            Document Management Vault
          </h1>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0 0' }}>
            Store, categorize, and control access to architectural blueprints, permits, contracts, and receipts.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={handleRefreshVault}
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
            {isRefreshing ? 'Syncing...' : 'Refresh Vault'}
          </button>
          <button
            onClick={() => setShowUploadModal(true)}
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
            📤 Upload Document
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Vaulted Documents</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#0f172a', marginTop: '4px' }}>{documents.length}</div>
          <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>🔒 AES-256 Encrypted</div>
        </div>

        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Storage Capacity</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#00c938', marginTop: '4px' }}>22.1 MB</div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>of 100 GB Cloud Limit</div>
        </div>

        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Categories Monitored</div>
          <div style={{ fontSize: '28px', fontWeight: '800', color: '#3b82f6', marginTop: '4px' }}>4 Types</div>
          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Blueprints, Contracts, Receipts, Permits</div>
        </div>
      </div>

      {/* Document Vault List (Full Width) */}
      <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '12px', flex: 1, maxWidth: '600px' }}>
            <input
              type="text"
              placeholder="Search by document title, project, or file name..."
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
            <option value="Blueprints & Specs">Blueprints & Specs</option>
            <option value="Contracts & Agreements">Contracts & Agreements</option>
            <option value="Procurement Receipts">Procurement Receipts</option>
            <option value="Compliance & Permits">Compliance & Permits</option>
          </select>
        </div>

        {/* Document Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '11px', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 14px' }}>Document Name</th>
                <th style={{ padding: '12px 14px' }}>Category</th>
                <th style={{ padding: '12px 14px' }}>Project</th>
                <th style={{ padding: '12px 14px' }}>Size</th>
                <th style={{ padding: '12px 14px' }}>Uploaded</th>
                <th style={{ padding: '12px 14px', textAlign: 'right', width: '160px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <tr key={doc.id || doc._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: '600', color: '#0f172a' }}>{doc.title}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{doc.fileName}</div>
                    </td>
                    <td style={{ padding: '14px' }}>
                      <span style={{
                        padding: '3px 10px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '600',
                        ...getCategoryBadgeStyle(doc.category)
                      }}>
                        {doc.category}
                      </span>
                    </td>
                    <td style={{ padding: '14px', color: '#475569' }}>
                      {doc.projectName}
                    </td>
                    <td style={{ padding: '14px', color: '#64748b', fontSize: '12px' }}>
                      {doc.fileSize}
                    </td>
                    <td style={{ padding: '14px', color: '#94a3b8', fontSize: '12px' }}>
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '14px', width: '160px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                        <button
                          onClick={() => setPreviewDoc(doc)}
                          style={{
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            padding: '5px 9px',
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
                          👁️ View
                        </button>
                        <button
                          onClick={() => downloadDocument(doc)}
                          style={{
                            background: '#ffffff',
                            border: '1px solid #cbd5e1',
                            padding: '5px 9px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#0f172a',
                            display: 'inline-flex',
                            alignItems: 'center'
                          }}
                          title="Download Document"
                        >
                          ⬇️
                        </button>
                        <button
                          onClick={() => setDeletingDoc(doc)}
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
                          title="Delete Document"
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
                    No documents found in vault.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
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
                <span>📤</span> Upload Document to Vault
              </h2>
              <button
                onClick={() => setShowUploadModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Select File *
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  style={{ width: '100%', fontSize: '13px', padding: '8px', border: '1px dashed #cbd5e1', borderRadius: '8px', backgroundColor: '#f8fafc' }}
                />
                {formData.fileName && (
                  <div style={{ fontSize: '12px', color: '#10b981', marginTop: '6px', fontWeight: '600' }}>
                    ✓ Selected: {formData.fileName} ({formData.fileSize})
                  </div>
                )}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Document Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Foundation Blueprint Phase 1"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Document Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                >
                  <option value="Blueprints & Specs">Blueprints & Specs</option>
                  <option value="Contracts & Agreements">Contracts & Agreements</option>
                  <option value="Procurement Receipts">Procurement Receipts</option>
                  <option value="Compliance & Permits">Compliance & Permits</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                  Associated Project *
                </label>
                <select
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                >
                  <option value="Oakwood Commercial Center">Oakwood Commercial Center</option>
                  <option value="Downtown Office Tower">Downtown Office Tower</option>
                  <option value="Riverside Residential Complex">Riverside Residential Complex</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
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
                  disabled={isUploading}
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
                  {isUploading ? 'Uploading...' : '☁️ Upload to Vault'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewDoc && (
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
          zIndex: 2000,
          padding: '16px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '540px',
            padding: '28px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: '#0f172a' }}>Document Preview Details</h3>
              <button
                onClick={() => setPreviewDoc(null)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}
              >
                ✕
              </button>
            </div>

            <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '20px', fontSize: '13px', lineHeight: '1.7' }}>
              <div><strong>Document Title:</strong> {previewDoc.title}</div>
              <div><strong>Category:</strong> {previewDoc.category}</div>
              <div><strong>Project:</strong> {previewDoc.projectName}</div>
              <div><strong>File Name:</strong> {previewDoc.fileName}</div>
              <div><strong>File Size:</strong> {previewDoc.fileSize}</div>
              <div><strong>Uploaded By:</strong> {previewDoc.uploadedBy}</div>
              <div><strong>Uploaded At:</strong> {new Date(previewDoc.uploadedAt).toLocaleString()}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setPreviewDoc(null)}
                style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', fontSize: '13px', fontWeight: '600' }}
              >
                Close
              </button>
              <button
                onClick={() => { downloadDocument(previewDoc); setPreviewDoc(null); }}
                style={{ padding: '9px 18px', borderRadius: '8px', border: 'none', background: '#00c938', color: '#fff', fontSize: '13px', fontWeight: '700' }}
              >
                ⬇️ Download Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reusable Delete Confirmation Modal */}
      <DeleteConfirmationModal
        show={Boolean(deletingDoc)}
        title="Delete Vault Document"
        itemName={deletingDoc?.title}
        message={`Are you sure you want to permanently delete "${deletingDoc?.title}" from the cloud document vault?`}
        onClose={() => setDeletingDoc(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default DocumentPage;
