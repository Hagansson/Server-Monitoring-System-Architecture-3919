import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { SystemProvider } from './contexts/SystemContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import LogsPage from './pages/LogsPage';
import UsersPage from './pages/UsersPage';
import ServersPage from './pages/ServersPage';
import APIEndpointsPage from './pages/APIEndpointsPage';
import SystemMonitoringPage from './pages/SystemMonitoringPage';
import Layout from './components/layout/Layout';

function App() {
  return (
    <AuthProvider>
      <SystemProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout>
                    <Navigate to="/dashboard" replace />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <DashboardPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/logs" element={
                <ProtectedRoute>
                  <Layout>
                    <LogsPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/users" element={
                <ProtectedRoute requiredRole="admin">
                  <Layout>
                    <UsersPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/servers" element={
                <ProtectedRoute requiredRole="admin">
                  <Layout>
                    <ServersPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/api-endpoints" element={
                <ProtectedRoute>
                  <Layout>
                    <APIEndpointsPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/monitoring" element={
                <ProtectedRoute>
                  <Layout>
                    <SystemMonitoringPage />
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </Router>
      </SystemProvider>
    </AuthProvider>
  );
}

export default App;