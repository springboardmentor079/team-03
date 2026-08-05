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
            className="btn w-100 text-white fw-bold" 
            style={{ backgroundColor: '#00c938' }}
          >
            Sign In
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            Don't have an account? <Link to="/register" style={{ color: '#00c938', textDecoration: 'none' }}>Sign Up</Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;