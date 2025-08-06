import React, { useState } from 'react';
import AuthContainer from './components/auth/AuthContainer';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import { BreadcrumbProvider } from './contexts/BreadcrumbContext';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  const handleAuthenticated = (user: any) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        <AuthContainer onAuthenticated={handleAuthenticated} />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <BreadcrumbProvider>
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
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
              currentUser={currentUser}
              onLogout={handleLogout}
            />
            
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
              <div className="container mx-auto px-6 py-8">
                <Dashboard currentView={currentView} onViewChange={setCurrentView} />
              </div>
            </main>
          </div>
          
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </div>
      </BreadcrumbProvider>
    </ThemeProvider>
  );
}

export default App;