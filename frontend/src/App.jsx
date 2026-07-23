
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Import your page components
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

// Remaining Screens
import ProjectListing from './pages/Projects/ProjectListing';
import ProjectDetails from './pages/Projects/ProjectDetails';
import MilestoneTracking from './pages/Projects/MilestoneTracking';
import ProjectStatus from './pages/Projects/ProjectStatus';
import ResourceAllocation from './pages/Resource/ResourceAllocation';
import EquipmentTracking from './pages/Resource/EquipmentTracking';
import ResourceUtilization from './pages/Resource/ResourceUtilization';
import MaterialInventory from './pages/Inventory/MaterialInventory';
import StockMonitoring from './pages/Inventory/StockMonitory';
import ProcurementRequest from './pages/Inventory/ProcurementRequest';
import WorkerManagement from './pages/Workforce/Workermanagement';
import AttendanceTracking from './pages/Workforce/AttendenceTracking';
import ShiftScheduling from './pages/Workforce/ShiftScheduling';
import BudgetAnalytics from './pages/Analytics/BudgetAnalytics';
import ProjectProgress from './pages/Analytics/ProjectProgress';
import ResourceAnalytics from './pages/Analytics/ResourceAnalytics';
import ProcurementAnalytics from './pages/Analytics/ProcurementAnalytics';
import Profile from './pages/Profile';
import ProjectList from './pages/ProjectList';
import ProjectForm from './pages/ProjectForm';
import MilestoneTracker from './pages/MilestoneTracker';
import InventoryPage from './pages/InventoryPage';
import WorkforcePage from './pages/WorkforcePage';

function App() {
  return (
    <Router>
      <Routes>
        {/* The default route loads the Inventory Management Page directly */}
        <Route path="/" element={<InventoryPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/inventory/:id" element={<InventoryPage />} />
        <Route path="/workforce" element={<WorkforcePage />} />
        <Route path="/workforce/:id" element={<WorkforcePage />} />
        <Route path="/dashboard/projects-new" element={<ProjectForm />} />
        <Route path="/dashboard/projects-list" element={<ProjectList />} />
        <Route path="/dashboard/projects/:id/milestones" element={<MilestoneTracker />} />
        <Route path="/dashboard/projects/:id/inventory" element={<InventoryPage />} />
        <Route path="/dashboard/projects/:id/workforce" element={<WorkforcePage />} />

        {/* Commented out original routes temporarily
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

        <Route path="/dashboard" element={<DashboardLayout />}>

          <Route element={<ProtectedRoute allowedRoles={['Administrator']} />}>
            <Route path="admin" element={<AdminDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['Project Manager']} />}>
            <Route path="pm" element={<ProjectManagerDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['Site Engineer']} />}>
            <Route path="engineer" element={<SiteEngineer />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['Contractor']} />}>
            <Route path="contractor" element={<ContractorDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['Worker']} />}>
            <Route path="worker" element={<WorkerDashboard />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['Client']} />}>
            <Route path="client" element={<ClientDashboard />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<Profile />} />
            <Route path="projects" element={<ProjectListing />} />
            <Route path="projects-list" element={<ProjectList />} />
            <Route path="projects-new" element={<ProjectForm />} />
            <Route path="projects/:id" element={<ProjectDetails />} />
            <Route path="projects/milestones" element={<MilestoneTracking />} />
            <Route path="projects/status" element={<ProjectStatus />} />
            <Route path="resources/allocation" element={<ResourceAllocation />} />
            <Route path="resources/equipment" element={<EquipmentTracking />} />
            <Route path="resources/utilization" element={<ResourceUtilization />} />
            <Route path="inventory" element={<MaterialInventory />} />
            <Route path="inventory/stock" element={<StockMonitoring />} />
            <Route path="inventory/procurement" element={<ProcurementRequest />} />
            <Route path="workforce/workers" element={<WorkerManagement />} />
            <Route path="workforce/attendance" element={<AttendanceTracking />} />
            <Route path="workforce/shifts" element={<ShiftScheduling />} />
            <Route path="analytics/budget" element={<BudgetAnalytics />} />
            <Route path="analytics/progress" element={<ProjectProgress />} />
            <Route path="analytics/resources" element={<ResourceAnalytics />} />
            <Route path="analytics/procurement" element={<ProcurementAnalytics />} />
          </Route>

        </Route>
        */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;