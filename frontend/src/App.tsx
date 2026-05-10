import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/layout/Navbar';
import ThreeBackground from './components/shared/ThreeBackground';
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Marketplace from './pages/Marketplace';
import Dashboard from './pages/Dashboard';
import NoteDetailPage from './pages/NoteDetailPage';
import UploadNote from './pages/UploadNote';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminPortal from './pages/AdminPortal';
import Profile from './pages/Profile';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { token, loading } = useAuth();
  if (loading) return null;
  return token ? <>{children}</> : <Navigate to="/auth" />;
};

function AppRoutes() {
  return (
    <div className="min-h-screen relative">
      <ThreeBackground />
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/admin" element={<PrivateRoute><AdminPortal /></PrivateRoute>} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/note/:id" element={<NoteDetailPage />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/upload" 
          element={
            <PrivateRoute>
              <UploadNote />
            </PrivateRoute>
          } 
        />
      </Routes>
      <Toaster position="bottom-right" toastOptions={{
        className: 'glass font-bold text-sm rounded-2xl',
        duration: 4000,
      }} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
