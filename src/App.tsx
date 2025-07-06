import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthWrapper from './components/Auth/AuthWrapper';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import ClientsList from './components/Clients/ClientsList';
import LeadsList from './components/Leads/LeadsList';
import TaskBoard from './components/Tasks/TaskBoard';
import InvoicesList from './components/Invoices/InvoicesList';
import CalendarView from './components/Calendar/CalendarView';
import ReportsSection from './components/Reports/ReportsSection';
import ProfileSection from './components/Profile/ProfileSection';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeItem, setActiveItem] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthWrapper />;
  }

  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return <Dashboard />;
      case 'clients':
        return <ClientsList />;
      case 'leads':
        return <LeadsList />;
      case 'tasks':
        return <TaskBoard />;
      case 'invoices':
        return <InvoicesList />;
      case 'calendar':
        return <CalendarView />;
      case 'time-tracking':
        return <div className="p-6"><h1 className="text-2xl font-bold">Time Tracking - Coming Soon</h1></div>;
      case 'reports':
        return <ReportsSection />;
      case 'profile':
        return <ProfileSection />;
      case 'settings':
        return <div className="p-6"><h1 className="text-2xl font-bold">Settings - Coming Soon</h1></div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;