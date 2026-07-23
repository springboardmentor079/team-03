// import React from 'react';
import './LandingPage.css';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="landing-page-container">
      {/* 2. Left Panel (Fixed Sidebar) */}
      <aside className="left-panel">
        {/* Top: Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
              <line x1="15" y1="3" x2="15" y2="21" />
              <line x1="3" y1="9" x2="21" y2="9" />
              <line x1="3" y1="15" x2="21" y2="15" />
            </svg>
          </div>
          <span>BuildTrack</span>
        </div>

        {/* Middle: Content */}
        <div className="sidebar-content">
          <h1>Manage every project. On time. On budget.</h1>
          <p className="sidebar-description">
            BuildTrack simplifies project planning, resource scheduling, and budget tracking for modern construction teams. Streamline operations from groundbreaking to handover.
          </p>
        </div>

        {/* Bottom: Statistics */}
        <div className="sidebar-stats">
          <div className="stat-item">
            <span className="stat-number">2,400+</span>
            <span className="stat-label">Active projects</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">98%</span>
            <span className="stat-label">On-time delivery rate</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">340+</span>
            <span className="stat-label">Construction firms</span>
          </div>
        </div>
      </aside>

      {/* 3. Right Panel (Scrollable Content) */}
      <main className="right-panel">
        
        {/* 4. Right Panel - Top Navbar */}
        <header className="top-navbar">
          <nav className="nav-links">
            <a href="#home" className="nav-link">Home</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#contact" className="nav-link">Contact</a>
          </nav>
          <div className="nav-actions">
            <Link to="/login" className="btn btn-signin" id="nav-btn-signin">Sign In</Link>
            <Link to="/register" className="btn btn-signup" id="nav-btn-signup">Sign Up</Link>
          </div>
        </header>

        {/* 5. Right Panel - Section 1 (Hero / #home) */}
        <section id="home" className="hero-section">
          <div className="hero-content">
            <span className="hero-subtitle">Construction & Project Management</span>
            <h2 className="hero-title">Best Works</h2>
            <p className="hero-description">
              Realize your vision with field-tested workflows and real-time project insights. We coordinate complex schedules, track assets, and deliver clarity at every stage of development.
            </p>
          </div>
        </section>

        {/* 6. Right Panel - Section 2 (About / #about) */}
        <section id="about" className="about-section">
          <div className="section-header">
            <span className="section-label">Who We Are</span>
            <h2 className="section-title">About Best Works</h2>
            <div className="green-underline"></div>
          </div>
          <div className="about-content">
            <p className="about-text">
              At <strong>Best Works</strong>, we are redefining modern project construction by integrating field operations with advanced analytics. With over a decade of industry expertise, we build robust infrastructure while maintaining absolute control over budget and timeline metrics.
            </p>
            <p className="about-text">
              Our unified management system acts as a single source of truth, facilitating collaboration between developers, general contractors, and subcontractors. We ensure high-fidelity reporting, proactive risk mitigation, and compliance with the most rigorous environmental and safety standards.
            </p>
          </div>
        </section>

        {/* 7. Right Panel - Section 3 (Contact / #contact) */}
        <section id="contact" className="contact-section">
          <div className="section-header">
            <span className="section-label">Get in Touch</span>
            <h2 className="section-title">Contact Us</h2>
            <div className="green-underline"></div>
          </div>
          
          {/* Flexbox grid containing two white contact cards */}
          <div className="contact-grid">
            
            {/* Phone Card */}
            <div className="contact-card" id="contact-card-phone">
              <div className="card-icon-container">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div className="card-info">
                <h3 className="card-title">Call Our Offices</h3>
                <p className="card-description">
                  Reach out directly to speak with our project leads and support team members.
                </p>
              </div>
              <a href="tel:+18005550199" className="card-link">
                +1 (800) 555-0199
              </a>
            </div>

            {/* Email Card */}
            <div className="contact-card" id="contact-card-email">
              <div className="card-icon-container">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div className="card-info">
                <h3 className="card-title">Send An Email</h3>
                <p className="card-description">
                  Drop us a note anytime and we will respond to you within 24 business hours.
                </p>
              </div>
              <a href="mailto:support@buildtrack.com" className="card-link">
                support@buildtrack.com
              </a>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}