
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your page components
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* The default route loads the Landing Page */}
        <Route path="/" element={<LandingPage />} />
        
        {/* These routes map to your new forms */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;