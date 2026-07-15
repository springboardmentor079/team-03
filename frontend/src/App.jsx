
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your page components
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* The default route loads the Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* These routes map to your new forms */}
        <Route path="/login" element={<LoginPage />} />
         <Route path="/register" element={<RegisterPage />} />
         {/* This route maps to the Dashboard page */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;