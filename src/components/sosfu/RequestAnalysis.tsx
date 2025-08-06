import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Building,
  Calendar,
  DollarSign,
  MessageSquare,
  Download,
  Trash2,
  X,
  Save,
  Edit,
  Printer,
  Shield,
  MapPin,
  Phone,
  Mail,
  Hash
} from 'lucide-react';

interface Request {
  id: string;
  protocol: string;
  requester: {
    name: string;
    cpf: string;
    email: string;
    phone: string;
    department: string;
    municipality: string;
    manager: string;
  };
  totalAmount: number;
  justification: string;
  usageDeadline: string;
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  status: 'pendente' | 'em_analise' | 'aprovado' | 'rejeitado';
  elements: Array<{
    code: string;
    description: string;
    amount: number;
  }>;
  createdAt: string;
  analyzedAt?: string;
  analyzedBy?: string;
  technicalOpinion?: string;
  observations?: string;
  messages: Array<{
    id: string;
    sender: string;
    message: string;
    timestamp: string;
    type: 'user' | 'admin';
  }>;
}

const RequestAnalysis: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPortariaModal, setShowPortariaModal] = useState(false);
  const [isEditingPortaria, setIsEditingPortaria] = useState(false);
  const [portariaData, setPortariaData] = useState({
    solicitanteName: '',
    department: '',
    justification: '',
    ptres: '',
    dotacoes: '',
    ordenadorDespesa: 'ANAILTON PAULO DE ALENCAR',
    prazoAplicacaoInicio: '',
    prazoAplicacaoFim: '',
    prazoPrestacaoInicio: '',
    prazoPrestacaoFim: ''
  });

  // Estado do formulário da portaria
  const [portariaForm, setPortariaForm] = useState({
    protocol: '',
    requesterName: '',
    cpf: '',
    email: '',
    phone: '',
    department: '',
    municipality: '',
    manager: '',
    priority: '',
    startDate: '',
    endDate: '',
    justification: '',
    elements: [] as Array<{code: string; description: string; amount: number}>,
    totalAmount: 0,
    ptres: '',
    dotacoes: '',
    generatedAt: ''
  });

  const [requests] = useState<Request[]>([
    {
      id: '1',
      protocol: 'SF-2024-001',
      requester: {
        name: 'João Silva Santos',
        cpf: '123.456.789-00',
        email: 'joao.silva@tjpa.jus.br',
        phone: '(91) 99999-9999',
        department: 'Vara Criminal',
        municipality: 'Belém',
        manager: 'Dr. Carlos Mendes'
      },
      totalAmount: 5000,
      justification: 'Necessidade de aquisição de materiais de escritório para funcionamento adequado da vara criminal durante o mês de fevereiro.',
      usageDeadline: '2024-02-27',
      priority: 'alta',
      status: 'pendente',
      elements: [
        { code: '3.3.90.30.96.01', description: 'Material de Consumo', amount: 3000 },
        { code: '3.3.90.30.96.02', description: 'Combustível e Lubrificantes', amount: 2000 }
      ],
      createdAt: '2024-01-15T10:30:00',
      messages: [
        {
          id: '1',
          sender: 'João Silva Santos',
          message: 'Solicitação criada e enviada para análise.',
          timestamp: '2024-01-15T10:30:00',
          type: 'user'
        }
      ]
    },
    {
      id: '2',
      protocol: 'SF-2024-002',
      requester: {
        name: 'Maria Oliveira Costa',
        cpf: '987.654.321-00',
        email: 'maria.costa@tjpa.jus.br',
        phone: '(91) 88888-8888',
        department: 'Vara Cível',
        municipality: 'Santarém',
        manager: 'Dra. Ana Paula Silva'
      },
      totalAmount: 8500,
      justification: 'Aquisição de equipamentos e materiais para melhoria do atendimento ao público.',
      usageDeadline: '2024-03-15',
      priority: 'media',
      status: 'em_analise',
      elements: [
        { code: '3.3.90.33.96', description: 'Transporte e Locomoção', amount: 4500 },
        { code: '3.3.90.39.96', description: 'Serviços de Terceiros - PJ', amount: 4000 }
      ],
      createdAt: '2024-01-14T14:20:00',
      analyzedAt: '2024-01-16T09:15:00',
      analyzedBy: 'Dr. Roberto Lima',
      technicalOpinion: 'Solicitação em análise. Documentação completa.',
      messages: [
        {
          id: '1',
          sender: 'Maria Oliveira Costa',
          message: 'Solicitação enviada para análise.',
          timestamp: '2024-01-14T14:20:00',
          type: 'user'
        },
        {
          id: '2',
          sender: 'Dr. Roberto Lima',
          message: 'Solicitação recebida e em análise.',
          timestamp: '2024-01-16T09:15:00',
          type: 'admin'
        }
      ]
    },
    {
      id: '3',
      protocol: 'SF-2024-003',
      requester: {
        name: 'Carlos Mendes Silva',
        cpf: '456.789.123-00',
        email: 'carlos.mendes@tjpa.jus.br',
        phone: '(91) 77777-7777',
        department: 'Administrativo',
        municipality: 'Marabá',
        manager: 'Dr. Paulo Roberto'
      },
      totalAmount: 12000,
      justification: 'Necessidade urgente de materiais para manutenção predial.',
      usageDeadline: '2024-02-10',
      priority: 'urgente',
      status: 'aprovado',
      elements: [
        { code: '3.3.90.36.96', description: 'Serviços de Terceiros - PF', amount: 7000 },
        { code: '3.3.90.30.96.01', description: 'Material de Consumo', amount: 5000 }
      ],
      createdAt: '2024-01-12T16:45:00',
      analyzedAt: '2024-01-13T11:30:00',
      analyzedBy: 'Dra. Fernanda Santos',
      technicalOpinion: 'Solicitação aprovada. Documentação em conformidade e justificativa adequada.',
      messages: [
        {
          id: '1',
          sender: 'Carlos Mendes Silva',
          message: 'Solicitação criada com prioridade urgente.',
          timestamp: '2024-01-12T16:45:00',
          type: 'user'
        },
        {
          id: '2',
          sender: 'Dra. Fernanda Santos',
          message: 'Solicitação aprovada após análise técnica.',
          timestamp: '2024-01-13T11:30:00',
          type: 'admin'
        }
      ]
    },
    {
      id: '4',
      protocol: 'SF-2024-004',
      requester: {
        name: 'Ana Paula Silva',
        cpf: '789.123.456-00',
        email: 'ana.paula@tjpa.jus.br',
        phone: '(91) 66666-6666',
        department: 'Vara de Família',
        municipality: 'Castanhal',
        manager: 'Dr. José Santos'
      },
      totalAmount: 3500,
      justification: 'Solicitação com documentação incompleta.',
      usageDeadline: '2024-02-20',
      priority: 'baixa',
      status: 'rejeitado',
      elements: [
        { code: '3.3.90.30.96.02', description: 'Combustível e Lubrificantes', amount: 3500 }
      ],
      createdAt: '2024-01-10T13:15:00',
      analyzedAt: '2024-01-11T15:20:00',
      analyzedBy: 'Dr. Roberto Lima',
      technicalOpinion: 'Solicitação rejeitada devido à documentação incompleta e justificativa insuficiente.',
      observations: 'Necessário apresentar orçamentos detalhados.',
      messages: [
        {
          id: '1',
          sender: 'Ana Paula Silva',
          message: 'Solicitação enviada para análise.',
          timestamp: '2024-01-10T13:15:00',
          type: 'user'
        },
        {
          id: '2',
          sender: 'Dr. Roberto Lima',
          message: 'Solicitação rejeitada. Favor verificar documentação.',
          timestamp: '2024-01-11T15:20:00',
          type: 'admin'
        }
      ]
    }
  ]);

  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pendente').length,
    inAnalysis: requests.filter(r => r.status === 'em_analise').length,
    approved: requests.filter(r => r.status === 'aprovado').length,
    rejected: requests.filter(r => r.status === 'rejeitado').length
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'pendente': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'em_analise': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'aprovado': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'rejeitado': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'pendente': 'Pendente',
      'em_analise': 'Em Análise',
      'aprovado': 'Aprovado',
      'rejeitado': 'Rejeitado'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'baixa': 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      'media': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'alta': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'urgente': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      'baixa': 'Baixa',
      'media': 'Média',
      'alta': 'Alta',
      'urgente': 'Urgente'
    };
    return labels[priority as keyof typeof labels] || priority;
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requester.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requester.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const openDetailsModal = (request: Request) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const openPortariaModal = (request: Request) => {
    setSelectedRequest(request);
    setPortariaData({
      solicitanteName: request.requester.name,
      department: request.requester.department,
      justification: request.justification,
      ptres: '',
      dotacoes: '',
      ordenadorDespesa: 'ANAILTON PAULO DE ALENCAR',
      prazoAplicacaoInicio: request.startDate,
      prazoAplicacaoFim: request.endDate,
      prazoPrestacaoInicio: '',
      prazoPrestacaoFim: ''
    });
    setPortariaForm({
      protocol: request.protocol,
      requesterName: request.requester.name,
      cpf: request.requester.cpf,
      email: request.requester.email,
      phone: request.requester.phone,
      department: request.requester.department,
      municipality: request.requester.municipality,
      manager: request.requester.manager,
      priority: getPriorityLabel(request.priority),
      startDate: '31/01/2024',
      endDate: new Date(request.usageDeadline).toLocaleDateString('pt-BR'),
      justification: request.justification,
      elements: request.elements,
      totalAmount: request.totalAmount,
      ptres: '',
      dotacoes: '',
      generatedAt: new Date().toLocaleString('pt-BR')
    });
    setIsEditingPortaria(false);
    setShowPortariaModal(true);
  };

  const handlePortariaFormChange = (field: string, value: any) => {
    setPortariaForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const savePortaria = () => {
    console.log('Salvando portaria:', portariaForm);
    alert('Portaria salva com sucesso!');
    setIsEditingPortaria(false);
  };

  const printPortaria = () => {
    window.print();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
            <Shield size={24} className="text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">SOSFU - Análise de Solicitações</h1>
            <p className="text-gray-600 dark:text-gray-400">Supervisão e Análise Técnica de Solicitações de Suprimento</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <FileText size={24} className="text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Pendentes</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
            </div>
            <Clock size={24} className="text-orange-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Em Análise</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inAnalysis}</p>
            </div>
            <AlertTriangle size={24} className="text-blue-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Aprovadas</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <CheckCircle size={24} className="text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Rejeitadas</p>
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
            </div>
            <XCircle size={24} className="text-red-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Buscar por protocolo, solicitante..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos os Status</option>
              <option value="pendente">Pendente</option>
              <option value="em_analise">Em Análise</option>
              <option value="aprovado">Aprovado</option>
              <option value="rejeitado">Rejeitado</option>
            </select>
          </div>

          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">Todas as Prioridades</option>
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Protocolo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Solicitante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Prioridade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{request.protocol}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{request.requester.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{request.requester.department}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-green-600">{formatCurrency(request.totalAmount)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                      {getPriorityLabel(request.priority)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                      {getStatusLabel(request.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(request.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => openDetailsModal(request)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Ver detalhes"
                    >
                      <Eye size={16} />
                    </button>
                    {request.status === 'pendente' && (
                      <button
                        onClick={() => openPortariaModal(request)}
                        className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
                        title="Gerar Portaria"
                      >
                        <FileText size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => alert('Funcionalidade de exclusão')}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Nenhuma solicitação encontrada</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Tente ajustar os filtros de busca.
            </p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Detalhes da Solicitação - {selectedRequest.protocol}
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Dados do Solicitante</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <User size={16} className="text-gray-500 mr-2" />
                      <span className="text-gray-600 dark:text-gray-400">Nome:</span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">{selectedRequest.requester.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Hash size={16} className="text-gray-500 mr-2" />
                      <span className="text-gray-600 dark:text-gray-400">CPF:</span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">{selectedRequest.requester.cpf}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail size={16} className="text-gray-500 mr-2" />
                      <span className="text-gray-600 dark:text-gray-400">Email:</span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">{selectedRequest.requester.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone size={16} className="text-gray-500 mr-2" />
                      <span className="text-gray-600 dark:text-gray-400">Telefone:</span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">{selectedRequest.requester.phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Building size={16} className="text-gray-500 mr-2" />
                      <span className="text-gray-600 dark:text-gray-400">Departamento:</span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">{selectedRequest.requester.department}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin size={16} className="text-gray-500 mr-2" />
                      <span className="text-gray-600 dark:text-gray-400">Município:</span>
                      <span className="ml-2 text-gray-900 dark:text-gray-100">{selectedRequest.requester.municipality}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Status e Análise</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedRequest.status)}`}>
                        {getStatusLabel(selectedRequest.status)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-600 dark:text-gray-400">Prioridade:</span>
                      <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedRequest.priority)}`}>
                        {getPriorityLabel(selectedRequest.priority)}
                      </span>
                    </div>
                    {selectedRequest.analyzedBy && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Analisado por:</span>
                        <span className="ml-2 text-gray-900 dark:text-gray-100">{selectedRequest.analyzedBy}</span>
                      </div>
                    )}
                    {selectedRequest.analyzedAt && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Data da análise:</span>
                        <span className="ml-2 text-gray-900 dark:text-gray-100">
                          {new Date(selectedRequest.analyzedAt).toLocaleString('pt-BR')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Elementos e Justificativa */}
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Elementos de Despesa</h4>
                  <div className="space-y-2">
                    {selectedRequest.elements.map((element, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-white dark:bg-gray-600 rounded">
                        <div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{element.code}</div>
                          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{element.description}</div>
                        </div>
                        <div className="text-sm font-bold text-green-600">{formatCurrency(element.amount)}</div>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-gray-900 dark:text-gray-100">Total:</span>
                        <span className="text-green-600">{formatCurrency(selectedRequest.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Justificativa</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{selectedRequest.justification}</p>
                </div>

                {selectedRequest.technicalOpinion && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Parecer Técnico</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{selectedRequest.technicalOpinion}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="mt-6">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Histórico de Mensagens</h4>
              <div className="space-y-3 max-h-40 overflow-y-auto">
                {selectedRequest.messages.map((message) => (
                  <div key={message.id} className={`p-3 rounded-lg ${
                    message.type === 'admin' 
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' 
                      : 'bg-gray-50 dark:bg-gray-700'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{message.sender}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(message.timestamp).toLocaleString('pt-BR')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{message.message}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={() => alert('Gerar relatório PDF')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Download size={16} className="mr-2" />
                Relatório PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Portaria Modal */}
      {showPortariaModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white p-6 rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText size={24} className="mr-3" />
                  <h3 className="text-xl font-bold">Gerar Portaria</h3>
                </div>
                <button
                  onClick={() => setShowPortariaModal(false)}
                  className="text-white hover:text-gray-200 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Portaria Content */}
            <div className="p-8 bg-gray-50 dark:bg-gray-700">
              {/* Document Header */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6 border-l-4 border-blue-600">
                <div className="text-center space-y-2 mb-8">
                  <h1 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-1">
                    TRIBUNAL DE JUSTIÇA DO ESTADO DO PARÁ
                  </h1>
                  <h2 className="text-lg font-semibold text-green-700 dark:text-green-400 mb-1">
                    Secretaria de Planejamento, Coordenação e Finanças
                  </h2>
                  <h3 className="text-base font-medium text-purple-600 dark:text-purple-400 mb-1">
                    Serviço de Suprimento de Fundos
                  </h3>
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg inline-block font-bold text-lg">
                    Portaria: SF-2025-{String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}
                  </div>
                </div>
              </div>

              {/* Dados do Solicitante */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg shadow-sm p-6 mb-6 border-l-4 border-blue-500">
                <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4 border-b-2 border-blue-300 dark:border-blue-600 pb-2">
                  Dados do Solicitante
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Nome:</label>
                    {isEditingPortaria ? (
                      <input
                        type="text"
                        value={portariaData.solicitanteName}
                        onChange={(e) => setPortariaData({...portariaData, solicitanteName: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-gray-100 font-medium">{portariaData.solicitanteName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Departamento:</label>
                    {isEditingPortaria ? (
                      <input
                        type="text"
                        value={portariaData.department}
                        onChange={(e) => setPortariaData({...portariaData, department: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-blue-300 dark:border-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-gray-100 font-medium">{portariaData.department}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">CPF:</label>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{selectedRequest?.requester.cpf}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Município:</label>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{selectedRequest?.requester.municipality}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Email:</label>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{selectedRequest?.requester.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Telefone:</label>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{selectedRequest?.requester.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Gestor Responsável:</label>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">{selectedRequest?.requester.manager}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Prioridade:</label>
                    <span className={`inline-flex px-3 py-1 text-sm font-bold rounded-full ${getPriorityColor(selectedRequest?.priority || 'media')}`}>
                      {selectedRequest?.priority === 'alta' ? 'Alta' : 
                       selectedRequest?.priority === 'media' ? 'Média' : 
                       selectedRequest?.priority === 'baixa' ? 'Baixa' : 'Urgente'}
                    </span>
                  </div>
                </div>
              </div>

              {/* PTRES e DOTAÇÕES */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg shadow-sm p-6 mb-6 border-l-4 border-green-500">
                <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-4 border-b-2 border-green-300 dark:border-green-600 pb-2">
                  Dados Orçamentários
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">PTRES *</label>
                    {isEditingPortaria ? (
                      <input
                        type="number"
                        value={portariaData.ptres}
                        onChange={(e) => setPortariaData({...portariaData, ptres: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-green-300 dark:border-green-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Digite o PTRES"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-gray-100 font-medium bg-green-100 dark:bg-green-800 px-3 py-2 rounded-lg">
                        {portariaData.ptres || 'Não informado'}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">DOTAÇÕES * (Texto Editável)</label>
                    {isEditingPortaria ? (
                      <textarea
                        rows={3}
                        value={portariaData.dotacoes}
                        onChange={(e) => setPortariaData({...portariaData, dotacoes: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-green-300 dark:border-green-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                        placeholder="Digite as DOTAÇÕES (ex: 02.061.0571.4256.0001 - Manutenção e Funcionamento do Poder Judiciário)"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-gray-100 font-medium bg-green-100 dark:bg-green-800 px-3 py-2 rounded-lg">
                        {portariaData.dotacoes || 'Não informado'}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Prazos */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg shadow-sm p-6 mb-6 border-l-4 border-purple-500">
                <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-4 border-b-2 border-purple-300 dark:border-purple-600 pb-2">
                  Prazos
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Prazo de Aplicação:</label>
                    <div className="flex items-center space-x-3">
                      {isEditingPortaria ? (
                        <>
                          <input
                            type="date"
                            value={portariaData.prazoAplicacaoInicio}
                            onChange={(e) => setPortariaData({...portariaData, prazoAplicacaoInicio: e.target.value})}
                            className="px-3 py-2 border-2 border-purple-300 dark:border-purple-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                          <span className="text-gray-500 font-medium">até</span>
                          <input
                            type="date"
                            value={portariaData.prazoAplicacaoFim}
                            onChange={(e) => setPortariaData({...portariaData, prazoAplicacaoFim: e.target.value})}
                            className="px-3 py-2 border-2 border-purple-300 dark:border-purple-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        </>
                      ) : (
                        <p className="text-gray-900 dark:text-gray-100 font-medium bg-purple-100 dark:bg-purple-800 px-3 py-2 rounded-lg">
                          {portariaData.prazoAplicacaoInicio ? new Date(portariaData.prazoAplicacaoInicio).toLocaleDateString('pt-BR') : 'Não informado'} até {portariaData.prazoAplicacaoFim ? new Date(portariaData.prazoAplicacaoFim).toLocaleDateString('pt-BR') : 'Não informado'}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Prazo de Prestação de Contas:</label>
                    <div className="flex items-center space-x-3">
                      {isEditingPortaria ? (
                        <>
                          <input
                            type="date"
                            value={portariaData.prazoPrestacaoInicio}
                            onChange={(e) => setPortariaData({...portariaData, prazoPrestacaoInicio: e.target.value})}
                            className="px-3 py-2 border-2 border-purple-300 dark:border-purple-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                          <span className="text-gray-500 font-medium">até</span>
                          <input
                            type="date"
                            value={portariaData.prazoPrestacaoFim}
                            onChange={(e) => setPortariaData({...portariaData, prazoPrestacaoFim: e.target.value})}
                            className="px-3 py-2 border-2 border-purple-300 dark:border-purple-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          />
                        </>
                      ) : (
                        <p className="text-gray-900 dark:text-gray-100 font-medium bg-purple-100 dark:bg-purple-800 px-3 py-2 rounded-lg">
                          {portariaData.prazoPrestacaoInicio ? new Date(portariaData.prazoPrestacaoInicio).toLocaleDateString('pt-BR') : 'Não informado'} até {portariaData.prazoPrestacaoFim ? new Date(portariaData.prazoPrestacaoFim).toLocaleDateString('pt-BR') : 'Não informado'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Justificativa (Finalidade) */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg shadow-sm p-6 mb-6 border-l-4 border-yellow-500">
                <h4 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-4 border-b-2 border-yellow-300 dark:border-yellow-600 pb-2">
                  Finalidade
                </h4>
                {isEditingPortaria ? (
                  <textarea
                    value={portariaData.justification}
                    onChange={(e) => setPortariaData({...portariaData, justification: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border-2 border-yellow-300 dark:border-yellow-600 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                  />
                ) : (
                  <p className="text-gray-900 dark:text-gray-100 leading-relaxed bg-yellow-100 dark:bg-yellow-800 p-4 rounded-lg font-medium">{portariaData.justification}</p>
                )}
              </div>

              {/* Elementos de Despesa */}
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-lg shadow-sm p-6 mb-6 border-l-4 border-indigo-500">
                <h4 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200 mb-4 border-b-2 border-indigo-300 dark:border-indigo-600 pb-2">
                  Elementos de Despesa
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border-2 border-indigo-300 dark:border-indigo-600 rounded-lg overflow-hidden">
                    <thead className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white">
                      <tr>
                        <th className="border border-indigo-400 px-4 py-3 text-left text-sm font-bold">
                          Código
                        </th>
                        <th className="border border-indigo-400 px-4 py-3 text-left text-sm font-bold">
                          Descrição
                        </th>
                        <th className="border border-indigo-400 px-4 py-3 text-right text-sm font-bold">
                          Valor (R$)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800">
                      {selectedRequest?.elements.map((element, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-indigo-50 dark:bg-indigo-900/10' : 'bg-white dark:bg-gray-800'}>
                          <td className="border border-indigo-200 dark:border-indigo-700 px-4 py-3 text-sm font-mono text-gray-900 dark:text-gray-100">
                            {element.code}
                          </td>
                          <td className="border border-indigo-200 dark:border-indigo-700 px-4 py-3 text-sm font-medium text-gray-900 dark:text-gray-100">
                            {element.description}
                          </td>
                          <td className="border border-indigo-200 dark:border-indigo-700 px-4 py-3 text-sm text-right font-bold text-green-600 dark:text-green-400">
                            {element.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-gray-100 dark:bg-gray-600 font-bold">
                        <td colSpan={2} className="border border-indigo-200 dark:border-indigo-700 px-4 py-3 text-sm text-right text-gray-900 dark:text-gray-100 font-bold">
                          Total da Solicitação:
                        </td>
                        <td className="border border-indigo-200 dark:border-indigo-700 px-4 py-3 text-sm text-right text-green-600 dark:text-green-400 font-bold text-lg">
                          {selectedRequest?.totalAmount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Ordenador de Despesa */}
              <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-lg shadow-sm p-6 mb-6 border-l-4 border-red-500">
                <h4 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-4 border-b-2 border-red-300 dark:border-red-600 pb-2">
                  Ordenador de Despesa
                </h4>
                <div className="bg-red-100 dark:bg-red-800 p-4 rounded-lg">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Nome do Ordenador de Despesa *
                    </label>
                    {isEditingPortaria ? (
                      <input
                        type="text"
                        value={portariaData.ordenadorDespesa}
                        onChange={(e) => setPortariaData({...portariaData, ordenadorDespesa: e.target.value})}
                        className="w-full px-3 py-2 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-center font-bold text-lg"
                        placeholder="Nome do Ordenador de Despesa"
                      />
                    ) : (
                      <div className="px-3 py-2 bg-white dark:bg-gray-700 border-2 border-red-300 rounded-lg text-gray-900 dark:text-gray-100 text-center font-bold text-lg">
                        {portariaData.ordenadorDespesa}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-bold">Data de Geração:</span> {new Date().toLocaleString('pt-BR')}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 px-6 py-4 rounded-b-lg flex justify-end space-x-3">
              <button
                onClick={() => setShowPortariaModal(false)}
                className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 border-2 border-gray-300 dark:border-gray-500 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-500 transition-colors font-medium"
              >
                Fechar
              </button>
              
              <button
                onClick={savePortaria}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center font-medium shadow-lg"
              >
                <Save size={16} className="mr-2" />
                Salvar
              </button>
              
              <button
                onClick={() => setIsEditingPortaria(!isEditingPortaria)}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center font-medium shadow-lg"
              >
                <Edit size={16} className="mr-2" />
                {isEditingPortaria ? 'Visualizar' : 'Editar'}
              </button>
              
              <button
                onClick={() => window.print()}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 flex items-center font-medium shadow-lg"
              >
                <Printer size={16} className="mr-2" />
                Imprimir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Estilos para impressão A4 */}
      <style jsx>{`
        @media print {
          /* Reset geral para impressão */
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Configuração da página A4 */
          @page {
            size: A4 portrait;
            margin: 8mm 10mm;
            padding: 0;
          }

          /* Container principal */
          .print-container {
            width: 100% !important;
            max-width: none !important;
            font-size: 10px !important;
            line-height: 1.3 !important;
            color: #000 !important;
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Cabeçalho */
          .print-container h1 {
            font-size: 12px !important;
            margin: 2mm 0 !important;
            text-align: center !important;
            font-weight: bold !important;
          }

          .print-container h2 {
            font-size: 11px !important;
            margin: 1mm 0 !important;
            text-align: center !important;
          }

          .print-container h3 {
            font-size: 10px !important;
            margin: 1mm 0 !important;
            font-weight: bold !important;
            border-bottom: 1px solid #000 !important;
            padding-bottom: 1mm !important;
          }

          /* Seções */
          .print-container > div {
            margin-bottom: 3mm !important;
            padding: 2mm !important;
            border: 1px solid #000 !important;
            border-radius: 0 !important;
            background: white !important;
            page-break-inside: avoid !important;
          }

          /* Grid responsivo para impressão */
          .grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 2mm !important;
          }

          /* Campos de entrada */
          .print-container input,
          .print-container textarea,
          .print-container div[class*="border"] {
            border: none !important;
            border-bottom: 1px solid #000 !important;
            background: transparent !important;
            padding: 1mm 0 !important;
            font-size: 10px !important;
            color: #000 !important;
          }

          /* Tabelas */
          .print-container table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin: 2mm 0 !important;
            font-size: 9px !important;
          }

          .print-container th,
          .print-container td {
            border: 1px solid #000 !important;
            padding: 1mm !important;
            text-align: left !important;
          }

          .print-container th {
            background: #f0f0f0 !important;
            font-weight: bold !important;
          }

          /* Labels */
          .print-container label {
            font-weight: bold !important;
            font-size: 9px !important;
            color: #000 !important;
            margin-bottom: 1mm !important;
            display: block !important;
          }

          /* Botões e elementos não imprimíveis */
          .no-print,
          button,
          .print-container button {
            display: none !important;
          }

          /* Quebras de página */
          .page-break {
            page-break-before: always !important;
          }

          /* Evitar quebras indesejadas */
          .avoid-break {
            page-break-inside: avoid !important;
          }

          /* Ajustes específicos para campos de texto */
          .print-container textarea {
            min-height: 8mm !important;
            border: 1px solid #000 !important;
            padding: 1mm !important;
          }

          /* Ordenador de despesa com cor escura */
          .print-container .ordenador-nome {
            color: #000 !important;
            font-weight: bold !important;
            font-size: 11px !important;
            text-align: center !important;
            border: 1px solid #000 !important;
            padding: 2mm !important;
          }

          /* Otimização do espaçamento */
          .print-container .mb-6 {
            margin-bottom: 2mm !important;
          }

          .print-container .p-6 {
            padding: 2mm !important;
          }

          /* Total destacado */
          .print-container .total-value {
            font-size: 12px !important;
            font-weight: bold !important;
            color: #000 !important;
            text-align: right !important;
            border: 2px solid #000 !important;
            padding: 2mm !important;
          }
        }
      `}</style>
    </div>
  );
};

export default RequestAnalysis;