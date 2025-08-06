import React from 'react';
import { Bell, CheckCircle, FileText } from 'lucide-react';

interface NotificationProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  time: string;
}

const NotificationItem: React.FC<NotificationProps> = ({ icon, iconBg, title, time }) => {
  return (
    <div className="flex items-start space-x-3 py-3">
      <div className={`w-8 h-8 ${iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500 mt-1">{time}</p>
      </div>
    </div>
  );
};

const RecentNotifications: React.FC = () => {
  const notifications = [
    {
      icon: <Bell size={16} className="text-blue-600" />,
      iconBg: 'bg-blue-100',
      title: 'Nova solicitação recebida',
      time: 'Há 2 horas'
    },
    {
      icon: <CheckCircle size={16} className="text-green-600" />,
      iconBg: 'bg-green-100',
      title: 'Solicitação aprovada',
      time: 'Há 4 horas'
    },
    {
      icon: <FileText size={16} className="text-yellow-600" />,
      iconBg: 'bg-yellow-100',
      title: 'Relatório mensal disponível',
      time: 'Ontem'
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 h-fit">
      <div className="flex items-center mb-6">
        <Bell size={20} className="text-gray-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">Notificações Recentes</h3>
      </div>
      
      <div className="space-y-1">
        {notifications.map((notification, index) => (
          <NotificationItem
            key={index}
            icon={notification.icon}
            iconBg={notification.iconBg}
            title={notification.title}
            time={notification.time}
          />
        ))}
      </div>
      
      <div className="pt-4 mt-4 border-t border-gray-100">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          Ver todas as notificações
        </button>
      </div>
    </div>
  );
};

export default RecentNotifications;