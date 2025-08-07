import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  Download,
  Upload,
  FileText,
  DollarSign,
  Calendar,
  User,
  Building,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  Save,
  Send,
  MessageSquare,
  Bell,
  Paperclip,
  Image,
  File,
  ExternalLink,
  RefreshCw,
  Archive,
  Star,
  Flag,
  ChevronDown,
  ChevronUp,
  Info,
  Zap
} from 'lucide-react';

interface SupplyRequest {
  id: string;
  protocol: string;
  requesterId: string;
  requesterName: string;
  requesterDepartment: string;
  totalAmount: number;
  justification: string;
  usageDeadline: string;
  status: 'pendente' | 'em_analise' | 'aprovado' | 'rejeitado' | 'cancelado';
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  createdAt: string;
  updatedAt: string;
  analyzedBy?: string;
  analysisDate?: string;
  technicalOpinion?: string;
  portariaNumber?: string;
  portariaDate?: string;
  observations?: string;
  attachments?: FileAttachment[];
  messages?: Message[];
  alerts?: Alert[];
}

interface FileAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'administrador' | 'suprido';
  content: string;
  timestamp: string;
  read: boolean;
  attachments?: FileAttachment[];
}

interface Alert {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'baixa' | 'media' | 'alta';
  actionRequired?: boolean;
}

