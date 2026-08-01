import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Import page components
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
import CreatePurchaseOrderForm from './components/CreatePurchaseOrderForm';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Landing & Auth Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<PasswordReset />} />

        {/* All Dashboard and Protected Routes share the same DashboardLayout */}
        <Route element={<DashboardLayout />}>
          
          {/* Role-specific protected dashboard routes */}
          <Route element={<ProtectedRoute allowedRoles={['Administrator']} />}>
            <Route path="/dashboard/admin" element={<AdminDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['Project Manager']} />}>
            <Route path="/dashboard/pm" element={<ProjectManagerDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['Site Engineer']} />}>
            <Route path="/dashboard/engineer" element={<SiteEngineer />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['Contractor']} />}>
            <Route path="/dashboard/contractor" element={<ContractorDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['Worker']} />}>
            <Route path="/dashboard/worker" element={<WorkerDashboard />} />
          </Route>
          <Route element={<ProtectedRoute allowedRoles={['Client']} />}>
            <Route path="/dashboard/client" element={<ClientDashboard />} />
          </Route>

          {/* Administrator, PM & Site Engineer project & management routes */}
          <Route element={<ProtectedRoute allowedRoles={['Administrator', 'Project Manager', 'Site Engineer']} />}>
            <Route path="/dashboard/projects-list" element={<ProjectList />} />
            <Route path="/dashboard/projects-new" element={<ProjectForm />} />
            <Route path="/dashboard/projects/:id/milestones" element={<MilestoneTracker />} />
            <Route path="/dashboard/projects/:id/inventory" element={<InventoryPage />} />
            <Route path="/dashboard/projects/:id/workforce" element={<WorkforcePage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/inventory/:id" element={<InventoryPage />} />
            <Route path="/workforce" element={<WorkforcePage />} />
            <Route path="/workforce/:id" element={<WorkforcePage />} />

            {/* Added Missing Pages for Navigation */}
            <Route path="/dashboard/resources/allocation" element={<ResourceAllocation />} />
            <Route path="/dashboard/resources/equipment" element={<EquipmentTracking />} />
            <Route path="/dashboard/resources/utilization" element={<ResourceUtilization />} />
            
            <Route path="/dashboard/inventory/materials" element={<MaterialInventory />} />
            <Route path="/dashboard/inventory/stock" element={<StockMonitoring />} />
            <Route path="/dashboard/inventory/procurement" element={<ProcurementRequest />} />
            
            <Route path="/dashboard/workforce/management" element={<WorkerManagement />} />
            <Route path="/dashboard/workforce/attendance" element={<AttendanceTracking />} />
            <Route path="/dashboard/workforce/shifts" element={<ShiftScheduling />} />
            
            <Route path="/dashboard/analytics/budget" element={<BudgetAnalytics />} />
            <Route path="/dashboard/analytics/progress" element={<ProjectProgress />} />
            <Route path="/dashboard/analytics/resources" element={<ResourceAnalytics />} />
            <Route path="/dashboard/analytics/procurement" element={<ProcurementAnalytics />} />
          </Route>
          
        </Route>

        {/* Catch-all redirect to Landing Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;