import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileText, 
  Download,
  Eye,
  MessageSquare,
  Edit,
  Trash2,
  Plus,
  Send,
  Paperclip,
  Clock,
  User,
  DollarSign,
  Calendar,
  MapPin,
  Building,
  Phone,
  Mail,
  Users,
  TrendingUp,
  AlertCircle,
  CheckSquare,
  PlayCircle,
  ArrowLeft,
  Upload
} from 'lucide-react';

interface ReimbursementRecord {
  id: string;
  protocolNumber: string;
  requester: string;
  cpf: string;
  email: string;
  phone: string;
  department: string;
  municipality: string;
  category: string;
  totalAmount: number;
  approvedAmount?: number;
  description: string;
  expenseDate: string;
  location: string;
  status: 'pendente' | 'em_analise' | 'aprovado' | 'rejeitado' | 'glosado' | 'reanalise' | 'assessoria_juridica' | 'fabio' | 'inss' | 'baixa_siafe' | 'arquivo';
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  justification: string;
  documents: DocumentItem[];
  messages: Message[];
  createdAt: string;
  checklist: ChecklistItem[];
  observations: string;
}

interface DocumentItem {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadDate: string;
  url: string;
}

interface Message {
  id: string;
  sender: 'admin' | 'user';
  senderName: string;
  content: string;
  timestamp: string;
  attachments?: Attachment[];
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
}

interface ChecklistItem {
  id: string;
  criterion: string;
  status: 'sim' | 'nao' | 'na';
  required: boolean;
}

const ReimbursementAnalysis: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<ReimbursementRecord | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [messageAttachments, setMessageAttachments] = useState<File[]>([]);
  const [currentMessageRecord, setCurrentMessageRecord] = useState<ReimbursementRecord | null>(null);
  const [showAnalysisView, setShowAnalysisView] = useState(false);
  const [currentAnalysisRecord, setCurrentAnalysisRecord] = useState<ReimbursementRecord | null>(null);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | 'gloss' | null>(null);

  // Dados simulados
  const [records, setRecords] = useState<ReimbursementRecord[]>([
    {
      id: '1',
      protocolNumber: 'RB-2024-001',
      requester: 'Ana Paula Silva',
      cpf: '456.789.123-00',
      email: 'ana.silva@tjpa.jus.br',
      phone: '(91) 99999-8888',
      department: 'Vara da Fazenda Pública',
      municipality: 'Belém',
      category: 'Transporte',
      totalAmount: 850.00,
      approvedAmount: 800.00,
      description: 'Deslocamento para audiência em comarca do interior - Viagem de Belém para Santarém',
      expenseDate: '2024-01-15',
      location: 'Santarém - PA',
      status: 'pendente',
      priority: 'alta',
      justification: 'Necessário deslocamento para audiência urgente em comarca do interior.',
      documents: [
        { 
          id: '1', 
          name: 'Comprovante_Passagem.pdf', 
          type: 'Comprovante de Transporte', 
          size: 256000,
          uploadDate: '2024-01-16',
          url: '#'
        },
        { 
          id: '2', 
          name: 'Recibo_Taxi.jpg', 
          type: 'Recibo de Taxi', 
          size: 128000,
          uploadDate: '2024-01-16',
          url: '#'
        },
        { 
          id: '3', 
          name: 'Declaracao_Viagem.pdf', 
          type: 'Declaração de Viagem', 
          size: 512000,
          uploadDate: '2024-01-16',
          url: '#'
        }
      ],
      messages: [
        {
          id: '1',
          sender: 'user',
          senderName: 'Ana Paula Silva',
          content: 'Solicitação de reembolso enviada para análise.',
          timestamp: '2024-01-16 10:30'
        }
      ],
      createdAt: '2024-01-16',
      checklist: [
        { id: '1', criterion: 'Comprovante de despesa válido e legível', status: 'na', required: true },
        { id: '2', criterion: 'Despesa relacionada a atividade oficial', status: 'na', required: true },
        { id: '3', criterion: 'Despesa realizada dentro do período autorizado', status: 'na', required: true },
        { id: '4', criterion: 'Documentação completa (recibos, notas fiscais)', status: 'na', required: true },
        { id: '5', criterion: 'Valor compatível com os limites estabelecidos', status: 'na', required: true },
        { id: '6', criterion: 'Dados bancários do solicitante conferem', status: 'na', required: true },
        { id: '7', criterion: 'Justificativa adequada para a despesa', status: 'na', required: true }
      ],
      observations: 'Registre aqui observações importantes sobre a análise do reembolso...'
    },
    {
      id: '2',
      protocolNumber: 'RB-2024-002',
      requester: 'Carlos Mendes Santos',
      cpf: '789.123.456-00',
      email: 'carlos.mendes@tjpa.jus.br',
      phone: '(91) 88888-7777',
      department: 'Vara Criminal',
      municipality: 'Santarém',
      category: 'Alimentação',
      totalAmount: 320.00,
      description: 'Despesas com alimentação durante viagem a trabalho',
      expenseDate: '2024-01-10',
      location: 'Marabá - PA',
      status: 'aprovado',
      priority: 'media',
      justification: 'Despesas com alimentação durante audiência em comarca distante.',
      documents: [
        { 
          id: '4', 
          name: 'Nota_Fiscal_Restaurante.pdf', 
          type: 'Nota Fiscal', 
          size: 180000,
          uploadDate: '2024-01-11',
          url: '#'
        },
        { 
          id: '5', 
          name: 'Comprovante_Hotel.jpg', 
          type: 'Comprovante de Hospedagem', 
          size: 220000,
          uploadDate: '2024-01-11',
          url: '#'
        }
      ],
      messages: [
        {
          id: '2',
          sender: 'user',
          senderName: 'Carlos Mendes Santos',
          content: 'Solicitação de reembolso enviada.',
          timestamp: '2024-01-11 14:20'
        },
        {
          id: '3',
          sender: 'admin',
          senderName: 'Administrador',
          content: 'Reembolso aprovado. Documentação em conformidade.',
          timestamp: '2024-01-12 09:15'
        }
      ],
      createdAt: '2024-01-11',
      checklist: [
        { id: '1', criterion: 'Comprovante de despesa válido e legível', status: 'sim', required: true },
        { id: '2', criterion: 'Despesa relacionada a atividade oficial', status: 'sim', required: true },
        { id: '3', criterion: 'Despesa realizada dentro do período autorizado', status: 'sim', required: true },
        { id: '4', criterion: 'Documentação completa (recibos, notas fiscais)', status: 'sim', required: true },
        { id: '5', criterion: 'Valor compatível com os limites estabelecidos', status: 'sim', required: true },
        { id: '6', criterion: 'Dados bancários do solicitante conferem', status: 'sim', required: true },
        { id: '7', criterion: 'Justificativa adequada para a despesa', status: 'sim', required: true }
      ],
      observations: 'Reembolso aprovado integralmente. Documentação completa e em conformidade.'
    }
  ]);

  // Estatísticas
  const stats = {
    totalRequested: records.reduce((sum, record) => sum + record.totalAmount, 0),
    totalApproved: records.filter(record => record.status === 'aprovado').reduce((sum, record) => sum + (record.approvedAmount || record.totalAmount), 0),
    totalRejected: records.filter(record => record.status === 'rejeitado').reduce((sum, record) => sum + record.totalAmount, 0),
    totalPending: records.filter(record => ['pendente', 'em_analise'].includes(record.status)).reduce((sum, record) => sum + record.totalAmount, 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-gray-100 text-gray-800';
      case 'em_analise': return 'bg-yellow-100 text-yellow-800';
      case 'aprovado': return 'bg-green-100 text-green-800';
      case 'rejeitado': return 'bg-red-100 text-red-800';
      case 'glosado': return 'bg-orange-100 text-orange-800';
      case 'reanalise': return 'bg-blue-100 text-blue-800';
      case 'assessoria_juridica': return 'bg-purple-100 text-purple-800';
      case 'fabio': return 'bg-indigo-100 text-indigo-800';
      case 'inss': return 'bg-pink-100 text-pink-800';
      case 'baixa_siafe': return 'bg-teal-100 text-teal-800';
      case 'arquivo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'em_analise': return 'Em Análise';
      case 'aprovado': return 'Aprovado';
      case 'rejeitado': return 'Rejeitado';
      case 'glosado': return 'Glosado';
      case 'reanalise': return 'Reanálise';
      case 'assessoria_juridica': return 'Assessoria Jurídica';
      case 'fabio': return 'Fábio';
      case 'inss': return 'INSS';
      case 'baixa_siafe': return 'Baixa Siafe';
      case 'arquivo': return 'Arquivo';
      default: return 'Desconhecido';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Transporte': 'bg-blue-100 text-blue-800',
      'Hospedagem': 'bg-purple-100 text-purple-800',
      'Alimentação': 'bg-green-100 text-green-800',
      'Material': 'bg-orange-100 text-orange-800',
      'Outros': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgente': return 'bg-red-100 text-red-800';
      case 'alta': return 'bg-orange-100 text-orange-800';
      case 'media': return 'bg-yellow-100 text-yellow-800';
      case 'baixa': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgente': return 'Urgente';
      case 'alta': return 'Alta';
      case 'media': return 'Média';
      case 'baixa': return 'Baixa';
      default: return 'Desconhecida';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const updateRecordStatus = (recordId: string, newStatus: string) => {
    setRecords(prev => prev.map(record => 
      record.id === recordId ? { ...record, status: newStatus as any } : record
    ));
  };

  const deleteRecord = (recordId: string) => {
    if (confirm('Tem certeza que deseja excluir este reembolso?')) {
      setRecords(prev => prev.filter(record => record.id !== recordId));
    }
  };

  const startAnalysis = (record: ReimbursementRecord) => {
    setCurrentAnalysisRecord(record);
    setShowAnalysisView(true);
    updateRecordStatus(record.id, 'em_analise');
  };

  const openMessageModal = (record: ReimbursementRecord, action?: 'approve' | 'reject' | 'gloss') => {
    setCurrentMessageRecord(record);
    setActionType(action || null);
    setShowMessageModal(true);
  };

  const sendMessage = () => {
    if (!currentMessageRecord || !messageContent.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'admin',
      senderName: 'Administrador',
      content: messageContent,
      timestamp: new Date().toLocaleString('pt-BR'),
      attachments: messageAttachments.map(file => ({
        id: Date.now().toString(),
        name: file.name,
        type: file.type,
        size: file.size
      }))
    };

    setRecords(prev => prev.map(record => 
      record.id === currentMessageRecord.id 
        ? { ...record, messages: [...record.messages, newMessage] }
        : record
    ));

    // Atualizar status baseado na ação
    if (actionType) {
      let newStatus = '';
      switch (actionType) {
        case 'approve': newStatus = 'aprovado'; break;
        case 'reject': newStatus = 'rejeitado'; break;
        case 'gloss': newStatus = 'glosado'; break;
      }
      if (newStatus) {
        updateRecordStatus(currentMessageRecord.id, newStatus);
      }
    }

    setMessageContent('');
    setMessageAttachments([]);
    setShowMessageModal(false);
    setCurrentMessageRecord(null);
    setActionType(null);
  };

  const updateChecklistItem = (itemId: string, status: 'sim' | 'nao' | 'na') => {
    if (!currentAnalysisRecord) return;
    
    const updatedChecklist = currentAnalysisRecord.checklist.map(item => 
      item.id === itemId ? { ...item, status } : item
    );
    
    setCurrentAnalysisRecord(prev => prev ? { ...prev, checklist: updatedChecklist } : null);
    
    setRecords(prev => prev.map(record => 
      record.id === currentAnalysisRecord.id 
        ? { ...record, checklist: updatedChecklist }
        : record
    ));
  };

  const updateObservations = (observations: string) => {
    if (!currentAnalysisRecord) return;
    
    setCurrentAnalysisRecord(prev => prev ? { ...prev, observations } : null);
    
    setRecords(prev => prev.map(record => 
      record.id === currentAnalysisRecord.id 
        ? { ...record, observations }
        : record
    ));
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.protocolNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.municipality.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const generateReport = (record: ReimbursementRecord) => {
    const reportContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relatório de Análise de Reembolso - ${record.protocolNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .section h3 { color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .field { margin-bottom: 10px; }
            .field strong { color: #374151; }
            .total { font-size: 18px; font-weight: bold; color: #059669; text-align: right; margin-top: 10px; }
            .checklist-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            .checklist-table th, .checklist-table td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
            .checklist-table th { background-color: #f3f4f6; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>TRIBUNAL DE JUSTIÇA DO PARÁ</h1>
            <h2>Relatório de Análise de Reembolso</h2>
            <p><strong>Protocolo:</strong> ${record.protocolNumber}</p>
          </div>
          
          <div class="section">
            <h3>Dados do Solicitante</h3>
            <div class="grid">
              <div>
                <div class="field"><strong>Nome:</strong> ${record.requester}</div>
                <div class="field"><strong>CPF:</strong> ${record.cpf}</div>
                <div class="field"><strong>Email:</strong> ${record.email}</div>
                <div class="field"><strong>Telefone:</strong> ${record.phone}</div>
              </div>
              <div>
                <div class="field"><strong>Departamento:</strong> ${record.department}</div>
                <div class="field"><strong>Município:</strong> ${record.municipality}</div>
                <div class="field"><strong>Categoria:</strong> ${record.category}</div>
                <div class="field"><strong>Status:</strong> ${getStatusLabel(record.status)}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>Detalhes da Despesa</h3>
            <div class="field"><strong>Data da Despesa:</strong> ${new Date(record.expenseDate).toLocaleDateString('pt-BR')}</div>
            <div class="field"><strong>Local:</strong> ${record.location}</div>
            <div class="field"><strong>Prioridade:</strong> ${getPriorityLabel(record.priority)}</div>
            <div class="field"><strong>Descrição:</strong> ${record.description}</div>
            <div class="field"><strong>Justificativa:</strong> ${record.justification}</div>
          </div>

          <div class="section">
            <h3>Valores</h3>
            <div class="field"><strong>Valor Solicitado:</strong> R$ ${record.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            ${record.approvedAmount ? `<div class="field"><strong>Valor Aprovado:</strong> R$ ${record.approvedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>` : ''}
          </div>

          <div class="section">
            <h3>Checklist de Análise</h3>
            <table class="checklist-table">
              <thead>
                <tr>
                  <th>Item Verificado</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${record.checklist.map(item => `
                  <tr>
                    <td>${item.criterion}</td>
                    <td>${item.status.toUpperCase()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h3>Observações do Analista</h3>
            <p>${record.observations}</p>
          </div>

          <div class="section">
            <p><strong>Data de Geração:</strong> ${new Date().toLocaleString('pt-BR')}</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(reportContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (showAnalysisView && currentAnalysisRecord) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setShowAnalysisView(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft size={20} />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Análise de Reembolso</h1>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">Imprimir Análise</span>
              <button 
                onClick={() => generateReport(currentAnalysisRecord)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <Download size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="space-y-8">
            {/* Status do Reembolso */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Status do Reembolso</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status Atual</label>
                  <select
                    value={currentAnalysisRecord.status}
                    onChange={(e) => {
                      updateRecordStatus(currentAnalysisRecord.id, e.target.value);
                      setCurrentAnalysisRecord(prev => prev ? { ...prev, status: e.target.value as any } : null);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="em_analise">Em Análise</option>
                    <option value="aprovado">Aprovado</option>
                    <option value="rejeitado">Rejeitado</option>
                    <option value="glosado">Glosado</option>
                    <option value="reanalise">Reanálise</option>
                    <option value="assessoria_juridica">Assessoria Jurídica</option>
                    <option value="fabio">Fábio</option>
                    <option value="inss">INSS</option>
                    <option value="baixa_siafe">Baixa Siafe</option>
                    <option value="arquivo">Arquivo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status Visual</label>
                  <div className="flex items-center pt-2">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(currentAnalysisRecord.status)}`}>
                      {getStatusLabel(currentAnalysisRecord.status)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dados do Solicitante */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Dados do Solicitante</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                  <input
                    type="text"
                    value={currentAnalysisRecord.requester}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CPF</label>
                  <input
                    type="text"
                    value={currentAnalysisRecord.cpf}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Departamento</label>
                  <input
                    type="text"
                    value={currentAnalysisRecord.department}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número do Protocolo</label>
                  <input
                    type="text"
                    value={currentAnalysisRecord.protocolNumber}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Resumo Financeiro */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo Financeiro</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-xs text-blue-600 font-medium mb-1">Valor Solicitado</div>
                  <div className="text-2xl font-bold text-blue-900">
                    R$ {currentAnalysisRecord.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-xs text-green-600 font-medium mb-1">Valor Aprovado</div>
                  <div className="text-2xl font-bold text-green-900">
                    R$ {(currentAnalysisRecord.approvedAmount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-xs text-purple-600 font-medium mb-1">Categoria</div>
                  <div className="text-lg font-bold text-purple-900">{currentAnalysisRecord.category}</div>
                </div>
              </div>
            </div>

            {/* Detalhes da Despesa */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Detalhes da Despesa</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
                  <div className="flex items-center">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getCategoryColor(currentAnalysisRecord.category)}`}>
                      {currentAnalysisRecord.category}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data da Despesa</label>
                  <div className="flex items-center text-gray-900">
                    <Calendar size={16} className="mr-2 text-gray-500" />
                    {new Date(currentAnalysisRecord.expenseDate).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Local da Despesa</label>
                  <div className="flex items-center text-gray-900">
                    <MapPin size={16} className="mr-2 text-gray-500" />
                    {currentAnalysisRecord.location}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade</label>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(currentAnalysisRecord.priority)}`}>
                    {getPriorityLabel(currentAnalysisRecord.priority)}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição da Despesa</label>
                <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                  {currentAnalysisRecord.description}
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Justificativa</label>
                <div className="p-3 bg-gray-50 rounded-lg text-gray-900">
                  {currentAnalysisRecord.justification}
                </div>
              </div>
            </div>

            {/* Documentos Anexados pelo Suprido */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">📎 Documentos Anexados pelo Solicitante</h2>
              {currentAnalysisRecord.documents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentAnalysisRecord.documents.map((doc) => (
                    <div key={doc.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <FileText size={24} className="text-blue-600 flex-shrink-0" />
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setSelectedDocument(doc);
                              setShowDocumentModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                            title="Visualizar"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => window.open(doc.url, '_blank')}
                            className="text-green-600 hover:text-green-800 text-sm"
                            title="Download"
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm mb-1 truncate" title={doc.name}>
                          {doc.name}
                        </h4>
                        <p className="text-xs text-gray-600 mb-1">{doc.type}</p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{formatFileSize(doc.size)}</span>
                          <span>{new Date(doc.uploadDate).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum documento anexado</h3>
                  <p className="text-gray-500">O solicitante não anexou documentos a este reembolso.</p>
                </div>
              )}
            </div>

            {/* Checklist Técnico de Análise */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Checklist Técnico de Análise</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Item Verificado</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-700 w-20">
                        <div className="flex items-center justify-center">
                          <CheckCircle size={16} className="text-green-600 mr-1" />
                          SIM
                        </div>
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-gray-700 w-20">
                        <div className="flex items-center justify-center">
                          <XCircle size={16} className="text-red-600 mr-1" />
                          NÃO
                        </div>
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-gray-700 w-20">
                        <div className="flex items-center justify-center">
                          <AlertCircle size={16} className="text-yellow-600 mr-1" />
                          N/A
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAnalysisRecord.checklist.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{item.criterion}</td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={item.status === 'sim'}
                            onChange={() => updateChecklistItem(item.id, 'sim')}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={item.status === 'nao'}
                            onChange={() => updateChecklistItem(item.id, 'nao')}
                            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                          />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={item.status === 'na'}
                            onChange={() => updateChecklistItem(item.id, 'na')}
                            className="w-4 h-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Anotações e Observações do Analista */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Anotações e Observações do Analista</h2>
              <textarea
                value={currentAnalysisRecord.observations}
                onChange={(e) => updateObservations(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                placeholder="Registre aqui observações importantes sobre a análise do reembolso..."
              />
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowAnalysisView(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Voltar
              </button>
              <button
                onClick={() => openMessageModal(currentAnalysisRecord, 'approve')}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Aprovar
              </button>
              <button
                onClick={() => openMessageModal(currentAnalysisRecord, 'gloss')}
                className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Glosar
              </button>
              <button
                onClick={() => openMessageModal(currentAnalysisRecord, 'reject')}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Rejeitar
              </button>
            </div>
          </div>
        </div>

        {/* Document Modal */}
        {showDocumentModal && selectedDocument && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Visualizar Documento</h3>
                <button
                  onClick={() => setShowDocumentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Nome:</strong> {selectedDocument.name}</div>
                    <div><strong>Tipo:</strong> {selectedDocument.type}</div>
                    <div><strong>Tamanho:</strong> {formatFileSize(selectedDocument.size)}</div>
                    <div><strong>Data:</strong> {new Date(selectedDocument.uploadDate).toLocaleDateString('pt-BR')}</div>
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <FileText size={64} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">Preview do documento</p>
                  <p className="text-sm text-gray-500">
                    {selectedDocument.name}
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDocumentModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Fechar
                  </button>
                  <button
                    onClick={() => window.open(selectedDocument.url, '_blank')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Análise de Reembolsos</h1>
          <p className="text-gray-600">Supervisão e análise técnica de solicitações de reembolso</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Solicitado</p>
              <p className="text-2xl font-bold text-blue-600">
                R$ {stats.totalRequested.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Aprovado</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {stats.totalApproved.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Rejeitado</p>
              <p className="text-2xl font-bold text-red-600">
                R$ {stats.totalRejected.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle size={24} className="text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Em Análise</p>
              <p className="text-2xl font-bold text-yellow-600">
                R$ {stats.totalPending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por protocolo, nome, departamento..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos os Status</option>
            <option value="pendente">Pendente</option>
            <option value="em_analise">Em Análise</option>
            <option value="aprovado">Aprovado</option>
            <option value="rejeitado">Rejeitado</option>
            <option value="glosado">Glosado</option>
            <option value="reanalise">Reanálise</option>
            <option value="assessoria_juridica">Assessoria Jurídica</option>
            <option value="fabio">Fábio</option>
            <option value="inss">INSS</option>
            <option value="baixa_siafe">Baixa Siafe</option>
            <option value="arquivo">Arquivo</option>
          </select>

          <button className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Filter size={20} className="mr-2" />
            Filtros Avançados
          </button>
        </div>
      </div>

      {/* Records Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Protocolo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Solicitante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {record.protocolNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{record.requester}</div>
                      <div className="text-sm text-gray-500">{record.department}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(record.category)}`}>
                      {record.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    R$ {record.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={record.status}
                      onChange={(e) => updateRecordStatus(record.id, e.target.value)}
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border-0 ${getStatusColor(record.status)}`}
                    >
                      <option value="pendente">Pendente</option>
                      <option value="em_analise">Em Análise</option>
                      <option value="aprovado">Aprovado</option>
                      <option value="rejeitado">Rejeitado</option>
                      <option value="glosado">Glosado</option>
                      <option value="reanalise">Reanálise</option>
                      <option value="assessoria_juridica">Assessoria Jurídica</option>
                      <option value="fabio">Fábio</option>
                      <option value="inss">INSS</option>
                      <option value="baixa_siafe">Baixa Siafe</option>
                      <option value="arquivo">Arquivo</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(record.priority)}`}>
                      {getPriorityLabel(record.priority)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => startAnalysis(record)}
                      className="text-purple-600 hover:text-purple-900"
                      title="Começar análise"
                    >
                      <PlayCircle size={16} />
                    </button>
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Ver detalhes"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => openMessageModal(record)}
                      className="text-green-600 hover:text-green-900"
                      title="Enviar mensagem"
                    >
                      <MessageSquare size={16} />
                    </button>
                    <button
                      onClick={() => generateReport(record)}
                      className="text-orange-600 hover:text-orange-900"
                      title="Imprimir relatório"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      onClick={() => deleteRecord(record.id)}
                      className="text-red-600 hover:text-red-900"
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

        {filteredRecords.length === 0 && (
          <div className="text-center py-12">
            <DollarSign size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum reembolso encontrado</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca.' 
                : 'Não há reembolsos cadastrados no momento.'}
            </p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Detalhes do Reembolso - {selectedRecord.protocolNumber}
              </h3>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Dados do Solicitante */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Dados do Solicitante</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User size={16} className="text-gray-500 mr-2" />
                      <span className="text-sm"><strong>Nome:</strong> {selectedRecord.requester}</span>
                    </div>
                    <div className="flex items-center">
                      <FileText size={16} className="text-gray-500 mr-2" />
                      <span className="text-sm"><strong>CPF:</strong> {selectedRecord.cpf}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail size={16} className="text-gray-500 mr-2" />
                      <span className="text-sm"><strong>Email:</strong> {selectedRecord.email}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone size={16} className="text-gray-500 mr-2" />
                      <span className="text-sm"><strong>Telefone:</strong> {selectedRecord.phone}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Building size={16} className="text-gray-500 mr-2" />
                      <span className="text-sm"><strong>Departamento:</strong> {selectedRecord.department}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin size={16} className="text-gray-500 mr-2" />
                      <span className="text-sm"><strong>Município:</strong> {selectedRecord.municipality}</span>
                    </div>
                    <div className="flex items-center">
                      <AlertCircle size={16} className="text-gray-500 mr-2" />
                      <span className="text-sm"><strong>Categoria:</strong> {selectedRecord.category}</span>
                    </div>
                    <div className="flex items-center">
                      <TrendingUp size={16} className="text-gray-500 mr-2" />
                      <span className="text-sm"><strong>Prioridade:</strong> {getPriorityLabel(selectedRecord.priority)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detalhes da Despesa */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Detalhes da Despesa</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Calendar size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm"><strong>Data:</strong> {new Date(selectedRecord.expenseDate).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm"><strong>Local:</strong> {selectedRecord.location}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign size={16} className="text-gray-500 mr-2" />
                    <span className="text-sm"><strong>Valor:</strong> R$ {selectedRecord.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  {selectedRecord.approvedAmount && (
                    <div className="flex items-center">
                      <CheckCircle size={16} className="text-green-500 mr-2" />
                      <span className="text-sm"><strong>Aprovado:</strong> R$ {selectedRecord.approvedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedRecord.description}</p>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Justificativa</label>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedRecord.justification}</p>
                </div>
              </div>

              {/* Documentos */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Documentos Anexados</h4>
                <div className="space-y-3">
                  {selectedRecord.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <FileText size={20} className="text-blue-600 mr-3" />
                        <div>
                          <div className="font-medium text-gray-900">{doc.name}</div>
                          <div className="text-sm text-gray-500">{doc.type} • {formatFileSize(doc.size)}</div>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Visualizar
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mensagens */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Histórico de Mensagens</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedRecord.messages.map((message) => (
                    <div key={message.id} className={`p-3 rounded-lg ${
                      message.sender === 'admin' ? 'bg-blue-50 ml-8' : 'bg-gray-50 mr-8'
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{message.senderName}</span>
                        <span className="text-xs text-gray-500">{message.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-700">{message.content}</p>
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2">
                          {message.attachments.map((attachment) => (
                            <div key={attachment.id} className="flex items-center text-xs text-gray-600">
                              <Paperclip size={12} className="mr-1" />
                              {attachment.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={() => generateReport(selectedRecord)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Imprimir Relatório
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {showMessageModal && currentMessageRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {actionType === 'approve' ? 'Aprovar Reembolso' : 
                 actionType === 'reject' ? 'Rejeitar Reembolso' :
                 actionType === 'gloss' ? 'Glosar Reembolso' :
                 'Enviar Mensagem'} - {currentMessageRecord.protocolNumber}
              </h3>
              <button
                onClick={() => setShowMessageModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {actionType ? 'Justificativa' : 'Mensagem'}
                </label>
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder={actionType ? 'Digite a justificativa para esta ação...' : 'Digite sua mensagem...'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anexos (opcional)
                </label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setMessageAttachments(Array.from(e.target.files || []))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                {messageAttachments.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {messageAttachments.map((file, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <Paperclip size={14} className="mr-1" />
                        {file.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!messageContent.trim()}
                  className={`px-4 py-2 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center ${
                    actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' :
                    actionType === 'reject' ? 'bg-red-600 hover:bg-red-700' :
                    actionType === 'gloss' ? 'bg-orange-600 hover:bg-orange-700' :
                    'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <Send size={16} className="mr-2" />
                  {actionType === 'approve' ? 'Aprovar' : 
                   actionType === 'reject' ? 'Rejeitar' :
                   actionType === 'gloss' ? 'Glosar' :
                   'Enviar Mensagem'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReimbursementAnalysis;