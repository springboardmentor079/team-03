import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute'; // Import the guard
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import PasswordReset from './pages/PasswordReset';
import DashboardLayout from './components/DashboardLayout';
import AdminDashboard from './pages/AdminDashboard';
import ProjectManagerDashboard from './pages/ProjectManagerDashboard';
import SiteEngineer from './pages/SiteEngineer';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<PasswordReset />} />

        {/* PROTECTED DASHBOARD ROUTES */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          
          {/* Only Admins can access this */}
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
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

          {/* Add similar blocks for Contractor, Client, and Worker */}

        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;