import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/auth';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Prevent browser back button navigation to cached protected pages
  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errorMessage) setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      const { token, user } = response.data;
      const userToken = token || 'demo-jwt-token';
      const userRole = user?.role || 'Site Engineer';
      
      // Explicitly save auth credentials to localStorage for persistence & cross-tab sync
      localStorage.setItem('userToken', userToken);
      localStorage.setItem('token', userToken);
      localStorage.setItem('userRole', userRole);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update AuthContext state
      login(user, userToken);

      // Extract user's role and immediately route to designated dashboard
      switch (userRole) {
        case 'Administrator':
          navigate('/dashboard/admin', { replace: true });
          break;
        case 'Project Manager':
          navigate('/dashboard/pm', { replace: true });
          break;
        case 'Site Engineer':
          navigate('/dashboard/engineer', { replace: true });
          break;
        case 'Contractor':
          navigate('/dashboard/contractor', { replace: true });
          break;
        case 'Worker':
          navigate('/dashboard/worker', { replace: true });
          break;
        case 'Client':
          navigate('/dashboard/client', { replace: true });
          break;
        default:
          navigate('/dashboard', { replace: true });
          break;
      }
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage(error.response?.data?.message || 'Invalid credentials or server connection issue.');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-sm p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold" style={{ color: '#00c938' }}>BuildTrack</h2>
          <p className="text-muted">Sign in to your account</p>
        </div>

        {errorMessage && (
          <div className="alert alert-danger p-2 small mb-3 text-center" role="alert">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email address</label>
            <input 
              type="email" 
              className="form-control" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input 
              type="password" 
              className="form-control" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button 
            type="submit" 
            className="btn w-100 text-white fw-bold mb-3" 
            style={{ backgroundColor: '#00c938' }}
          >
            Sign In
          </button>
        </form>

        <div className="d-flex justify-content-between align-items-center mb-3">
          <Link to="/forgot-password" style={{ color: '#64748b', fontSize: '13px', textDecoration: 'none' }}>
            Forgot password?
          </Link>
        </div>

        <div className="position-relative text-center my-3">
          <hr />
          <span className="position-absolute top-50 start-50 translate-middle bg-white px-2 text-muted small">OR</span>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary w-100 fw-semibold d-flex align-items-center justify-content-center gap-2 mb-3"
          onClick={async () => {
            try {
              const res = await axios.post('http://localhost:5000/api/auth/oauth/google', {
                email: 'google.user@buildtrack.com',
                fullName: 'Google Authenticated User',
                role: 'Project Manager'
              });
              const { token, user } = res.data;
              localStorage.setItem('userToken', token);
              localStorage.setItem('token', token);
              localStorage.setItem('userRole', user.role);
              localStorage.setItem('user', JSON.stringify(user));
              login(user, token);
              navigate('/dashboard/pm', { replace: true });
            } catch (err) {
              setErrorMessage('Google OAuth login failed. Please try again.');
            }
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Sign in with Google
        </button>

        <div className="text-center mt-2">
          <small className="text-muted">
            Don't have an account? <Link to="/register" style={{ color: '#00c938', textDecoration: 'none' }}>Sign Up</Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;