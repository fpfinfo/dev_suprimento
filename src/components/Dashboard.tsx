import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBreadcrumb } from '../contexts/BreadcrumbContext';
import StatsCards from './StatsCards';
import QuickActions from './QuickActions';
import RecentNotifications from './RecentNotifications';
import SupplyFundsModule from './suprimento/SupplyFundsModule';
import AccountingSubmission from './prestacao/AccountingSubmission';
import ReimbursementSubmission from './reembolso/ReimbursementSubmission';
import RequestAnalysis from './sosfu/RequestAnalysis';
import AccountingAnalysis from './sosfu/AccountingAnalysis';
import ReimbursementAnalysis from './sosfu/ReimbursementAnalysis';
import UsersManagement from './users/UsersManagement';
import SystemSettings from './settings/SystemSettings';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  DollarSign,
  FileText,
  Users,
  Calendar,
  Activity
} from 'lucide-react';

interface DashboardProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

interface DashboardStats {
  totalSolicitacoes: number;
  valorTotalProcessado: number;
  pendentesAnalise: number;
  taxaAprovacao: number;
  solicitacoesPendentes: number;
  prestacoesPendentes: number;
  reembolsosPendentes: number;
  valorMedioSolicitacao: number;
}

interface RecentActivity {
  id: string;
  type: 'solicitacao' | 'prestacao' | 'reembolso' | 'aprovacao';
  title: string;
  description: string;
  time: string;
  status: 'success' | 'warning' | 'error' | 'info';
  user?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ currentView, onViewChange }) => {
  const { user, hasPermission } = useAuth();
  const { setBreadcrumbs } = useBreadcrumb();
  const [stats, setStats] = useState<DashboardStats>({
    totalSolicitacoes: 0,
    valorTotalProcessado: 0,
    pendentesAnalise: 0,
    taxaAprovacao: 0,
    solicitacoesPendentes: 0,
    prestacoesPendentes: 0,
    reembolsosPendentes: 0,
    valorMedioSolicitacao: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  // Atualizar breadcrumbs baseado na view atual
  useEffect(() => {
    const breadcrumbMap: { [key: string]: string } = {
      'dashboard': 'Dashboard',
      'supply-funds': 'Suprimento de Fundos',
      'accounting-submission': 'Prestação de Contas',
      'reimbursement-submission': 'Reembolso de Despesas',
      'request-analysis': 'SOSFU - Análise de Solicitações',
      'accounting-analysis': 'SOSFU - Análise de Prestações',
      'reimbursement-analysis': 'SOSFU - Análise de Reembolsos',
      'users-management': 'Gestão de Usuários',
      'system-settings': 'Configurações do Sistema'
    };

    const currentLabel = breadcrumbMap[currentView] || 'Dashboard';
    setBreadcrumbs([
      { label: 'Portal TJ-PA' },
      { label: currentLabel }
    ]);
  }, [currentView, setBreadcrumbs]);

  // Carregar dados do dashboard
  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    
    try {
      // Simular carregamento de dados baseado no perfil do usuário
      if (user?.role === 'administrador') {
        // Dados completos para administrador
        setStats({
          totalSolicitacoes: 156,
          valorTotalProcessado: 2450000,
          pendentesAnalise: 23,
          taxaAprovacao: 87,
          solicitacoesPendentes: 12,
          prestacoesPendentes: 8,
          reembolsosPendentes: 5,
          valorMedioSolicitacao: 15705
        });

        setRecentActivities([
          {
            id: '1',
            type: 'solicitacao',
            title: 'Nova solicitação recebida',
            description: 'João Silva - SF-2024-0156 - R$ 8.500,00',
            time: 'Há 15 minutos',
            status: 'info',
            user: 'João Silva'
          },
          {
            id: '2',
            type: 'aprovacao',
            title: 'Solicitação aprovada',
            description: 'SF-2024-0155 aprovada por Fábio Freitas',
            time: 'Há 1 hora',
            status: 'success',
            user: 'Fábio Freitas'
          },
          {
            id: '3',
            type: 'prestacao',
            title: 'Prestação de contas vencendo',
            description: 'PC-2024-0089 vence em 2 dias',
            time: 'Há 2 horas',
            status: 'warning',
            user: 'Maria Santos'
          },
          {
            id: '4',
            type: 'reembolso',
            title: 'Reembolso processado',
            description: 'RB-2024-0034 - R$ 450,00 aprovado',
            time: 'Há 3 horas',
            status: 'success',
            user: 'Carlos Lima'
          }
        ]);
      } else {
        // Dados limitados para suprido (apenas seus próprios dados)
        setStats({
          totalSolicitacoes: 8,
          valorTotalProcessado: 45000,
          pendentesAnalise: 2,
          taxaAprovacao: 100,
          solicitacoesPendentes: 1,
          prestacoesPendentes: 1,
          reembolsosPendentes: 0,
          valorMedioSolicitacao: 5625
        });

        setRecentActivities([
          {
            id: '1',
            type: 'solicitacao',
            title: 'Sua solicitação foi aprovada',
            description: 'SF-2024-0145 - R$ 5.200,00 aprovada',
            time: 'Há 2 horas',
            status: 'success'
          },
          {
            id: '2',
            type: 'prestacao',
            title: 'Prestação de contas pendente',
            description: 'PC-2024-0078 vence em 5 dias',
            time: 'Há 1 dia',
            status: 'warning'
          },
          {
            id: '3',
            type: 'solicitacao',
            title: 'Nova solicitação criada',
            description: 'SF-2024-0156 aguardando análise',
            time: 'Há 2 dias',
            status: 'info'
          }
        ]);
      }
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'solicitacao':
        return <FileText size={16} className="text-blue-600" />;
      case 'prestacao':
        return <BarChart3 size={16} className="text-purple-600" />;
      case 'reembolso':
        return <DollarSign size={16} className="text-green-600" />;
      case 'aprovacao':
        return <CheckCircle size={16} className="text-green-600" />;
      default:
        return <Activity size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const renderDashboardContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* Stats Cards Personalizadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {user?.role === 'administrador' ? 'Total de Solicitações' : 'Minhas Solicitações'}
                </p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalSolicitacoes}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <FileText size={24} className="text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Valor Total Processado
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.valorTotalProcessado)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <DollarSign size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  {user?.role === 'administrador' ? 'Pendentes de Análise' : 'Aguardando Análise'}
                </p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendentesAnalise}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <Clock size={24} className="text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Taxa de Aprovação
                </p>
                <p className="text-2xl font-bold text-purple-600">{stats.taxaAprovacao}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <TrendingUp size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Resumo por Módulo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Suprimento de Fundos
              </h3>
              <FileText size={20} className="text-blue-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Pendentes:</span>
                <span className="text-sm font-medium text-orange-600">
                  {stats.solicitacoesPendentes}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Valor Médio:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatCurrency(stats.valorMedioSolicitacao)}
                </span>
              </div>
              <button
                onClick={() => onViewChange('supply-funds')}
                className="w-full mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Acessar Módulo
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Prestação de Contas
              </h3>
              <BarChart3 size={20} className="text-purple-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Pendentes:</span>
                <span className="text-sm font-medium text-orange-600">
                  {stats.prestacoesPendentes}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Vencendo:</span>
                <span className="text-sm font-medium text-red-600">3</span>
              </div>
              <button
                onClick={() => onViewChange('accounting-submission')}
                className="w-full mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                Acessar Módulo
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Reembolso de Despesas
              </h3>
              <DollarSign size={20} className="text-green-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Pendentes:</span>
                <span className="text-sm font-medium text-orange-600">
                  {stats.reembolsosPendentes}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">Este Mês:</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  R$ 2.340,00
                </span>
              </div>
              <button
                onClick={() => onViewChange('reimbursement-submission')}
                className="w-full mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                Acessar Módulo
              </button>
            </div>
          </div>
        </div>

        {/* Atividades Recentes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {user?.role === 'administrador' ? 'Atividades Recentes do Sistema' : 'Suas Atividades Recentes'}
              </h3>
              <Activity size={20} className="text-gray-600" />
            </div>
            
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg border ${getStatusColor(activity.status)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {activity.title}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {activity.description}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {activity.time}
                      </p>
                      {activity.user && user?.role === 'administrador' && (
                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          {activity.user}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                Ver todas as atividades
              </button>
            </div>
          </div>

          {/* Alertas e Notificações */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Alertas e Lembretes
              </h3>
              <AlertTriangle size={20} className="text-orange-600" />
            </div>
            
            <div className="space-y-4">
              {user?.role === 'administrador' ? (
                <>
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle size={16} className="text-red-600 mr-2" />
                      <span className="text-sm font-medium text-red-800 dark:text-red-300">
                        3 prestações vencendo hoje
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-center">
                      <Clock size={16} className="text-yellow-600 mr-2" />
                      <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                        12 solicitações aguardando análise
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center">
                      <Users size={16} className="text-blue-600 mr-2" />
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                        2 novos usuários cadastrados
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <div className="flex items-center">
                      <Calendar size={16} className="text-yellow-600 mr-2" />
                      <span className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                        Prestação PC-2024-0078 vence em 5 dias
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle size={16} className="text-green-600 mr-2" />
                      <span className="text-sm font-medium text-green-800 dark:text-green-300">
                        Solicitação SF-2024-0145 aprovada
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6">
            Ações Rápidas
          </h3>
          <QuickActions onNavigate={onViewChange} />
        </div>
      </div>
    );
  };

  // Renderizar módulos específicos
  if (currentView !== 'dashboard') {
    switch (currentView) {
      case 'supply-funds':
        return <SupplyFundsModule />;
      case 'accounting-submission':
        return <AccountingSubmission />;
      case 'reimbursement-submission':
        return <ReimbursementSubmission />;
      case 'request-analysis':
        return hasPermission('sosfu.full_access') ? <RequestAnalysis /> : <div>Acesso negado</div>;
      case 'accounting-analysis':
        return hasPermission('sosfu.full_access') ? <AccountingAnalysis /> : <div>Acesso negado</div>;
      case 'reimbursement-analysis':
        return hasPermission('sosfu.full_access') ? <ReimbursementAnalysis /> : <div>Acesso negado</div>;
      case 'users-management':
        return hasPermission('users.manage') ? <UsersManagement /> : <div>Acesso negado</div>;
      case 'system-settings':
        return hasPermission('settings.manage') ? <SystemSettings /> : <div>Acesso negado</div>;
      default:
        return renderDashboardContent();
    }
  }

  return (
    <div className="space-y-6">
      {/* Header do Dashboard */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {user?.role === 'administrador' ? 'Painel Administrativo' : 'Meu Painel'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {user?.role === 'administrador' 
                ? 'Visão geral completa do sistema de gestão financeira'
                : 'Acompanhe suas solicitações, prestações e reembolsos'
              }
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Bem-vindo, {user?.name}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {user?.role === 'administrador' ? 'Administrador' : 'Suprido'} • {user?.department}
            </p>
          </div>
        </div>
      </div>

      {renderDashboardContent()}
    </div>
  );
};

export default Dashboard;