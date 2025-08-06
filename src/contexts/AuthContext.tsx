import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plus, BarChart3, Calendar, Settings } from 'lucide-react';

interface ActionButtonProps {
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ title, icon, iconBg, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200 group"
    >
      <div className={`w-16 h-16 ${iconBg} rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200`}>
        {icon}
      </div>
      <span className="text-sm font-medium text-gray-900">{title}</span>
    </button>
  );
};

interface QuickActionsProps {
  onNavigate?: (view: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onNavigate }) => {
  const { user, canAccessModule } = useAuth();

  const actions = [
    {
      title: 'Nova Solicitação',
      icon: <Plus size={24} className="text-blue-600" />,
      iconBg: 'bg-blue-100',
      onClick: () => onNavigate?.('supply-funds'),
      module: 'supply-funds'
    },
    {
      title: 'Prestação de Contas',
      icon: <BarChart3 size={24} className="text-purple-600" />,
      iconBg: 'bg-purple-100',
      onClick: () => onNavigate?.('accounting-submission'),
      module: 'accounting-submission'
    },
    ...(user?.role === 'administrador' ? [{
      title: 'SOSFU - Análise',
      icon: <Settings size={24} className="text-green-600" />,
      iconBg: 'bg-green-100',
      onClick: () => onNavigate?.('request-analysis'),
      module: 'request-analysis'
    }] : []),
    {
      title: 'Reembolso',
      icon: <Calendar size={24} className="text-orange-600" />,
      iconBg: 'bg-orange-100',
      onClick: () => onNavigate?.('reimbursement-submission'),
      module: 'reimbursement-submission'
    },
    ...(user?.role === 'administrador' ? [{
      title: 'Usuários',
      icon: <Settings size={24} className="text-red-600" />,
      iconBg: 'bg-red-100',
      onClick: () => onNavigate?.('users-management'),
      module: 'users-management'
    }] : []),
    ...(user?.role === 'administrador' ? [{
      title: 'Configurações',
      icon: <Settings size={24} className="text-gray-600" />,
      iconBg: 'bg-gray-100',
      onClick: () => onNavigate?.('system-settings'),
      module: 'system-settings'
    }] : [])
  ];

  // Filtrar ações baseadas nas permissões do usuário
  const filteredActions = actions.filter(action => 
    !action.module || canAccessModule(action.module)
  );

  return (
    <div className="space-y-6">
      <div className={`grid grid-cols-2 md:grid-cols-3 ${filteredActions.length <= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-6'} gap-4`}>
        {filteredActions.map((action, index) => (
          <ActionButton
            key={index}
            title={action.title}
            icon={action.icon}
            iconBg={action.iconBg}
            onClick={action.onClick}
          />
        ))}
      </div>
    </div>
  );
};

export default QuickActions;