import React, { useState } from 'react';
import { useAuth } from './store/AuthContext.js';
import { LoginPage } from './pages/LoginPage.js';
import { DashboardShell } from './components/layout/DashboardShell.js';
import { StudentDashboard } from './pages/StudentDashboard.js';
import { WardenDashboard } from './pages/WardenDashboard.js';
import { StaffDashboard } from './pages/StaffDashboard.js';
import { AdminDashboard } from './pages/AdminDashboard.js';

export const App: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 animate-ping opacity-75" />
        <p className="text-xs font-semibold text-slate-400">Loading HostelHub Workspace...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const renderRoleDashboard = () => {
    switch (user.role) {
      case 'STUDENT':
        return <StudentDashboard activeTab={activeTab} />;
      case 'WARDEN':
        return <WardenDashboard activeTab={activeTab} />;
      case 'STAFF':
        return <StaffDashboard activeTab={activeTab} />;
      case 'ADMIN':
        return <AdminDashboard activeTab={activeTab} />;
      default:
        return <StudentDashboard activeTab={activeTab} />;
    }
  };

  return (
    <DashboardShell activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderRoleDashboard()}
    </DashboardShell>
  );
};

export default App;
