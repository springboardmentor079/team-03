import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/auth';

const Profile = () => {
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormData({
          fullName: res.data.fullName || '',
          email: res.data.email || '',
          role: res.data.role || ''
        });
      } catch (err) {
        console.error(err);
        setMessage({
          type: 'danger',
          text: err.response?.data?.message || 'Failed to load profile details.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setUpdating(true);

    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        'http://localhost:5000/api/auth/profile',
        {
          fullName: formData.fullName,
          email: formData.email
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setMessage({ type: 'success', text: res.data.message || 'Profile updated successfully!' });
      
      // Update local storage and context state
      login(res.data.user);
    } catch (err) {
      console.error(err);
      setMessage({
        type: 'danger',
        text: err.response?.data?.message || 'Failed to update profile.'
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark text-white">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '32px',
      color: '#ffffff',
      backgroundColor: '#1e1e24',
      minHeight: '100vh',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#ffffff' }}>Account Profile</h1>
          <p style={{ color: '#a0a0a0', margin: 0 }}>View and manage your BuildTrack account credentials and role assignments.</p>
        </div>

        <div style={{
          backgroundColor: '#2a2a35',
          padding: '40px',
          borderRadius: '12px',
          border: '1px solid #3a3a45',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
        }}>
          {message.text && (
            <div className={`alert alert-${message.type} mb-4`} role="alert">
              {message.type === 'success' ? '✓ ' : '⚠️ '}
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-muted" style={{ fontSize: '13px' }}>Full Name</label>
              <input
                type="text"
                className="form-control"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                style={{
                  backgroundColor: '#1e1e24',
                  border: '1px solid #3a3a45',
                  color: '#ffffff',
                  padding: '12px',
                  borderRadius: '6px'
                }}
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-muted" style={{ fontSize: '13px' }}>Email Address</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  backgroundColor: '#1e1e24',
                  border: '1px solid #3a3a45',
                  color: '#ffffff',
                  padding: '12px',
                  borderRadius: '6px'
                }}
              />
            </div>

            <div className="mb-4">
              <label className="form-label text-muted" style={{ fontSize: '13px' }}>Assigned Platform Role</label>
              <input
                type="text"
                className="form-control"
                name="role"
                value={formData.role}
                disabled
                style={{
                  backgroundColor: '#202028',
                  border: '1px solid #2d2d38',
                  color: '#808090',
                  padding: '12px',
                  borderRadius: '6px',
                  cursor: 'not-allowed'
                }}
              />
              <div className="form-text text-muted" style={{ fontSize: '11px', marginTop: '6px' }}>
                Role-based access permissions are managed by system administrators.
              </div>
            </div>

            <button
              type="submit"
              disabled={updating}
              style={{
                width: '100%',
                backgroundColor: updating ? 'rgba(0, 208, 83, 0.5)' : '#00d053',
                color: '#1e1e24',
                border: 'none',
                padding: '12px',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: updating ? 'default' : 'pointer',
                transition: 'background-color 0.2s',
                outline: 'none'
              }}
            >
              {updating ? 'Saving Profile...' : 'Save Profile Details'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
