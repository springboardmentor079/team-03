import  { useState } from 'react';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log('Registration submitted:', formData);
    // TODO: Add Axios POST request to /api/auth/register here
    // If successful, navigate('/login')
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="card shadow-sm p-4" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="text-center mb-4">
          <h2 className="fw-bold" style={{ color: '#00c938' }}>Create Account</h2>
          <p className="text-muted">Join the BuildTrack platform</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Full Name</label>
            <input type="text" className="form-control" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Email address</label>
            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Select Role</label>
            <select className="form-select" name="role" value={formData.role} onChange={handleChange} required>
              <option value="" disabled>Choose your role...</option>
              <option value="Administrator">Administrator</option>
              <option value="Project Manager">Project Manager</option>
              <option value="Site Engineer">Site Engineer</option>
              <option value="Contractor">Contractor</option>
              <option value="Worker">Worker</option>
              <option value="Client">Client</option>
            </select>
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">Password</label>
              <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-4">
              <label className="form-label fw-semibold">Confirm Password</label>
              <input type="password" className="form-control" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
            </div>
          </div>

          <button type="submit" className="btn w-100 text-white fw-bold" style={{ backgroundColor: '#00c938' }}>
            Register
          </button>
        </form>

        <div className="text-center mt-3">
          <small className="text-muted">
            Already have an account? <Link to="/login" style={{ color: '#00c938', textDecoration: 'none' }}>Sign In</Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;