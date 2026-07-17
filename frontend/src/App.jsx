import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute'; // Import the guard
import LandingPage from './pages/LandingPage';
import Login from "./pages/LoginPage";
import Register from "./pages/RegisterPage";
import PasswordReset from './pages/Auth/PasswordReset';
import DashboardLayout from './components/DashboardLayout';
import AdminDashboard from './pages/Dashboards/AdminDashboard';
import ProjectManagerDashboard from './pages/Dashboards/ProjectManager';
import SiteEngineer from './pages/Dashboards/SiteEngineer';
import ContractorDashboard from './pages/Dashboards/ContractorDashboard';
import WorkerDashboard from './pages/Dashboards/WorkerDasshboard';
import ClientDashboard from './pages/Dashboards/ClientDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route path="/unauthorized" element={
          <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark text-white text-center">
            <div>
              <h1 className="display-4 fw-bold text-danger mb-3">403 - Unauthorized Access</h1>
              <p className="lead mb-4">You do not have the required permissions to view this dashboard.</p>
              <Link to="/login" className="btn btn-outline-light">Back to Login</Link>
            </div>
          </div>
        } />

        {/* PROTECTED DASHBOARD ROUTES */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          
          {/* Only Admins can access this */}
          <Route element={<ProtectedRoute allowedRoles={['Administrator']} />}>
            <Route path="admin" element={<AdminDashboard />} />
            {/* Add other Admin-only routes here */}
          </Route>

          {/* Only Project Managers can access this */}
          <Route element={<ProtectedRoute allowedRoles={['Project Manager']} />}>
            <Route path="pm" element={<ProjectManagerDashboard />} />
          </Route>

          {/* Only Site Engineers can access this */}
          <Route element={<ProtectedRoute allowedRoles={['Site Engineer']} />}>
            <Route path="engineer" element={<SiteEngineer />} />
          </Route>

          {/* Only Contractors can access this */}
          <Route element={<ProtectedRoute allowedRoles={['Contractor']} />}>
            <Route path="contractor" element={<ContractorDashboard />} />
          </Route>

          {/* Only Workers can access this */}
          <Route element={<ProtectedRoute allowedRoles={['Worker']} />}>
            <Route path="worker" element={<WorkerDashboard />} />
          </Route>

          {/* Only Clients can access this */}
          <Route element={<ProtectedRoute allowedRoles={['Client']} />}>
            <Route path="client" element={<ClientDashboard />} />
          </Route>

        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;