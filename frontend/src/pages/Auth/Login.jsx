import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth'; // Ensure this matches your context file path

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hoverLink, setHoverLink] = useState(false);

  // Initialize context and navigation
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // ==========================================
      // REAL BACKEND CONNECTION (Commented out for now)
      // ==========================================
      // const response = await axios.post('http://localhost:5000/api/users/login', {
      //   email,
      //   password
      // });
      // const { token, user } = response.data;
      // localStorage.setItem('token', token);
      // login(user);
      
      // ==========================================
      // SIMULATED LOGIN (Active for frontend testing)
      // ==========================================
      const dummyUser = { 
        name: 'Sasimaran', 
        email: email, 
        role: 'Admin' // Change this to 'Project Manager', 'Site Engineer', etc. to test different views
      };
      
      login(dummyUser); 
      
      // Redirect the user to their protected dashboard based on role
      if (dummyUser.role === 'Admin') {
        navigate('/dashboard/admin');
      } else if (dummyUser.role === 'Project Manager') {
        navigate('/dashboard/pm');
      } else if (dummyUser.role === 'Site Engineer') {
        navigate('/dashboard/engineer');
      } else {
        navigate('/dashboard'); // Fallback route
      }
      
    } catch (error) {
      console.error("Login failed:", error);
      alert(error.response?.data?.message || "An error occurred during login");
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
        {/* Title */}
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 8px 0', color: '#ffffff', textAlign: 'center' }}>Welcome to BuildTrack</h2>
        <p style={{ color: '#a0a0a0', fontSize: '14px', margin: '0 0 32px 0', textAlign: 'center' }}>Sign in to access your dashboard roster.</p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', color: '#a0a0a0', marginBottom: '8px' }}>Email Address *</label>
            <input
              type="email"
              required
              placeholder="e.g. sasimaran@example.com"
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