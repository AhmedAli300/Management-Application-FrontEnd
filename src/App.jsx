import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import LoadingSpinner from './components/LoadingSpinner/LoadingSpinner';
import './App.css';


const Login = lazy(() => import('./pages/Login/Login'));
const Register = lazy(() => import('./pages/Register/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const ProjectBoard = lazy(() => import('./pages/ProjectBoard/ProjectBoard'));
const UpdatePassword = lazy(() => import('./pages/UpdatePassword/UpdatePassword'));
const NotFound = lazy(() => import('./pages/NotFound/NotFound'));

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
                fontSize: '0.9rem'
              }
            }}
          />
          <div className="d-flex flex-column min-vh-100 bg-light-subtle page-fade">
            <Navbar />
            <main className="flex-grow-1">
              <Suspense fallback={<LoadingSpinner message="Loading application..." />}>
                <Routes>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/project/:id"
                    element={
                      <ProtectedRoute>
                        <ProjectBoard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/update-password"
                    element={
                      <ProtectedRoute>
                        <UpdatePassword />
                      </ProtectedRoute>
                    }
                  />

                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