const SupplyFundsModule: React.FC = () => {
  const { user, canAccessModule } = useAuth();
  const [requests, setRequests] = useState<SupplyRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<SupplyRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState<SupplyRequest | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showMessagesModal, setShowMessagesModal] = useState(false);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  const [dragOver, setDragOver] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [messageAttachments, setMessageAttachments] = useState<File[]>([]);

  // Dados simulados
  useEffect(() => {
    const mockRequests: SupplyRequest[] = [
      {
        id: '1',
        protocol: 'SF-2024-0001',
        requesterId: user?.id || '1',
        requesterName: user?.name || 'João Silva Santos',
        requesterDepartment: 'Vara Criminal',
        totalAmount: 15000,
        justification: 'Aquisição de material de escritório e equipamentos para modernização do setor',
        usageDeadline: '2024-03-15',
        status: 'em_analise',
        priority: 'alta',
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-16T14:20:00Z',
        analyzedBy: 'Admin Sistema',
        analysisDate: '2024-01-16T14:20:00Z',
        technicalOpinion: 'Solicitação em análise. Documentação completa.',
        observations: 'Aguardando aprovação final da diretoria.',
        attachments: [
          {
            id: 'att1',
            name: 'orcamento_material.pdf',
            type: 'application/pdf',
            size: 2048576,
            url: '#',
            uploadedAt: '2024-01-15T10:35:00Z',
            uploadedBy: 'João Silva Santos'
          },
          {
            id: 'att2',
            name: 'justificativa_detalhada.docx',
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            size: 1024000,
            url: '#',
            uploadedAt: '2024-01-15T10:40:00Z',
            uploadedBy: 'João Silva Santos'
          }
        ],
        messages: [
          {
            id: 'msg1',
            senderId: 'admin1',
            senderName: 'Admin Sistema',
            senderRole: 'administrador',
            content: 'Solicitação recebida e em análise. Por favor, aguarde retorno em até 5 dias úteis.',
            timestamp: '2024-01-16T09:00:00Z',
            read: true
          },
          {
            id: 'msg2',
            senderId: user?.id || '1',
            senderName: user?.name || 'João Silva Santos',
            senderRole: 'suprido',
            content: 'Obrigado pela confirmação. Fico no aguardo do retorno.',
            timestamp: '2024-01-16T09:15:00Z',
            read: true
          }
        ],
        alerts: [
          {
            id: 'alert1',
            type: 'info',
            title: 'Solicitação em Análise',
            message: 'Sua solicitação está sendo analisada pela equipe técnica.',
            timestamp: '2024-01-16T14:20:00Z',
            read: false,
            priority: 'media'
          }
        ]
      },
      {
        id: '2',
        protocol: 'SF-2024-0002',
        requesterId: user?.id || '1',
        requesterName: user?.name || 'João Silva Santos',
        requesterDepartment: 'Vara Criminal',
        totalAmount: 8500,
        justification: 'Despesas com transporte para diligências urgentes',
        usageDeadline: '2024-02-28',
        status: 'aprovado',
        priority: 'urgente',
        createdAt: '2024-01-10T08:15:00Z',
        updatedAt: '2024-01-12T16:45:00Z',
        analyzedBy: 'Admin Sistema',
        analysisDate: '2024-01-12T16:45:00Z',
        technicalOpinion: 'Solicitação aprovada. Valor liberado conforme solicitado.',
        portariaNumber: 'PORT-2024-001',
        portariaDate: '2024-01-12',
        attachments: [
          {
            id: 'att3',
            name: 'planilha_custos.xlsx',
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            size: 512000,
            url: '#',
            uploadedAt: '2024-01-10T08:20:00Z',
            uploadedBy: 'João Silva Santos'
          }
        ],
        messages: [
          {
            id: 'msg3',
            senderId: 'admin1',
            senderName: 'Admin Sistema',
            senderRole: 'administrador',
            content: 'Solicitação aprovada! Portaria emitida. Valor disponível para utilização.',
            timestamp: '2024-01-12T16:45:00Z',
            read: true
          }
        ],
        alerts: [
          {
            id: 'alert2',
            type: 'success',
            title: 'Solicitação Aprovada',
            message: 'Sua solicitação foi aprovada e o valor está disponível.',
            timestamp: '2024-01-12T16:45:00Z',
            read: true,
            priority: 'alta'
          }
        ]
      }
    ];

    setRequests(mockRequests);
    setFilteredRequests(mockRequests);
  }, [user]);

  // Filtros
  useEffect(() => {
    let filtered = requests.filter(request => {
      const matchesSearch = 
        request.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.justification.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
      
      // Se não for admin, mostrar apenas próprias solicitações
      const matchesUser = user?.role === 'administrador' || request.requesterId === user?.id;
      
      return matchesSearch && matchesStatus && matchesPriority && matchesUser;
    });

    setFilteredRequests(filtered);
  }, [requests, searchTerm, statusFilter, priorityFilter, user]);

  const getStatusColor = (status: string) => {
    const colors = {
      pendente: 'bg-yellow-100 text-yellow-800',
      em_analise: 'bg-blue-100 text-blue-800',
      aprovado: 'bg-green-100 text-green-800',
      rejeitado: 'bg-red-100 text-red-800',
      cancelado: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      baixa: 'bg-gray-100 text-gray-800',
      media: 'bg-blue-100 text-blue-800',
      alta: 'bg-orange-100 text-orange-800',
      urgente: 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <Image size={16} className="text-green-600" />;
    if (type.includes('pdf')) return <FileText size={16} className="text-red-600" />;
    if (type.includes('word')) return <FileText size={16} className="text-blue-600" />;
    if (type.includes('excel') || type.includes('spreadsheet')) return <FileText size={16} className="text-green-600" />;
    return <File size={16} className="text-gray-600" />;
  };

  // Upload de arquivos
  const handleFileUpload = async (files: FileList | File[], requestId?: string) => {
    const fileArray = Array.from(files);
    
    for (const file of fileArray) {
      // Validações
      if (file.size > 10 * 1024 * 1024) { // 10MB
        alert(`Arquivo ${file.name} é muito grande. Máximo 10MB.`);
        continue;
      }

      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];

      if (!allowedTypes.includes(file.type)) {
        alert(`Tipo de arquivo ${file.name} não permitido.`);
        continue;
      }

      // Simular upload com progresso
      const fileId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

      // Simular progresso
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
      }

      // Adicionar arquivo à lista
      const newAttachment: FileAttachment = {
        id: fileId,
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString(),
        uploadedBy: user?.name || 'Usuário'
      };

      if (requestId) {
        setRequests(prev => prev.map(req => 
          req.id === requestId 
            ? { ...req, attachments: [...(req.attachments || []), newAttachment] }
            : req
        ));
      }

      // Remover progresso
      setTimeout(() => {
        setUploadProgress(prev => {
          const newProgress = { ...prev };
          delete newProgress[fileId];
          return newProgress;
        });
      }, 1000);
    }
  };

  // Drag and Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent, requestId?: string) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files, requestId);
    }
  };

  // Enviar mensagem
  const sendMessage = (requestId: string) => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: user?.id || '',
      senderName: user?.name || '',
      senderRole: user?.role || 'suprido',
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
      attachments: messageAttachments.map(file => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        uploadedAt: new Date().toISOString(),
        uploadedBy: user?.name || 'Usuário'
      }))
    };

    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, messages: [...(req.messages || []), message] }
        : req
    ));

    setNewMessage('');
    setMessageAttachments([]);

    // Simular resposta automática do admin (apenas para demo)
    if (user?.role !== 'administrador') {
      setTimeout(() => {
        const autoReply: Message = {
          id: Date.now().toString() + '_auto',
          senderId: 'admin1',
          senderName: 'Admin Sistema',
          senderRole: 'administrador',
          content: 'Mensagem recebida. Retornaremos em breve.',
          timestamp: new Date().toISOString(),
          read: false
        };

        setRequests(prev => prev.map(req => 
          req.id === requestId 
            ? { ...req, messages: [...(req.messages || []), autoReply] }
            : req
        ));
      }, 2000);
    }
  };

  // Marcar alertas como lidos
  const markAlertAsRead = (requestId: string, alertId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { 
            ...req, 
            alerts: req.alerts?.map(alert => 
              alert.id === alertId ? { ...alert, read: true } : alert
            ) 
          }
        : req
    ));
  };

  // Estatísticas
  const stats = {
    total: filteredRequests.length,
    pendente: filteredRequests.filter(r => r.status === 'pendente').length,
    em_analise: filteredRequests.filter(r => r.status === 'em_analise').length,
    aprovado: filteredRequests.filter(r => r.status === 'aprovado').length,
    rejeitado: filteredRequests.filter(r => r.status === 'rejeitado').length,
    totalAmount: filteredRequests.reduce((sum, r) => sum + r.totalAmount, 0),
    unreadAlerts: filteredRequests.reduce((sum, r) => sum + (r.alerts?.filter(a => !a.read).length || 0), 0),
    unreadMessages: filteredRequests.reduce((sum, r) => sum + (r.messages?.filter(m => !m.read && m.senderId !== user?.id).length || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
            <DollarSign size={24} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {user?.role === 'administrador' ? 'Gestão de Suprimento de Fundos' : 'Minhas Solicitações de Suprimento'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {user?.role === 'administrador' 
                ? 'Analise e gerencie todas as solicitações de suprimento de fundos' 
                : 'Acompanhe suas solicitações e comunique-se com os administradores'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Alertas */}
          {stats.unreadAlerts > 0 && (
            <button
              onClick={() => setShowAlertsModal(true)}
              className="relative flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Bell size={16} className="mr-2" />
              Alertas
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {stats.unreadAlerts}
              </span>
            </button>
          )}

          {/* Mensagens */}
          {stats.unreadMessages > 0 && (
            <button
              onClick={() => setShowMessagesModal(true)}
              className="relative flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <MessageSquare size={16} className="mr-2" />
              Mensagens
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {stats.unreadMessages}
              </span>
            </button>
          )}

          <button
            onClick={() => {
              setSelectedRequest(null);
              setIsEditing(false);
              setShowRequestModal(true);
            }}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Nova Solicitação
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total de Solicitações</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <FileText size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Valor Total</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalAmount)}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Em Análise</p>
              <p className="text-2xl font-bold text-orange-600">{stats.em_analise}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <Clock size={24} className="text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Aprovadas</p>
              <p className="text-2xl font-bold text-green-600">{stats.aprovado}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Buscar por protocolo, nome ou justificativa..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos os Status</option>
              <option value="pendente">Pendente</option>
              <option value="em_analise">Em Análise</option>
              <option value="aprovado">Aprovado</option>
              <option value="rejeitado">Rejeitado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>

          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
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

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPriorityFilter('all');
              }}
              className="flex items-center px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
            >
              <RefreshCw size={16} className="mr-2" />
              Limpar
            </button>
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
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Prioridade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Alertas
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
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{request.protocol}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(request.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      {request.attachments && request.attachments.length > 0 && (
                        <Paperclip size={14} className="ml-2 text-gray-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{request.requesterName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{request.requesterDepartment}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(request.totalAmount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                      {request.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                      {request.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {request.alerts && request.alerts.filter(a => !a.read).length > 0 && (
                        <div className="flex items-center">
                          <Bell size={16} className="text-orange-500 mr-1" />
                          <span className="text-sm text-orange-600">
                            {request.alerts.filter(a => !a.read).length}
                          </span>
                        </div>
                      )}
                      {request.messages && request.messages.filter(m => !m.read && m.senderId !== user?.id).length > 0 && (
                        <div className="flex items-center">
                          <MessageSquare size={16} className="text-blue-500 mr-1" />
                          <span className="text-sm text-blue-600">
                            {request.messages.filter(m => !m.read && m.senderId !== user?.id).length}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => setSelectedRequest(request)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Ver detalhes"
                    >
                      <Eye size={16} />
                    </button>
                    {(user?.role === 'administrador' || request.requesterId === user?.id) && (
                      <button
                        onClick={() => {
                          setSelectedRequest(request);
                          setIsEditing(true);
                          setShowRequestModal(true);
                        }}
                        className="text-green-600 hover:text-green-900"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedRequest(request);
                        setShowMessagesModal(true);
                      }}
                      className="text-purple-600 hover:text-purple-900"
                      title="Mensagens"
                    >
                      <MessageSquare size={16} />
                    </button>
                    {user?.role === 'administrador' && (
                      <button
                        onClick={() => setShowDeleteConfirm(request.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Nenhuma solicitação encontrada</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Tente ajustar os filtros de busca.' 
                : 'Não há solicitações cadastradas no momento.'}
            </p>
          </div>
        )}
      </div>

      {/* Request Details Modal */}
      {selectedRequest && !showRequestModal && !showMessagesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Detalhes da Solicitação - {selectedRequest.protocol}
              </h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Informações Básicas</h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Protocolo:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedRequest.protocol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Solicitante:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedRequest.requesterName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Departamento:</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedRequest.requesterDepartment}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Valor Total:</span>
                      <span className="text-sm font-medium text-green-600">{formatCurrency(selectedRequest.totalAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedRequest.status)}`}>
                        {selectedRequest.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Prioridade:</span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedRequest.priority)}`}>
                        {selectedRequest.priority.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Justificativa</h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-sm text-gray-900 dark:text-gray-100">{selectedRequest.justification}</p>
                  </div>
                </div>

                {selectedRequest.technicalOpinion && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Parecer Técnico</h4>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                      <p className="text-sm text-blue-900 dark:text-blue-100">{selectedRequest.technicalOpinion}</p>
                      {selectedRequest.analyzedBy && (
                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                          Por: {selectedRequest.analyzedBy} em {new Date(selectedRequest.analysisDate!).toLocaleString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Anexos e Comunicação */}
              <div className="space-y-4">
                {/* Anexos */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Anexos ({selectedRequest.attachments?.length || 0})
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    {selectedRequest.attachments && selectedRequest.attachments.length > 0 ? (
                      <div className="space-y-2">
                        {selectedRequest.attachments.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-600 rounded border">
                            <div className="flex items-center space-x-2">
                              {getFileIcon(file.type)}
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{file.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString('pt-BR')}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => window.open(file.url, '_blank')}
                              className="text-blue-600 hover:text-blue-800"
                              title="Visualizar arquivo"
                            >
                              <ExternalLink size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                        Nenhum anexo disponível
                      </p>
                    )}

                    {/* Upload Area */}
                    <div
                      className={`mt-4 border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                        dragOver 
                          ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, selectedRequest.id)}
                    >
                      <Upload size={24} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Arraste arquivos aqui ou{' '}
                        <label className="text-blue-600 hover:text-blue-800 cursor-pointer">
                          clique para selecionar
                          <input
                            type="file"
                            multiple
                            className="hidden"
                            onChange={(e) => e.target.files && handleFileUpload(e.target.files, selectedRequest.id)}
                          />
                        </label>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        PDF, DOC, XLS, JPG, PNG (máx. 10MB)
                      </p>
                    </div>

                    {/* Upload Progress */}
                    {Object.keys(uploadProgress).length > 0 && (
                      <div className="mt-4 space-y-2">
                        {Object.entries(uploadProgress).map(([fileId, progress]) => (
                          <div key={fileId} className="bg-white dark:bg-gray-600 rounded p-2">
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-gray-700 dark:text-gray-300">Enviando...</span>
                              <span className="text-gray-500 dark:text-gray-400">{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Alertas Recentes */}
                {selectedRequest.alerts && selectedRequest.alerts.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Alertas Recentes
                    </h4>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2">
                      {selectedRequest.alerts.slice(0, 3).map((alert) => (
                        <div 
                          key={alert.id} 
                          className={`p-3 rounded border-l-4 ${
                            alert.type === 'success' ? 'border-green-400 bg-green-50 dark:bg-green-900/20' :
                            alert.type === 'warning' ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' :
                            alert.type === 'error' ? 'border-red-400 bg-red-50 dark:bg-red-900/20' :
                            'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{alert.title}</p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{alert.message}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {new Date(alert.timestamp).toLocaleString('pt-BR')}
                              </p>
                            </div>
                            {!alert.read && (
                              <button
                                onClick={() => markAlertAsRead(selectedRequest.id, alert.id)}
                                className="text-blue-600 hover:text-blue-800 text-xs"
                              >
                                Marcar como lido
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  setSelectedRequest(selectedRequest);
                  setShowMessagesModal(true);
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
              >
                <MessageSquare size={16} className="mr-2" />
                Mensagens
              </button>
              {(user?.role === 'administrador' || selectedRequest.requesterId === user?.id) && (
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowRequestModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Edit size={16} className="mr-2" />
                  Editar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Messages Modal */}
      {showMessagesModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Mensagens - {selectedRequest.protocol}
              </h3>
              <button
                onClick={() => setShowMessagesModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            {/* Messages List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedRequest.messages && selectedRequest.messages.length > 0 ? (
                selectedRequest.messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === user?.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">
                          {message.senderName}
                        </span>
                        <span className={`text-xs ${
                          message.senderId === user?.id ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {new Date(message.timestamp).toLocaleString('pt-BR')}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.attachments.map((file) => (
                            <div key={file.id} className="flex items-center space-x-2 text-xs">
                              {getFileIcon(file.type)}
                              <span>{file.name}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageSquare size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Nenhuma mensagem ainda</p>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-6">
              <div className="space-y-3">
                {/* File attachments preview */}
                {messageAttachments.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {messageAttachments.map((file, index) => (
                      <div key={index} className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 rounded px-2 py-1">
                        {getFileIcon(file.type)}
                        <span className="text-xs text-gray-700 dark:text-gray-300">{file.name}</span>
                        <button
                          onClick={() => setMessageAttachments(prev => prev.filter((_, i) => i !== index))}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Digite sua mensagem..."
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                      rows={2}
                    />
                  </div>
                  <div className="flex flex-col space-y-2">
                    <label className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      <Paperclip size={16} className="text-gray-600 dark:text-gray-400" />
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files) {
                            setMessageAttachments(prev => [...prev, ...Array.from(e.target.files!)]);
                          }
                        }}
                      />
                    </label>
                    <button
                      onClick={() => sendMessage(selectedRequest.id)}
                      disabled={!newMessage.trim()}
                      className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alerts Modal */}
      {showAlertsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Alertas do Sistema
              </h3>
              <button
                onClick={() => setShowAlertsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {requests.flatMap(req => req.alerts || []).filter(alert => !alert.read).length > 0 ? (
                requests.flatMap(req => 
                  (req.alerts || []).filter(alert => !alert.read).map(alert => ({
                    ...alert,
                    requestProtocol: req.protocol,
                    requestId: req.id
                  }))
                ).map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`p-4 rounded-lg border-l-4 ${
                      alert.type === 'success' ? 'border-green-400 bg-green-50 dark:bg-green-900/20' :
                      alert.type === 'warning' ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' :
                      alert.type === 'error' ? 'border-red-400 bg-red-50 dark:bg-red-900/20' :
                      'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            alert.priority === 'alta' ? 'bg-red-100 text-red-800' :
                            alert.priority === 'media' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {alert.priority.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {alert.requestProtocol}
                          </span>
                        </div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                          {alert.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {alert.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(alert.timestamp).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <button
                        onClick={() => markAlertAsRead(alert.requestId, alert.id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium ml-4"
                      >
                        Marcar como lido
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Bell size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Nenhum alerta pendente</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplyFundsModule;