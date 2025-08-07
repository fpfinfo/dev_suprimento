import React, { useState } from 'react';
import { 
  ArrowLeft,
  Search,
  Filter,
  Eye,
  MessageSquare,
  Download,
  Trash2,
  PlayCircle,
  FileText,
  DollarSign,
  TrendingUp,
  CheckCircle,
  Building,
  Calculator,
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  AlertCircle,
  Plus,
  X,
  Send,
  Paperclip,
  Clock,
  CheckSquare,
  XCircle,
  BarChart3
} from 'lucide-react';
import INSSAnalysis from './INSSAnalysis';

interface AccountingRecord {
  id: string;
  protocolNumber: string;
  suppliedPerson: string;
  cpf: string;
  email: string;
  phone: string;
  department: string;
  municipality: string;
  portariaNumber: string;
  totalReceived: number;
  totalUsed: number;
  balance: number;
  dueDate: string;
  status: 'pendente' | 'em_analise' | 'aprovada' | 'rejeitada' | 'glosada' | 'reanalise' | 'assessoria_juridica' | 'fabio' | 'inss' | 'baixa_siafe' | 'arquivo';
  elements: ExpenseElement[];
  attachments: AttachmentItem[];
  createdAt: string;
  messages: Message[];
  observations: string;
}

interface ExpenseElement {
  id: string;
  code: string;
  description: string;
  received: number;
  used: number;
  balance: number;
}

interface AttachmentItem {
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
  attachments?: AttachmentItem[];
}

interface ChecklistItem {
  id: string;
  criterion: string;
  status: 'sim' | 'nao' | 'na';
  required: boolean;
}

