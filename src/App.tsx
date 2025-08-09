import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthContainer from './components/auth/AuthContainer';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import { BreadcrumbProvider } from './contexts/BreadcrumbContext';
import { ThemeProvider } from './contexts/ThemeContext';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  const handleLogout = () => {
    logout();
    setCurrentView('dashboard');
  };

  if (!isAuthenticated) {
    return <AuthContainer />;
  }

  return (
    <BreadcrumbProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200 safe-area-inset">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onNavigate={(view) => {
            setCurrentView(view);
            setSidebarOpen(false);
          }}
        />
        
        <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-0' : 'lg:ml-0'
        }`}>
          <Header 
            onMenuClick={() => setSidebarOpen(true)} 
            currentUser={user}
            onLogout={handleLogout}
          />
          
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200 safe-area-bottom">
            <div className="container mx-auto px-3 sm:px-6 py-4 sm:py-8">
              <Dashboard currentView={currentView} onViewChange={setCurrentView} />
            </div>
          </main>
        </div>
        
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden touch-manipulation"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </BreadcrumbProvider>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;