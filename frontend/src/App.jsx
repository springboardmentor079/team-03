import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// 1. Import your Landing Page and Auth components with CORRECT paths
import LandingPage from './pages/LandingPage';
import Login from './pages/LoginPage';       // Corrected path and filename
import Register from './pages/RegisterPage'; // Corrected path and filename

// Double check if PasswordReset is actually inside the Auth folder. 
// If it is directly in pages like the others, change this to './pages/PasswordReset'
import PasswordReset from './pages/Auth/PasswordReset'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 2. Set LandingPage to render at the root URL "/" */}
        <Route path="/" element={<LandingPage />} />
        
        {/* 3. Set up your Authentication routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<PasswordReset />} />

        {/* 4. Catch-all: Redirect any unknown URLs back to the landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;