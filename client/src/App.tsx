import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CreatorLayout } from './components/layout/CreatorLayout';
import { AdminLayout } from './components/layout/AdminLayout';
import { MobileFrameWrapper } from './components/layout/MobileFrameWrapper';
import { SplashScreen } from './components/common/SplashScreen';

// User Pages
import { HomeFeed } from './pages/user/HomeFeed';
import { ReelsPage } from './pages/user/ReelsPage';
import { ExplorePage } from './pages/user/ExplorePage';
import { ProfilePage } from './pages/user/ProfilePage';
import { SubscriptionsPage } from './pages/user/SubscriptionsPage';
import { SavedLikedHistoryPage } from './pages/user/SavedLikedHistoryPage';
import { CreatorApplyPage } from './pages/user/CreatorApplyPage';

// Auth Pages
import { WelcomeGatewayPage } from './pages/auth/WelcomeGatewayPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Creator Pages
import { StudioDashboard } from './pages/creator/StudioDashboard';
import { StudioContent } from './pages/creator/StudioContent';
import { StudioUpload } from './pages/creator/StudioUpload';
import { StudioAnalytics } from './pages/creator/StudioAnalytics';
import { StudioEarnings } from './pages/creator/StudioEarnings';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminModeration } from './pages/admin/AdminModeration';
import { AdminApplications } from './pages/admin/AdminApplications';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminPayouts } from './pages/admin/AdminPayouts';
import { AdminReports } from './pages/admin/AdminReports';

import { useAuth } from './contexts/AuthContext';

// Protected Route Guards
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles
}) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#090a0f]">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/welcome" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role) && user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Standard User Shell Layout with Mobile Smartphone Frame on Desktop
const UserShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <MobileFrameWrapper>{children}</MobileFrameWrapper>;
};

export const App: React.FC = () => {
  const { user, loading } = useAuth();
  const [showSplash, setShowSplash] = useState<boolean>(true);

  return (
    <div className="relative w-full h-full min-h-screen bg-[#07090e]">
      {/* App Opening Splash Screen */}
      {showSplash && (
        <div className="fixed inset-0 z-50 flex flex-col bg-[#090a0f] overflow-hidden">
          <SplashScreen onFinish={() => setShowSplash(false)} durationMs={2000} />
        </div>
      )}

      <Routes>
        {/* Gateway Welcome Route: User Login vs Influencer Login */}
        <Route
          path="/welcome"
          element={
            <UserShell>
              <WelcomeGatewayPage />
            </UserShell>
          }
        />

        {/* Public & User Routes */}
        <Route
          path="/"
          element={
            <UserShell>
              {!user && !loading ? <WelcomeGatewayPage /> : <HomeFeed />}
            </UserShell>
          }
        />
        <Route
          path="/feed"
          element={
            <UserShell>
              <HomeFeed />
            </UserShell>
          }
        />
        <Route
          path="/reels"
          element={
            <UserShell>
              <ReelsPage />
            </UserShell>
          }
        />
        <Route
          path="/explore"
          element={
            <UserShell>
              <ExplorePage />
            </UserShell>
          }
        />
        <Route
          path="/profile/:username"
          element={
            <UserShell>
              <ProfilePage />
            </UserShell>
          }
        />
        <Route
          path="/subscriptions"
          element={
            <UserShell>
              <SubscriptionsPage />
            </UserShell>
          }
        />
        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <UserShell>
                <SavedLikedHistoryPage defaultTab="saved" />
              </UserShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/liked"
          element={
            <ProtectedRoute>
              <UserShell>
                <SavedLikedHistoryPage defaultTab="liked" />
              </UserShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/history"
          element={
            <ProtectedRoute>
              <UserShell>
                <SavedLikedHistoryPage defaultTab="history" />
              </UserShell>
            </ProtectedRoute>
          }
        />
        <Route
          path="/creator-apply"
          element={
            <UserShell>
              <CreatorApplyPage />
            </UserShell>
          }
        />

        {/* Authentication Routes */}
        <Route
          path="/login"
          element={
            <UserShell>
              <LoginPage />
            </UserShell>
          }
        />
        <Route
          path="/register"
          element={
            <UserShell>
              <RegisterPage />
            </UserShell>
          }
        />

        {/* Creator Studio Routes */}
        <Route
          path="/creator"
          element={
            <ProtectedRoute allowedRoles={['CREATOR', 'ADMIN']}>
              <CreatorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/creator/dashboard" replace />} />
          <Route path="dashboard" element={<StudioDashboard />} />
          <Route path="content" element={<StudioContent />} />
          <Route path="upload" element={<StudioUpload />} />
          <Route path="analytics" element={<StudioAnalytics />} />
          <Route path="earnings" element={<StudioEarnings />} />
        </Route>

        {/* Admin Control Center Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="moderation" element={<AdminModeration />} />
          <Route path="applications" element={<AdminApplications />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="payouts" element={<AdminPayouts />} />
          <Route path="reports" element={<AdminReports />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};
