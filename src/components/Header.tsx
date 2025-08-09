import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Menu, Bell, User, LogOut, Sun, Moon, Shield } from 'lucide-react';
import { useBreadcrumb } from '../contexts/BreadcrumbContext';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  onMenuClick: () => void;
  currentUser?: any;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, currentUser, onLogout }) => {
  const { breadcrumbs } = useBreadcrumb();
  const { theme, toggleTheme, isDark } = useTheme();
  const { user: authUser, getUserTypeLabel, isSuperAdmin, isAdmin } = useAuth();

  const user = authUser || currentUser || {
    name: 'Usuário',
    role: 'Visitante',
    avatar: null
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden transition-colors duration-200 mr-2"
          >
            <Menu size={20} />
          </button>
          
          <nav className="ml-2 lg:ml-0">
            <ol className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm">
              {breadcrumbs.map((item, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && <span className="mx-1 sm:mx-2 text-gray-400 dark:text-gray-500">/</span>}
                  <span className={`${index === breadcrumbs.length - 1 ? 'text-gray-900 dark:text-gray-100 font-medium' : 'text-gray-500 dark:text-gray-400'} truncate max-w-[100px] sm:max-w-none`}>
                    {window.innerWidth < 640 && item.label.length > 15 
                      ? item.label.substring(0, 12) + '...' 
                      : item.label}
                  </span>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* User Role Indicator */}
          <div className="hidden sm:flex items-center">
            <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
              isSuperAdmin()
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                : isAdmin()
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            }`}>
              {isSuperAdmin() ? (
                <>
                  <Shield size={10} className="mr-1" />
                  <span className="hidden sm:inline">Super Admin</span>
                  <span className="sm:hidden">SA</span>
                </>
              ) : isAdmin() ? (
                <>
                  <Shield size={10} className="mr-1" />
                  <span className="hidden sm:inline">Admin</span>
                  <span className="sm:hidden">A</span>
                </>
              ) : (
                <>
                  <User size={10} className="mr-1" />
                  <span className="hidden sm:inline">Suprido</span>
                  <span className="sm:hidden">S</span>
                </>
              )}
            </span>
          </div>
          
          <button 
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
            title={isDark ? 'Modo Claro' : 'Modo Escuro'}
          >
            {isDark ? <Sun size={18} className="sm:w-5 sm:h-5" /> : <Moon size={18} className="sm:w-5 sm:h-5" />}
          </button>
          
          <button className="relative p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md">
            <Bell size={18} className="sm:w-5 sm:h-5" />
            <span className="absolute -top-0.5 -right-0.5 h-3 w-3 sm:h-4 sm:w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[120px]">
                {user.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                {getUserTypeLabel()}
              </div>
            </div>
            
            <div className="relative">
              <button className="flex items-center p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden">
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      <User size={14} className="sm:w-4 sm:h-4 text-blue-600" />
                    </div>
                  )}
                </div>
              </button>
            </div>
            
            <button 
              onClick={onLogout}
              className="p-1.5 sm:p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-200"
              title="Sair"
            >
              <LogOut size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;