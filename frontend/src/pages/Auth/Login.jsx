import { useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hoverLink, setHoverLink] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Logged in with email: ${email}`);
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
        {/* Title */}
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#ffffff', textAlign: 'center' }}>Welcome to BuildTrack</h2>
        <p style={{ color: '#a0a0a0', fontSize: '14px', margin: '0 0 32px 0', textAlign: 'center' }}>Sign in to access your dashboard roster.</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#a0a0a0', marginBottom: '8px' }}>Email Address *</label>
            <input
              type="email"
              required
              placeholder="e.g. john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#1e1e24',
                border: '1px solid #3a3a45',
                borderRadius: '6px',
                padding: '12px 14px',
                color: '#ffffff',
                outline: 'none',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ display: 'block', fontSize: '13px', color: '#a0a0a0', margin: 0 }}>Password *</label>
              
              <Link
                to="/reset-password"
                onMouseEnter={() => setHoverLink(true)}
                onMouseLeave={() => setHoverLink(false)}
                style={{
                  fontSize: '13px',
                  color: hoverLink ? '#00d053' : '#a0a0a0',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  fontWeight: '500'
                }}
              >
                Forgot Password?
              </Link>
            </div>
            
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                backgroundColor: '#1e1e24',
                border: '1px solid #3a3a45',
                borderRadius: '6px',
                padding: '12px 14px',
                color: '#ffffff',
                outline: 'none',
                fontSize: '14px'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#00d053',
              color: '#1e1e24',
              border: 'none',
              padding: '12px',
              borderRadius: '6px',
              fontWeight: 'bold',
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              outline: 'none'
            }}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
