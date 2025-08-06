import React from 'react';
import { FileText, Users, DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  iconBg: string;
  textColor?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, iconBg, textColor = 'text-gray-900' }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
        </div>
        <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

const StatsCards: React.FC = () => {
  const stats = [
    {
      title: 'Total de Solicitações',
      value: '156',
      icon: <FileText size={24} className="text-blue-600" />,
      iconBg: 'bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'Valor Total Processado',
      value: 'R$ 2.450.000',
      icon: <DollarSign size={24} className="text-green-600" />,
      iconBg: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Pendentes de Análise',
      value: '23',
      icon: <Clock size={24} className="text-orange-600" />,
      iconBg: 'bg-orange-100 dark:bg-orange-900'
    },
    {
      title: 'Taxa de Aprovação',
      value: '87%',
      icon: <CheckCircle size={24} className="text-purple-600" />,
      iconBg: 'bg-purple-100 dark:bg-purple-900',
      textColor: 'text-green-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          iconBg={stat.iconBg}
          textColor={stat.textColor}
        />
      ))}
    </div>
  );
};

export default StatsCards;