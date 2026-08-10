import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Import layout components synchronously
import DashboardLayout from './components/DashboardLayout';

// Production Code-Splitting via React.lazy
const LandingPage = lazy(() => import('./pages/LandingPage'));
const Login = lazy(() => import('./pages/LoginPage'));
const Register = lazy(() => import('./pages/RegisterPage'));
const PasswordReset = lazy(() => import('./pages/Auth/PasswordReset'));

const AdminDashboard = lazy(() => import('./pages/Dashboards/AdminDashboard'));
const ProjectManagerDashboard = lazy(() => import('./pages/Dashboards/ProjectManager'));
const SiteEngineer = lazy(() => import('./pages/Dashboards/SiteEngineer'));
const ContractorDashboard = lazy(() => import('./pages/Dashboards/ContractorDashboard'));
const WorkerDashboard = lazy(() => import('./pages/Dashboards/WorkerDasshboard'));
const ClientDashboard = lazy(() => import('./pages/Dashboards/ClientDashboard'));

const ResourceAllocation = lazy(() => import('./pages/Resource/ResourceAllocation'));
const EquipmentTracking = lazy(() => import('./pages/Resource/EquipmentTracking'));
const ResourceUtilization = lazy(() => import('./pages/Resource/ResourceUtilization'));
const MaterialInventory = lazy(() => import('./pages/Inventory/MaterialInventory'));
const StockMonitoring = lazy(() => import('./pages/Inventory/StockMonitory'));
const ProcurementRequest = lazy(() => import('./pages/Inventory/ProcurementRequest'));
const WorkerManagement = lazy(() => import('./pages/Workforce/Workermanagement'));
const AttendanceTracking = lazy(() => import('./pages/Workforce/AttendenceTracking'));
const ShiftScheduling = lazy(() => import('./pages/Workforce/ShiftScheduling'));
const BudgetAnalytics = lazy(() => import('./pages/Analytics/BudgetAnalytics'));
const ProjectProgress = lazy(() => import('./pages/Analytics/ProjectProgress'));
const ResourceAnalytics = lazy(() => import('./pages/Analytics/ResourceAnalytics'));
const ProcurementAnalytics = lazy(() => import('./pages/Analytics/ProcurementAnalytics'));
const ProjectList = lazy(() => import('./pages/ProjectList'));
const ProjectForm = lazy(() => import('./pages/ProjectForm'));
const MilestoneTracker = lazy(() => import('./pages/MilestoneTracker'));
const InventoryPage = lazy(() => import('./pages/InventoryPage'));
const WorkforcePage = lazy(() => import('./pages/WorkforcePage'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const DocumentPage = lazy(() => import('./pages/DocumentPage'));

const PageLoader = () => (
  <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
    <div className="text-center">
      <div className="spinner-border text-success" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3 text-muted fw-semibold" style={{ fontSize: '14px' }}>Loading BuildTrack Module...</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
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

            <Route path="/dashboard/reports" element={<ReportsPage />} />
            <Route path="/dashboard/documents" element={<DocumentPage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/documents" element={<DocumentPage />} />
          </Route>
          
        </Route>

        {/* Catch-all redirect to Landing Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
    </Router>
  );
}

export default App;