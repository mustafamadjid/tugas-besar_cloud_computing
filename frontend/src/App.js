import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';
import Navbar from './components/Navbar';

// Pages
import AuthSelectionPage from './pages/AuthSelectionPage';
import LandingPage from './pages/LandingPage';
import EventDetailPage from './pages/EventDetailPage';
import EventsPage from './pages/EventsPage'; // This was previously removed, adding it back

// Buyer Pages
import BrowseEventsPage from './pages/buyer/BrowseEventsPage';
import BuyerLoginPage from './pages/buyer/BuyerLoginPage';
import MyTicketsPage from './pages/buyer/MyTicketsPage';
import ProfilePage from './pages/buyer/ProfilePage';

// Promoter Pages
import PromoterLoginPage from './pages/promoter/PromoterLoginPage';
import PromoterDashboard from './pages/promoter/PromoterDashboard';
import AtraksiPage from './pages/AtraksiPage';

// Protected Route Component
function ProtectedRoute({ children, requiredRole = null }) {
  const { isAuthenticated, role, loading } = useAuth();


  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<AuthSelectionPage />} />
      <Route path="/login/buyer" element={<BuyerLoginPage />} />
      <Route path="/login/promoter" element={<PromoterLoginPage />} />
      <Route path="/events" element={<BrowseEventsPage />} />
      <Route path="/event/:id" element={<EventDetailPage />} />
      <Route path="/atraksi" element={<AtraksiPage />} />
      
      {/* Buyer Routes */}
      <Route
        path="/my-tickets"
        element={
          <ProtectedRoute requiredRole="BUYER">
            <MyTicketsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute requiredRole="BUYER">
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Promoter Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole="PROMOTER">
            <PromoterDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <main>
          <AppRoutes />
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
