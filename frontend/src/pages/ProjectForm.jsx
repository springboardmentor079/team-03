import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createProject } from '../services/projectService';

const ProjectForm = () => {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    budget: '',
    category: ''
  });

  // UI States
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    // Additional Date Validation
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      setErrorMessage('End Date cannot be earlier than Start Date.');
      return;
    }

    // Budget validation
    if (Number(formData.budget) <= 0) {
      setErrorMessage('Budget must be a positive number.');
      return;
    }

    try {
      setIsSubmitting(true);
      await createProject(formData);
      // Success, route back to the project list page
      navigate('/dashboard/projects-list');
    } catch (err) {
      setErrorMessage('An error occurred while creating the project. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#f8fafc', minHeight: '85vh' }}>
      
      {/* Dynamic transition styles */}
      <style>{`
        .form-card {
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          background: #ffffff;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
        }
        .form-control:focus, .form-select:focus {
          border-color: #00c938;
          box-shadow: 0 0 0 0.25rem rgba(0, 201, 56, 0.15);
        }
        .submit-btn {
          background-color: #00c938;
          border-color: #00c938;
          transition: all 0.2s ease;
        }
        .submit-btn:hover:not(:disabled) {
          background-color: #00b031;
          border-color: #00b031;
          transform: translateY(-1px);
        }
      `}</style>

      {/* Header and Back Link */}
      <div className="mb-4 pb-3 border-bottom d-flex align-items-center gap-3">
        <Link to="/dashboard/projects-list" className="btn btn-outline-secondary btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px' }}>
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div>
          <h1 className="h3 fw-bold text-dark mb-0">Create New Project</h1>
          <p className="text-secondary mb-0">Specify project particulars, scheduled deadlines, and capital budget details.</p>
        </div>
      </div>

      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="card form-card p-4 p-md-5">
            
            {/* Error Message banner */}
            {errorMessage && (
              <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center mb-4" role="alert">
                <svg className="bi flex-shrink-0 me-2" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                </svg>
                <div>{errorMessage}</div>
                <button type="button" className="btn-close" onClick={() => setErrorMessage('')} aria-label="Close"></button>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className={validated ? 'was-validated' : ''}>
              
              {/* Row 1: Title and Category */}
              <div className="row g-4 mb-4">
                <div className="col-12 col-md-7">
                  <label htmlFor="title" className="form-label fw-semibold text-dark">Project Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="form-control form-control-lg text-dark bg-white"
                    placeholder="e.g., Downtown Tower Phase 1"
                    required
                  />
                  <div className="invalid-feedback">
                    Please provide a valid project title.
                  </div>
                </div>

                <div className="col-12 col-md-5">
                  <label htmlFor="category" className="form-label fw-semibold text-dark">Category</label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-select form-select-lg text-dark bg-white"
                    required
                  >
                    <option value="" disabled>Choose Category...</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Government Projects">Government Projects</option>
                  </select>
                  <div className="invalid-feedback">
                    Please select a project category.
                  </div>
                </div>
              </div>

              {/* Row 2: Description */}
              <div className="mb-4">
                <label htmlFor="description" className="form-label fw-semibold text-dark">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-control text-dark bg-white"
                  rows="4"
                  placeholder="Provide details about scope of work, project site coordinates, structural specifics, etc."
                  required
                ></textarea>
                <div className="invalid-feedback">
                  Please write a short project description.
                </div>
              </div>

              {/* Row 3: Start Date & End Date */}
              <div className="row g-4 mb-4">
                <div className="col-12 col-md-6">
                  <label htmlFor="startDate" className="form-label fw-semibold text-dark">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="form-control form-control-lg text-dark bg-white"
                    required
                  />
                  <div className="invalid-feedback">
                    Please choose a start date.
                  </div>
                </div>

                <div className="col-12 col-md-6">
                  <label htmlFor="endDate" className="form-label fw-semibold text-dark">Estimated End Date</label>
                  <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="form-control form-control-lg text-dark bg-white"
                    required
                  />
                  <div className="invalid-feedback">
                    Please choose an estimated completion date.
                  </div>
                </div>
              </div>

              {/* Row 4: Budget */}
              <div className="mb-5">
                <label htmlFor="budget" className="form-label fw-semibold text-dark">Capital Budget (USD)</label>
                <div className="input-group input-group-lg">
                  <span className="input-group-text bg-light text-secondary border-end-0">$</span>
                  <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    className="form-control text-dark bg-white border-start-0 ps-1"
                    placeholder="e.g., 5000000"
                    min="1"
                    required
                  />
                  <div className="invalid-feedback">
                    Please enter a valid positive budget amount.
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="d-flex flex-column flex-sm-row justify-content-end gap-3 mt-5">
                <Link to="/dashboard/projects-list" className="btn btn-light btn-lg px-4 py-2.5 text-secondary border fw-semibold">
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-success submit-btn btn-lg px-5 py-2.5 fw-bold text-white d-flex align-items-center justify-content-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Saving Project...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      Submit Project
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectForm;
