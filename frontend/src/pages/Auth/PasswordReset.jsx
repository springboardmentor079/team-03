import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PasswordReset = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic email validation
    if (!email) {
      setError('Email address is required.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setIsSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      padding: '32px',
      color: '#ffffff',
      backgroundColor: '#1e1e24',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#2a2a35',
        padding: '40px',
        borderRadius: '12px',
        border: '1px solid #3a3a45',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
      }}>
        {isSuccess ? (
          // Success UI
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 208, 83, 0.1)',
              color: '#00d053',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              margin: '0 auto 24px auto'
            }}>
              ✓
            </div>
            
            <h3 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 12px 0' }}>Reset Link Sent</h3>
            <p style={{ color: '#a0a0a0', fontSize: '14px', lineHeight: '1.5', margin: '0 0 28px 0' }}>
              A security password recovery link has been dispatched to <strong>{email}</strong>.
            </p>

            <Link
              to="/login"
              style={{
                display: 'block',
                width: '100%',
                backgroundColor: '#00d053',
                color: '#1e1e24',
                border: 'none',
                padding: '12px',
                borderRadius: '6px',
                fontWeight: 'bold',
                fontSize: '14px',
                textAlign: 'center',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                outline: 'none'
              }}
            >
              Back to Login
            </Link>
          </div>
        ) : (
          // Request Form UI
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', textAlign: 'center' }}>Reset Password</h2>
            <p style={{ color: '#a0a0a0', fontSize: '14px', margin: '0 0 28px 0', textAlign: 'center', lineHeight: '1.5' }}>
              Provide your account email address to receive a recovery reset link.
            </p>

            {error && (
              <div style={{
                backgroundColor: 'rgba(255, 77, 77, 0.1)',
                border: '1px solid #ff4d4d',
                borderRadius: '6px',
                padding: '12px',
                color: '#ff4d4d',
                fontSize: '13px',
                marginBottom: '20px'
              }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#a0a0a0', marginBottom: '8px' }}>Email Address *</label>
                <input
                  type="text"
                  placeholder="e.g. manager@buildtrack.com"
                  value={email}
                  disabled={isSubmitting}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    backgroundColor: '#1e1e24',
                    border: '1px solid #3a3a45',
                    borderRadius: '6px',
                    padding: '12px 14px',
                    color: '#ffffff',
                    outline: 'none',
                    fontSize: '14px',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  backgroundColor: isSubmitting ? 'rgba(0, 208, 83, 0.5)' : '#00d053',
                  color: '#1e1e24',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  cursor: isSubmitting ? 'default' : 'pointer',
                  transition: 'background-color 0.2s',
                  outline: 'none'
                }}
              >
                {isSubmitting ? 'Sending Link...' : 'Send Recovery Link'}
              </button>

              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Link
                  to="/login"
                  style={{
                    fontSize: '13px',
                    color: '#a0a0a0',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                >
                  ← Return to Login
                </Link>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PasswordReset;
