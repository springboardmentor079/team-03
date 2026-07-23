import { useState } from 'react';
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      const { token, user } = response.data;
      
      // Save token in localStorage
      localStorage.setItem('token', token);
      
      // Update the AuthContext state (which also saves user in localStorage)
      login(user);

      // Extract user's role and redirect to their specific dashboard
      const role = user.role;
      switch (role) {
        case 'Administrator':
          navigate('/dashboard/admin');
          break;
        case 'Project Manager':
          navigate('/dashboard/pm');
          break;
        case 'Site Engineer':
          navigate('/dashboard/engineer');
          break;
        case 'Contractor':
          navigate('/dashboard/contractor');
          break;
        case 'Worker':
          navigate('/dashboard/worker');
          break;
        case 'Client':
          navigate('/dashboard/client');
          break;
        default:
          navigate('/dashboard');
          break;
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert(error.response?.data?.message || 'Invalid credentials or server error');
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-sm p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold" style={{ color: '#00c938' }}>BuildTrack</h2>
          <p className="text-muted">Sign in to your account</p>
        </div>

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