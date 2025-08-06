import React from 'react';
import { useState, useEffect } from 'react';
import StatsCards from './StatsCards';
import QuickActions from './QuickActions';
import RecentNotifications from './RecentNotifications';
import RequestAnalysis from './sosfu/RequestAnalysis';
import AccountingAnalysis from './sosfu/AccountingAnalysis';
import ReimbursementAnalysis from './sosfu/ReimbursementAnalysis';
import AccountingSubmission from './prestacao/AccountingSubmission';
import ReimbursementSubmission from './reembolso/ReimbursementSubmission';
import SupplyFundsModule from './suprimento/SupplyFundsModule';
import UsersManagement from './users/UsersManagement';
import SystemSettings from './settings/SystemSettings';
import { useBreadcrumb } from '../contexts/BreadcrumbContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  FileText, 
  Users, 
  MapPin,
  Building,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Zap
} from 'lucide-react';

interface DashboardProps {
  currentView?: string;
  onViewChange?: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  currentView = 'dashboard', 
  onViewChange 
}) => {
  const { setBreadcrumbs } = useBreadcrumb();
  const { user, canAccessModule } = useAuth();

  const setCurrentView = (view: string) => {
    // Verificar se o usuário tem acesso ao módulo
    if (!canAccessModule(view)) {
      alert('Você não tem permissão para acessar este módulo.');
      return;
    }
    onViewChange?.(view);
  };

  useEffect(() => {
    switch (currentView) {
      case 'request-analysis':
        setBreadcrumbs([
          { label: 'Portal de Gestão TJ-PA' },
          { label: 'SOSFU - Supervisão e Análise Técnica' },
          { label: 'Análise de Solicitações' }
        ]);
        break;
      case 'accounting-analysis':
        setBreadcrumbs([
          { label: 'Portal de Gestão TJ-PA' },
          { label: 'SOSFU - Supervisão e Análise Técnica' },
          { label: 'Análise de Prestação de Contas' }
        ]);
        break;
      case 'reimbursement-analysis':
        setBreadcrumbs([
          { label: 'Portal de Gestão TJ-PA' },
          { label: 'SOSFU - Supervisão e Análise Técnica' },
          { label: 'Análise de Reembolsos' }
        ]);
        break;
      case 'accounting-submission':
        setBreadcrumbs([
          { label: 'Portal de Gestão TJ-PA' },
          { label: 'Prestação de Contas' }
        ]);
        break;
      case 'reimbursement-submission':
        setBreadcrumbs([
          { label: 'Portal de Gestão TJ-PA' },
          { label: 'Reembolso de Despesas' }
        ]);
        break;
      case 'supply-funds':
        setBreadcrumbs([
          { label: 'Portal de Gestão TJ-PA' },
          { label: 'Suprimento de Fundos' }
        ]);
        break;
      case 'users-management':
        setBreadcrumbs([
          { label: 'Portal de Gestão TJ-PA' },
          { label: 'Administração' },
          { label: 'Usuários' }
        ]);
        break;
      case 'system-settings':
        setBreadcrumbs([
          { label: 'Portal de Gestão TJ-PA' },
          { label: 'Sistema' },
          { label: 'Configurações' }
        ]);
        break;
      default:
        setBreadcrumbs([{ label: 'Portal de Gestão TJ-PA' }]);
    }
  }, [currentView, setBreadcrumbs]);

  // Dados simulados para relatórios
  const dashboardData = {
    overview: {
      totalRequests: 156,
      totalAmount: 2450000,
      pendingRequests: 23,
      approvedRequests: 98,
      rejectedRequests: 12,
      inAnalysisRequests: 23,
      averageProcessingTime: 5.2,
      monthlyGrowth: 12.5
    },
    byDepartment: [
      { name: 'Vara Criminal', requests: 45, amount: 680000, percentage: 28.8 },
      { name: 'Vara Cível', requests: 38, amount: 520000, percentage: 24.4 },
      { name: 'Administrativo', requests: 32, amount: 450000, percentage: 20.5 },
      { name: 'Vara de Família', requests: 25, amount: 380000, percentage: 16.0 },
      { name: 'Vara Trabalhista', requests: 16, amount: 420000, percentage: 10.3 }
    ],
    byExpenseElement: [
      { code: '3.3.90.30.96.01', name: 'Material de Consumo', amount: 850000, requests: 67 },
      { code: '3.3.90.33.96', name: 'Transporte e Locomoção', amount: 620000, requests: 43 },
      { code: '3.3.90.39.96', name: 'Serviços de Terceiros - PJ', amount: 480000, requests: 28 },
      { code: '3.3.90.30.96.02', name: 'Combustível e Lubrificantes', amount: 320000, requests: 18 },
      { code: '3.3.90.36.96', name: 'Serviços de Terceiros - PF', amount: 280000, requests: 15 }
    ],
    bySupplied: [
      { name: 'João Silva Santos', department: 'Vara Criminal', amount: 125000, requests: 8 },
      { name: 'Maria Oliveira Costa', department: 'Vara Cível', amount: 98000, requests: 6 },
      { name: 'Carlos Mendes', department: 'Administrativo', amount: 87000, requests: 5 },
      { name: 'Ana Paula Silva', department: 'Vara Família', amount: 76000, requests: 4 },
      { name: 'Roberto Lima', department: 'Vara Trabalhista', amount: 65000, requests: 3 }
    ],
    byMunicipality: [
      { name: 'Belém', requests: 78, amount: 1200000, percentage: 50.0 },
      { name: 'Santarém', requests: 32, amount: 480000, percentage: 20.5 },
      { name: 'Marabá', requests: 24, amount: 360000, percentage: 15.4 },
      { name: 'Castanhal', requests: 15, amount: 250000, percentage: 9.6 },
      { name: 'Altamira', requests: 7, amount: 160000, percentage: 4.5 }
    ],
    monthlyTrend: [
      { month: 'Jan', requests: 45, amount: 680000 },
      { month: 'Fev', requests: 52, amount: 780000 },
      { month: 'Mar', requests: 48, amount: 720000 },
      { month: 'Abr', requests: 61, amount: 920000 },
      { month: 'Mai', requests: 58, amount: 870000 },
      { month: 'Jun', requests: 67, amount: 1010000 }
    ],
    recentActivity: [
      { type: 'approval', user: 'João Silva', action: 'Solicitação aprovada', time: '2 min atrás', amount: 15000 },
      { type: 'request', user: 'Maria Costa', action: 'Nova solicitação', time: '15 min atrás', amount: 8500 },
      { type: 'accounting', user: 'Carlos Mendes', action: 'Prestação enviada', time: '1h atrás', amount: 12000 },
      { type: 'rejection', user: 'Ana Paula', action: 'Solicitação rejeitada', time: '2h atrás', amount: 5000 }
    ]
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'approval': return <CheckCircle size={16} className="text-green-500" />;
      case 'request': return <FileText size={16} className="text-blue-500" />;
      case 'accounting': return <BarChart3 size={16} className="text-purple-500" />;
      case 'rejection': return <AlertTriangle size={16} className="text-red-500" />;
      default: return <Activity size={16} className="text-gray-500" />;
    }
  };

  const renderCurrentView = () => {
    // Verificar acesso antes de renderizar
    if (!canAccessModule(currentView)) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-red-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              Acesso Negado
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Você não tem permissão para acessar este módulo.
            </p>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'request-analysis':
        return <RequestAnalysis />;
      case 'accounting-analysis':
        return <AccountingAnalysis />;
      case 'reimbursement-analysis':
        return <ReimbursementAnalysis />;
      case 'accounting-submission':
        return <AccountingSubmission />;
      case 'reimbursement-submission':
        return <ReimbursementSubmission />;
      case 'supply-funds':
        return <SupplyFundsModule />;
      case 'users-management':
        return <UsersManagement />;
      case 'system-settings':
        return <SystemSettings />;
      default:
        return (
          <div className="space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white text-sm font-bold">🏛</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Portal de Gestão {user?.role === 'administrador' ? '- Administrador' : '- Suprido'}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">TJ-PA</p>
                </div>
              </div>
              
              <div className="mt-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">
                  {user?.role === 'administrador' ? 'Dashboard Executivo' : 'Dashboard Pessoal'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {user?.role === 'administrador' 
                    ? 'Visão completa do sistema de suprimento de fundos' 
                    : 'Seus dados e solicitações de suprimento de fundos'}
                </p>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total de Solicitações</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{dashboardData.overview.totalRequests}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp size={16} className="text-green-500 mr-1" />
                      <span className="text-sm text-green-600 dark:text-green-400">+{dashboardData.overview.monthlyGrowth}%</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">este mês</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <FileText size={24} className="text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Valor Total</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(dashboardData.overview.totalAmount)}</p>
                    <div className="flex items-center mt-2">
                      <DollarSign size={16} className="text-green-500 mr-1" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">Processado</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                    <DollarSign size={24} className="text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Pendentes</p>
                    <p className="text-3xl font-bold text-orange-600">{dashboardData.overview.pendingRequests}</p>
                    <div className="flex items-center mt-2">
                      <Clock size={16} className="text-orange-500 mr-1" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">Aguardando análise</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                    <Clock size={24} className="text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Tempo Médio</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{dashboardData.overview.averageProcessingTime}</p>
                    <div className="flex items-center mt-2">
                      <Target size={16} className="text-blue-500 mr-1" />
                      <span className="text-sm text-gray-500 dark:text-gray-400">dias para análise</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <Target size={24} className="text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Status Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Aprovadas</p>
                    <p className="text-2xl font-bold text-green-600">{dashboardData.overview.approvedRequests}</p>
                  </div>
                  <CheckCircle size={32} className="text-green-500" />
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Em Análise</p>
                    <p className="text-2xl font-bold text-blue-600">{dashboardData.overview.inAnalysisRequests}</p>
                  </div>
                  <Activity size={32} className="text-blue-500" />
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Rejeitadas</p>
                    <p className="text-2xl font-bold text-red-600">{dashboardData.overview.rejectedRequests}</p>
                  </div>
                  <AlertTriangle size={32} className="text-red-500" />
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pendentes</p>
                    <p className="text-2xl font-bold text-orange-600">{dashboardData.overview.pendingRequests}</p>
                  </div>
                  <Clock size={32} className="text-orange-500" />
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {/* Relatório por Departamento */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Building size={20} className="text-blue-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Por Departamento</h3>
                  </div>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Ver todos</button>
                </div>
                
                <div className="space-y-4">
                  {dashboardData.byDepartment.map((dept, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{dept.name}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{dept.requests} solicitações</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-green-600">{formatCurrency(dept.amount)}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{dept.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${dept.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Relatório por Elemento de Despesa */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <PieChart size={20} className="text-purple-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Elementos de Despesa</h3>
                  </div>
                  <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">Detalhes</button>
                </div>
                
                <div className="space-y-4">
                  {dashboardData.byExpenseElement.map((element, index) => (
                    <div key={index} className="border-l-4 border-purple-500 pl-4 py-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-gray-600 dark:text-gray-400">{element.code}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{element.requests} sol.</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{element.name}</span>
                        <span className="text-sm font-bold text-purple-600">{formatCurrency(element.amount)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Atividade Recente */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Activity size={20} className="text-green-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Atividade Recente</h3>
                  </div>
                  <button className="text-green-600 hover:text-green-800 text-sm font-medium">Ver todas</button>
                </div>
                
                <div className="space-y-4">
                  {dashboardData.recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{activity.user}</p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{activity.action}</p>
                        <p className="text-sm font-semibold text-green-600">{formatCurrency(activity.amount)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Relatórios Adicionais */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Supridos */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <Users size={20} className="text-orange-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Top Supridos</h3>
                  </div>
                  <button className="text-orange-600 hover:text-orange-800 text-sm font-medium">Ranking completo</button>
                </div>
                
                <div className="space-y-4">
                  {dashboardData.bySupplied.map((supplied, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-orange-600">#{index + 1}</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{supplied.name}</p>
                          <span className="text-sm font-bold text-orange-600">{formatCurrency(supplied.amount)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-gray-500 dark:text-gray-400">{supplied.department}</p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{supplied.requests} solicitações</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Por Município */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <MapPin size={20} className="text-red-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Por Município</h3>
                  </div>
                  <button className="text-red-600 hover:text-red-800 text-sm font-medium">Mapa completo</button>
                </div>
                
                <div className="space-y-4">
                  {dashboardData.byMunicipality.map((city, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 rounded-r-lg">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{city.name}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{city.requests} sol.</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-red-600">{formatCurrency(city.amount)}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{city.percentage}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-6">
                <Zap size={20} className="text-yellow-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Ações Rápidas</h3>
              </div>
              <QuickActions onNavigate={setCurrentView} />
            </div>
          </div>
        );
    }
  };

  return (
    <div>
      {/* Navigation Bar */}
      {currentView !== 'dashboard' && (
        <div className="mb-6">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Voltar ao Dashboard
          </button>
        </div>
      )}
      
      {renderCurrentView()}
    </div>
  );
};

export default Dashboard;