const AccountingAnalysis: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<AccountingRecord | null>(null);
  const [showAnalysisView, setShowAnalysisView] = useState(false);
  const [currentAnalysisRecord, setCurrentAnalysisRecord] = useState<AccountingRecord | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'prestacoes' | 'inss'>('prestacoes');
  const [messageType, setMessageType] = useState<'approve' | 'reject' | 'gloss' | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [messageAttachments, setMessageAttachments] = useState<File[]>([]);
  const [currentMessageRecord, setCurrentMessageRecord] = useState<AccountingRecord | null>(null);
  const [observations, setObservations] = useState('');
  const [newCriterion, setNewCriterion] = useState('');
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<AttachmentItem | null>(null);

  // Dados simulados
  const [records, setRecords] = useState<AccountingRecord[]>([
    {
      id: '1',
      protocolNumber: 'PC-2024-001',
      suppliedPerson: 'João Silva Santos',
      cpf: '123.456.789-00',
      email: 'joao.silva@tjpa.jus.br',
      phone: '(91) 99999-9999',
      department: 'Vara Criminal',
      municipality: 'Belém',
      portariaNumber: 'PORT-2024-001',
      totalReceived: 5000.00,
      totalUsed: 4500.00,
      balance: 500.00,
      dueDate: '2024-03-15',
      status: 'pendente',
      elements: [
        { id: '1', code: '3.3.90.30.96.01', description: 'Consumo em geral', received: 3000.00, used: 2800.00, balance: 200.00 },
        { id: '2', code: '3.3.90.30.96.02', description: 'Consumo de combustível', received: 2000.00, used: 1700.00, balance: 300.00 }
      ],
      attachments: [
        { id: '1', name: 'Comprovante_Despesa_001.pdf', type: 'Comprovante de Despesa', size: 2048576, uploadDate: '2024-01-15', url: '#' },
        { id: '2', name: 'Nota_Fiscal_123.jpg', type: 'Nota Fiscal', size: 1536000, uploadDate: '2024-01-15', url: '#' },
        { id: '3', name: 'Recibo_Combustivel.pdf', type: 'Recibo', size: 512000, uploadDate: '2024-01-16', url: '#' },
        { id: '4', name: 'Planilha_Gastos.xlsx', type: 'Planilha', size: 256000, uploadDate: '2024-01-16', url: '#' }
      ],
      createdAt: '2024-01-15',
      messages: [
        {
          id: '1',
          sender: 'user',
          senderName: 'João Silva Santos',
          content: 'Prestação de contas enviada para análise.',
          timestamp: '2024-01-15 10:30'
        }
      ],
      observations: 'Registre aqui observações importantes, pendências, justificativas de rejeição...'
    },
    {
      id: '2',
      protocolNumber: 'PC-2024-002',
      suppliedPerson: 'Maria Oliveira Costa',
      cpf: '987.654.321-00',
      email: 'maria.costa@tjpa.jus.br',
      phone: '(91) 88888-8888',
      department: 'Vara Cível',
      municipality: 'Santarém',
      portariaNumber: 'PORT-2024-002',
      totalReceived: 3500.00,
      totalUsed: 3500.00,
      balance: 0.00,
      dueDate: '2024-03-20',
      status: 'aprovada',
      elements: [
        { id: '3', code: '3.3.90.33.96', description: 'Transporte e Locomoção', received: 3500.00, used: 3500.00, balance: 0.00 }
      ],
      attachments: [
        { id: '5', name: 'Comprovante_Transporte.pdf', type: 'Comprovante de Transporte', size: 1024000, uploadDate: '2024-01-14', url: '#' },
        { id: '6', name: 'Passagem_Aerea.pdf', type: 'Passagem', size: 768000, uploadDate: '2024-01-14', url: '#' }
      ],
      createdAt: '2024-01-14',
      messages: [
        {
          id: '2',
          sender: 'user',
          senderName: 'Maria Oliveira Costa',
          content: 'Prestação de contas enviada para análise.',
          timestamp: '2024-01-14 14:20'
        },
        {
          id: '3',
          sender: 'admin',
          senderName: 'Administrador',
          content: 'Prestação aprovada. Documentação em conformidade.',
          timestamp: '2024-01-16 09:15'
        }
      ],
      observations: 'Prestação aprovada sem pendências.'
    }
  ]);

  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: '1', criterion: 'Comprovantes de despesas válidos e legíveis', status: 'na', required: true },
    { id: '2', criterion: 'Despesas realizadas dentro do período autorizado', status: 'na', required: true },
    { id: '3', criterion: 'Documentação completa (recibos, notas fiscais)', status: 'na', required: true },
    { id: '4', criterion: 'Valores compatíveis com os elementos aprovados', status: 'na', required: true },
    { id: '5', criterion: 'Saldo devolvido corretamente calculado', status: 'na', required: true },
    { id: '6', criterion: 'Justificativas adequadas para as despesas', status: 'na', required: true },
    { id: '7', criterion: 'Prestação entregue dentro do prazo', status: 'na', required: true },
    { id: '8', criterion: 'Documentos originais ou cópias autenticadas', status: 'na', required: true }
  ]);

  // Estatísticas
  const stats = {
    totalReceived: records.reduce((sum, record) => sum + record.totalReceived, 0),
    totalUsed: records.reduce((sum, record) => sum + record.totalUsed, 0),
    totalReturned: records.reduce((sum, record) => sum + record.balance, 0),
    availableBalance: records.filter(record => ['aprovada'].includes(record.status)).reduce((sum, record) => sum + record.balance, 0)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-gray-100 text-gray-800';
      case 'em_analise': return 'bg-blue-100 text-blue-800';
      case 'aprovada': return 'bg-green-100 text-green-800';
      case 'rejeitada': return 'bg-red-100 text-red-800';
      case 'glosada': return 'bg-orange-100 text-orange-800';
      case 'reanalise': return 'bg-yellow-100 text-yellow-800';
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
      case 'aprovada': return 'Aprovada';
      case 'rejeitada': return 'Rejeitada';
      case 'glosada': return 'Glosada';
      case 'reanalise': return 'Reanálise';
      case 'assessoria_juridica': return 'Assessoria Jurídica';
      case 'fabio': return 'Fábio';
      case 'inss': return 'INSS';
      case 'baixa_siafe': return 'Baixa Siafe';
      case 'arquivo': return 'Arquivo';
      default: return 'Desconhecido';
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
    if (confirm('Tem certeza que deseja excluir esta prestação de contas?')) {
      setRecords(prev => prev.filter(record => record.id !== recordId));
    }
  };

  const startAnalysis = (record: AccountingRecord) => {
    setCurrentAnalysisRecord(record);
    setObservations(record.observations);
    updateRecordStatus(record.id, 'em_analise');
    setShowAnalysisView(true);
  };

  const openMessageModal = (record: AccountingRecord, type: 'approve' | 'reject' | 'gloss') => {
    setCurrentMessageRecord(record);
    setMessageType(type);
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
        size: file.size,
        uploadDate: new Date().toISOString().split('T')[0],
        url: '#'
      }))
    };

    setRecords(prev => prev.map(record => 
      record.id === currentMessageRecord.id 
        ? { ...record, messages: [...record.messages, newMessage] }
        : record
    ));

    // Atualizar status baseado no tipo de mensagem
    if (messageType === 'approve') {
      updateRecordStatus(currentMessageRecord.id, 'aprovada');
    } else if (messageType === 'reject') {
      updateRecordStatus(currentMessageRecord.id, 'rejeitada');
    } else if (messageType === 'gloss') {
      updateRecordStatus(currentMessageRecord.id, 'glosada');
    }

    setMessageContent('');
    setMessageAttachments([]);
    setShowMessageModal(false);
    setCurrentMessageRecord(null);
    setMessageType(null);
  };

  const updateChecklistItem = (itemId: string, status: 'sim' | 'nao' | 'na') => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, status } : item
      )
    );
  };

  const addCriterion = () => {
    if (newCriterion.trim()) {
      const newItem: ChecklistItem = {
        id: Date.now().toString(),
        criterion: newCriterion.trim(),
        status: 'na',
        required: false
      };
      setChecklist(prev => [...prev, newItem]);
      setNewCriterion('');
    }
  };

  const viewAttachment = (attachment: AttachmentItem) => {
    setSelectedAttachment(attachment);
    setShowAttachmentModal(true);
  };

  const downloadAttachment = (attachment: AttachmentItem) => {
    // Simular download
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    link.click();
  };

  const generateReport = (record: AccountingRecord) => {
    const reportContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Relatório de Prestação de Contas - ${record.protocolNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .section h3 { color: #1f2937; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .field { margin-bottom: 10px; }
            .field strong { color: #374151; }
            .elements-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            .elements-table th, .elements-table td { border: 1px solid #d1d5db; padding: 8px; text-align: left; }
            .elements-table th { background-color: #f3f4f6; }
            .total { font-size: 18px; font-weight: bold; color: #059669; text-align: right; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>TRIBUNAL DE JUSTIÇA DO PARÁ</h1>
            <h2>Relatório de Prestação de Contas</h2>
            <p><strong>Protocolo:</strong> ${record.protocolNumber}</p>
          </div>
          
          <div class="section">
            <h3>Dados do Suprido</h3>
            <div class="grid">
              <div>
                <div class="field"><strong>Nome:</strong> ${record.suppliedPerson}</div>
                <div class="field"><strong>CPF:</strong> ${record.cpf}</div>
                <div class="field"><strong>Email:</strong> ${record.email}</div>
                <div class="field"><strong>Telefone:</strong> ${record.phone}</div>
              </div>
              <div>
                <div class="field"><strong>Departamento:</strong> ${record.department}</div>
                <div class="field"><strong>Município:</strong> ${record.municipality}</div>
                <div class="field"><strong>Portaria:</strong> ${record.portariaNumber}</div>
                <div class="field"><strong>Status:</strong> ${getStatusLabel(record.status)}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <h3>Resumo Financeiro</h3>
            <div class="field"><strong>Total Recebido:</strong> R$ ${record.totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div class="field"><strong>Total Utilizado:</strong> R$ ${record.totalUsed.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div class="field"><strong>Saldo a Devolver:</strong> R$ ${record.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div class="field"><strong>Data de Vencimento:</strong> ${new Date(record.dueDate).toLocaleDateString('pt-BR')}</div>
          </div>

          <div class="section">
            <h3>Elementos de Despesa</h3>
            <table class="elements-table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Descrição</th>
                  <th>Recebido (R$)</th>
                  <th>Utilizado (R$)</th>
                  <th>Saldo (R$)</th>
                </tr>
              </thead>
              <tbody>
                ${record.elements.map(element => `
                  <tr>
                    <td>${element.code}</td>
                    <td>${element.description}</td>
                    <td>R$ ${element.received.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td>R$ ${element.used.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td>R$ ${element.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
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

  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.protocolNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.suppliedPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.municipality.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

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
              <h1 className="text-xl font-semibold text-gray-900">Análise de Prestação de Contas</h1>
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
            {/* Status da Prestação */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Status da Prestação</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status Atual</label>
                  <select
                    value={currentAnalysisRecord.status}
                    onChange={(e) => updateRecordStatus(currentAnalysisRecord.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="em_analise">Em Análise</option>
                    <option value="aprovada">Aprovada</option>
                    <option value="rejeitada">Rejeitada</option>
                    <option value="glosada">Glosada</option>
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

            {/* Dados do Suprido */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Dados do Suprido</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                  <input
                    type="text"
                    value={currentAnalysisRecord.suppliedPerson}
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Lotação</label>
                  <input
                    type="text"
                    value={currentAnalysisRecord.department}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número da Portaria</label>
                  <input
                    type="text"
                    value={currentAnalysisRecord.portariaNumber}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Documentos Anexados pelo Suprido */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">📎 Documentos Anexados pelo Suprido</h2>
              {currentAnalysisRecord.attachments.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {currentAnalysisRecord.attachments.map((attachment) => (
                    <div key={attachment.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center">
                          <FileText size={20} className="text-blue-600 mr-2 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="font-medium text-gray-900 truncate" title={attachment.name}>
                              {attachment.name}
                            </div>
                            <div className="text-sm text-gray-500">{attachment.type}</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 mb-3">
                        <div>Tamanho: {formatFileSize(attachment.size)}</div>
                        <div>Upload: {new Date(attachment.uploadDate).toLocaleDateString('pt-BR')}</div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewAttachment(attachment)}
                          className="flex-1 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                        >
                          Visualizar
                        </button>
                        <button
                          onClick={() => downloadAttachment(attachment)}
                          className="flex-1 px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum documento anexado</h3>
                  <p className="text-gray-500">O suprido não anexou documentos a esta prestação.</p>
                </div>
              )}
            </div>

            {/* Resumo Financeiro por Elemento */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumo Financeiro por Elemento</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Código</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Descrição</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Recebido</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Utilizado</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-700">Saldo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentAnalysisRecord.elements.map((element) => (
                      <tr key={element.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">{element.code}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{element.description}</td>
                        <td className="py-3 px-4 text-sm text-gray-900 text-right">
                          R$ {element.received.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900 text-right">
                          R$ {element.used.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-900 text-right">
                          <span className={element.balance > 0 ? 'text-green-600 font-medium' : 'text-gray-900'}>
                            R$ {element.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={2} className="py-3 px-4 text-sm font-semibold text-gray-900">Total:</td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">
                        R$ {currentAnalysisRecord.totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">
                        R$ {currentAnalysisRecord.totalUsed.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-4 text-sm font-semibold text-green-600 text-right">
                        R$ {currentAnalysisRecord.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
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
                    {checklist.map((item) => (
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

              {/* Adicionar novo item */}
              <div className="mt-4 flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Digite novo item do checklist..."
                  value={newCriterion}
                  onChange={(e) => setNewCriterion(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && addCriterion()}
                />
                <button
                  onClick={addCriterion}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Plus size={16} className="mr-1" />
                  Adicionar Item
                </button>
              </div>
            </div>

            {/* Anotações e Observações do Analista */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Anotações e Observações do Analista</h2>
              <textarea
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Registre aqui observações importantes, pendências, justificativas de rejeição, observações de solicitações de ajuste..."
              />
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowAnalysisView(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
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

        {/* Modal de Visualização de Anexo */}
        {showAttachmentModal && selectedAttachment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Visualizar Documento - {selectedAttachment.name}
                </h3>
                <button
                  onClick={() => setShowAttachmentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div><strong>Nome:</strong> {selectedAttachment.name}</div>
                    <div><strong>Tipo:</strong> {selectedAttachment.type}</div>
                    <div><strong>Tamanho:</strong> {formatFileSize(selectedAttachment.size)}</div>
                    <div><strong>Data de Upload:</strong> {new Date(selectedAttachment.uploadDate).toLocaleDateString('pt-BR')}</div>
                  </div>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <FileText size={64} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-4">Preview do documento não disponível</p>
                  <p className="text-sm text-gray-500">
                    Clique em "Download" para baixar e visualizar o arquivo
                  </p>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowAttachmentModal(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Fechar
                  </button>
                  <button
                    onClick={() => downloadAttachment(selectedAttachment)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Download
                  </button>
                </div>
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
                  {messageType === 'approve' && 'Aprovar Prestação'}
                  {messageType === 'reject' && 'Rejeitar Prestação'}
                  {messageType === 'gloss' && 'Glosar Prestação'}
                  {' - '}{currentMessageRecord.protocolNumber}
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
                    {messageType === 'approve' && 'Justificativa da Aprovação'}
                    {messageType === 'reject' && 'Motivo da Rejeição'}
                    {messageType === 'gloss' && 'Justificativa do Glosa'}
                  </label>
                  <textarea
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder={
                      messageType === 'approve' 
                        ? 'Descreva os motivos da aprovação...'
                        : messageType === 'reject'
                        ? 'Descreva os motivos da rejeição...'
                        : 'Descreva os motivos do glosa...'
                    }
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      messageType === 'approve' 
                        ? 'bg-green-600 hover:bg-green-700'
                        : messageType === 'reject'
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-orange-600 hover:bg-orange-700'
                    }`}
                  >
                    <Send size={16} className="mr-2" />
                    {messageType === 'approve' && 'Aprovar'}
                    {messageType === 'reject' && 'Rejeitar'}
                    {messageType === 'gloss' && 'Glosar'}
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
          <h1 className="text-2xl font-bold text-gray-900">Análise de Prestação de Contas</h1>
          <p className="text-gray-600">Supervisão e análise técnica de prestações de contas</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Recebido</p>
              <p className="text-2xl font-bold text-blue-600">
                R$ {stats.totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
              <p className="text-sm font-medium text-gray-600 mb-1">Total Utilizado</p>
              <p className="text-2xl font-bold text-orange-600">
                R$ {stats.totalUsed.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} className="text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total Devolvido</p>
              <p className="text-2xl font-bold text-green-600">
                R$ {stats.totalReturned.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
              <p className="text-sm font-medium text-gray-600 mb-1">Saldo Disponível</p>
              <p className="text-2xl font-bold text-purple-600">
                R$ {stats.availableBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <CheckSquare size={24} className="text-purple-600" />
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos os Status</option>
            <option value="pendente">Pendente</option>
            <option value="em_analise">Em Análise</option>
            <option value="aprovada">Aprovada</option>
            <option value="rejeitada">Rejeitada</option>
            <option value="glosada">Glosada</option>
            <option value="reanalise">Reanálise</option>
            <option value="assessoria_juridica">Assessoria Jurídica</option>
            <option value="fabio">Fábio</option>
            <option value="inss">INSS</option>
            <option value="baixa_siafe">Baixa Siafe</option>
            <option value="arquivo">Arquivo</option>
          </select>

          <button className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Filter size={20} className="mr-2" />
            Filtros Avançados
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('prestacoes')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'prestacoes'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <FileText size={16} />
              <span>Prestações de Contas</span>
            </button>
            <button
              onClick={() => setActiveTab('inss')}
              className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === 'inss'
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <Calculator size={16} />
              <span>Recolhimentos INSS</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'inss' ? (
        <INSSAnalysis />
      ) : (
        <>

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
                  Suprido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Departamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Saldo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
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
                      <div className="text-sm font-medium text-gray-900">{record.suppliedPerson}</div>
                      <div className="text-sm text-gray-500">{record.cpf}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{record.department}</div>
                      <div className="text-sm text-gray-500">{record.municipality}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    R$ {record.totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={record.balance > 0 ? 'text-green-600 font-medium' : 'text-gray-900'}>
                      R$ {record.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                      {getStatusLabel(record.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => startAnalysis(record)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Começar análise"
                    >
                      <PlayCircle size={16} />
                    </button>
                    <button
                      onClick={() => setSelectedRecord(record)}
                      className="text-green-600 hover:text-green-900"
                      title="Ver detalhes"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => generateReport(record)}
                      className="text-purple-600 hover:text-purple-900"
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
            <FileText size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma prestação encontrada</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' 
                ? 'Tente ajustar os filtros de busca.' 
                : 'Não há prestações de contas cadastradas no momento.'}
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
                Detalhes da Prestação - {selectedRecord.protocolNumber}
              </h3>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Dados do Suprido */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Dados do Suprido</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <User size={16} className="text-gray-500 mr-2" />
                      <span className="text-sm"><strong>Nome:</strong> {selectedRecord.suppliedPerson}</span>
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
                      <FileText size={16} className="text-gray-500 mr-2" />
                      <span className="text-sm"><strong>Portaria:</strong> {selectedRecord.portariaNumber}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="text-gray-500 mr-2" />
                      <span className="text-sm"><strong>Vencimento:</strong> {new Date(selectedRecord.dueDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resumo Financeiro */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Resumo Financeiro</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-xs text-blue-600 font-medium mb-1">Total Recebido</div>
                    <div className="text-lg font-bold text-blue-900">
                      R$ {selectedRecord.totalReceived.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-xs text-orange-600 font-medium mb-1">Total Utilizado</div>
                    <div className="text-lg font-bold text-orange-900">
                      R$ {selectedRecord.totalUsed.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-xs text-green-600 font-medium mb-1">Saldo a Devolver</div>
                    <div className="text-lg font-bold text-green-900">
                      R$ {selectedRecord.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Elementos de Despesa */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Elementos de Despesa</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 rounded-lg">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Recebido</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Utilizado</th>
                        <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Saldo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedRecord.elements.map((element) => (
                        <tr key={element.id}>
                          <td className="px-4 py-2 text-sm text-gray-900">{element.code}</td>
                          <td className="px-4 py-2 text-sm text-gray-900">{element.description}</td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">
                            R$ {element.received.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">
                            R$ {element.used.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-4 py-2 text-sm text-gray-900 text-right">
                            R$ {element.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Documentos Anexados */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Documentos Anexados</h4>
                <div className="space-y-3">
                  {selectedRecord.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <FileText size={20} className="text-blue-600 mr-3" />
                        <div>
                          <div className="font-medium text-gray-900">{attachment.name}</div>
                          <div className="text-sm text-gray-500">
                            {attachment.type} • {formatFileSize(attachment.size)} • {new Date(attachment.uploadDate).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => viewAttachment(attachment)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Visualizar
                        </button>
                        <button
                          onClick={() => downloadAttachment(attachment)}
                          className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                        >
                          Download
                        </button>
                      </div>
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
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Imprimir Relatório
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};

export default AccountingAnalysis;