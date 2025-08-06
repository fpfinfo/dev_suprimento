import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Home, 
  DollarSign, 
  FileText, 
  Receipt, 
  Users, 
  Settings, 
  ChevronDown, 
  ChevronRight,
  Scale,
  Shield,
  BarChart3,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (view: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  children?: MenuItem[];
  active?: boolean;
  onClick?: () => void;
  badge?: number;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  onNavigate, 
  isCollapsed, 
  onToggleCollapse 
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['suprimento']);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const { user, canAccessModule } = useAuth();

  const toggleExpanded = (key: string) => {
    if (isCollapsed) return;
    setExpandedItems(prev => 
      prev.includes(key) 
        ? prev.filter(item => item !== key)
        : [...prev, key]
    );
  };

  const handleItemClick = (item: MenuItem, key: string) => {
    if (item.children && item.children.length > 0) {
      toggleExpanded(key);
    } else if (item.onClick) {
      item.onClick();
      onClose();
    }
  };

  const menuItems: MenuItem[] = [
    {
      icon: <Home size={20} />,
      label: 'Dashboard',
      active: true,
      onClick: () => onNavigate?.('dashboard')
    }
  ];

  const modules: MenuItem[] = [
    {
      icon: <DollarSign size={20} />,
      label: 'Suprimento de Fundos',
      badge: 3,
      onClick: () => onNavigate?.('supply-funds')
    },
    {
      icon: <Receipt size={20} />,
      label: 'Prestação de Contas',
      badge: 3,
      onClick: () => onNavigate?.('accounting-submission')
    },
    {
      icon: <BarChart3 size={20} />,
      label: 'Reembolso de Despesas',
      badge: 2,
      onClick: () => onNavigate?.('reimbursement-submission')
    }
  ];

  const administration: MenuItem[] = [
    {
      icon: <Shield size={20} />,
      label: 'SOSFU - Supervisão',
      badge: 8,
      children: [
        { 
          icon: <FileText size={18} />, 
          label: 'Análise de Solicitações',
          onClick: () => onNavigate?.('request-analysis')
        },
        { 
          icon: <Receipt size={18} />, 
          label: 'Análise de Prestações',
          onClick: () => onNavigate?.('accounting-analysis')
        },
        { 
          icon: <DollarSign size={18} />, 
          label: 'Análise de Reembolsos',
          onClick: () => onNavigate?.('reimbursement-analysis')
        }
      ]
    },
    ...(user?.role === 'administrador' ? [{
      icon: <Users size={20} />,
      label: 'Usuários',
      onClick: () => onNavigate?.('users-management')
    }] : [])
  ];

  const system: MenuItem[] = [
    ...(user?.role === 'administrador' ? [{
      icon: <Settings size={20} />,
      label: 'Configurações',
      onClick: () => onNavigate?.('system-settings')
    }] : [])
  ];

  const renderMenuItem = (item: MenuItem, key: string, level = 0) => {
    const isExpanded = expandedItems.includes(key);
    const hasChildren = item.children && item.children.length > 0;
    const isHovered = hoveredItem === key;

    return (
      <div key={key}>
        <div
          className={`relative flex items-center px-3 py-3 mx-2 rounded-xl cursor-pointer transition-all duration-300 group ${
            item.active 
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50'
          } ${level > 0 ? 'ml-6' : ''} ${isCollapsed && level === 0 ? 'justify-center' : ''}`}
          onClick={() => handleItemClick(item, key)}
          onMouseEnter={() => setHoveredItem(key)}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <div className={`flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300 ${
            item.active 
              ? 'bg-white/20' 
              : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
          }`}>
            <span className={`transition-all duration-300 ${
              item.active ? 'text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-300'
            }`}>
              {item.icon}
            </span>
          </div>
          
          {!isCollapsed && (
            <>
              <div className="flex-1 ml-3">
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              
              {item.badge && (
                <span className={`px-2 py-1 text-xs font-bold rounded-full transition-all duration-300 ${
                  item.active 
                    ? 'bg-white/20 text-white' 
                    : 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                }`}>
                  {item.badge}
                </span>
              )}
              
              {hasChildren && (
                <span className={`ml-2 transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : 'rotate-0'
                }`}>
                  <ChevronDown size={16} />
                </span>
              )}
            </>
          )}

          {/* Tooltip para modo colapsado */}
          {isCollapsed && isHovered && (
            <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap">
              {item.label}
              {item.badge && (
                <span className="ml-2 px-2 py-1 bg-blue-500 text-xs rounded-full">
                  {item.badge}
                </span>
              )}
            </div>
          )}
        </div>
        
        {hasChildren && isExpanded && !isCollapsed && (
          <div className="mt-1 space-y-1">
            {item.children?.map((child, index) => 
              renderMenuItem(child, `${key}-${index}`, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  const renderSection = (title: string, items: MenuItem[], keyPrefix: string) => (
    <div className="mb-6">
      {!isCollapsed && (
        <div className="px-5 mb-3">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {title}
          </h3>
        </div>
      )}
      <div className="space-y-1">
        {items.map((item, index) => 
          renderMenuItem(item, `${keyPrefix}-${index}`)
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed inset-y-0 left-0 z-30 bg-white dark:bg-gray-800 shadow-2xl transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}>
        
        {/* Header */}
        <div className={`flex items-center h-16 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white ${
          isCollapsed ? 'justify-center' : 'justify-between'
        }`}>
          {!isCollapsed && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                <Scale size={20} />
              </div>
              <div>
                <div className="text-sm font-bold">Portal TJ-PA</div>
                <div className="text-xs opacity-90">Sistema de Gestão</div>
              </div>
            </div>
          )}
          
          {isCollapsed && (
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Scale size={20} />
            </div>
          )}

          {/* Toggle Button - Desktop */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <X size={16} />}
          </button>

          {/* Close Button - Mobile */}
          <button
            onClick={onClose}
            className="lg:hidden flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg hover:bg-white/30 transition-colors duration-200"
          >
            <X size={16} />
          </button>
        </div>

        {/* Menu Content */}
        <div className="flex flex-col h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          <div className="flex-1 py-6">
            {renderSection('Menu Principal', menuItems, 'main')}
            {renderSection('Módulos', modules, 'module')}
            {user?.role === 'administrador' && renderSection('Administração', administration, 'admin')}
            {user?.role === 'administrador' && system.length > 0 && renderSection('Sistema', system, 'system')}
          </div>

          {/* Footer */}
          {!isCollapsed && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                <div className="font-medium">Sistema TJ-PA</div>
                <div>Versão 2.1.0</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;