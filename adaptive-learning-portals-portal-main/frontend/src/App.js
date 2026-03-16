import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from 'sonner';
import SplashCursor from '@/components/SplashCursor';
import Landing from '@/pages/Landing';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import Dashboard from '@/pages/Dashboard';
import Topics from '@/pages/Topics';
import Study from '@/pages/Study';
import Exam from '@/pages/Exam';
import Results from '@/pages/Results';
import '@/App.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="text-xl text-slate-300">Loading...</div>
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617]">
        <div className="text-xl text-slate-300">Loading...</div>
      </div>
    );
  }
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

function AppRoutes() {
  return (
    <>
      <SplashCursor />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/topics" element={<ProtectedRoute><Topics /></ProtectedRoute>} />
        <Route path="/study/:topicId" element={<ProtectedRoute><Study /></ProtectedRoute>} />
        <Route path="/exam/:topicId" element={<ProtectedRoute><Exam /></ProtectedRoute>} />
        <Route path="/results/:attemptId" element={<ProtectedRoute><Results /></ProtectedRoute>} />
      </Routes>
      <Toaster position="top-right" theme="dark" richColors />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
