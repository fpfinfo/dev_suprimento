import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft,
  Plus,
  Upload,
  FileText,
  DollarSign,
  Calendar,
  CheckCircle,
  Circle,
  X,
  BarChart3,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Clock,
  AlertTriangle,
  MessageCircle,
  Send,
  User,
  Building,
  Phone,
  Mail,
  CreditCard,
  Users,
  Calculator,
  Download,
  Save,
  Search,
  Users,
  Calculator
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AccountingRecord {
  id: string;
  protocol: string;
  requester: string;
  department: string;
  totalAmount: number;
  status: 'pendente' | 'em_analise' | 'aprovada' | 'rejeitada';
  priority: 'baixa' | 'media' | 'alta';
  dueDate: string;
  createdAt: string;
  unreadMessages: number;
  messages: Message[];
}

interface Message {
  id: string;
  sender: 'admin' | 'user' | 'system';
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
}

interface ExpenseItem {
  id: string;
  portariaNumber: string;
  voucherNumber: string;
  expenseElement: string;
  expenseDate: string;
  amount: number;
  description: string;
  files: File[];
}

interface ServiceProvider {
  name: string;
  cpf: string;
  birthDate: string;
  pisNit: string;
  fatherName: string;
  motherName: string;
  documents: File[];
}

interface FiscalData {
  grossValue: number;
  issueDate: string;
  inssContributor: number;
  inssEmployer: number;
  files: File[];
}

const AccountingSubmission: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  const [formType, setFormType] = useState<'general' | 'services'>('general');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<AccountingRecord | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatRecord, setChatRecord] = useState<AccountingRecord | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Dados do formulário
  const [suppliedData, setSuppliedData] = useState({
    fullName: user?.name || '',
    cpf: '123.456.789-00',
    phone: '(91) 99999-9999',
    email: user?.email || '',
    department: user?.department || '',
    municipio: ''
  });

  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [currentExpense, setCurrentExpense] = useState<Partial<ExpenseItem>>({
    portariaNumber: '',
    voucherNumber: '',
    expenseElement: '',
    expenseDate: '',
    amount: 0,
    description: '',
    files: []
  });

  const [serviceProvider, setServiceProvider] = useState<ServiceProvider>({
    name: '',
    cpf: '',
    birthDate: '',
    pisNit: '',
    fatherName: '',
    motherName: '',
    documents: []
  });

  const [fiscalDataList, setFiscalDataList] = useState<FiscalData[]>([]);
  const [currentFiscalData, setCurrentFiscalData] = useState<FiscalData>({
    grossValue: 0,
    issueDate: '',
    inssContributor: 0,
    inssEmployer: 0,
    files: []
  });

  // Dados simulados para a listagem
  const [accountingRecords, setAccountingRecords] = useState<AccountingRecord[]>([
    {
      id: '1',
      protocol: 'PC-2024-001',
      requester: 'João Silva Santos',
      department: 'Vara Criminal',
      totalAmount: 5000.00,
      status: 'pendente',
      priority: 'alta',
      dueDate: '2024-02-15',
      createdAt: '2024-01-15',
      unreadMessages: 2,
      messages: [
        {
          id: '1',
          sender: 'user',
          senderName: 'João Silva Santos',
          content: 'Prestação de contas enviada para análise.',
          timestamp: '2024-01-15T10:30:00',
          read: true
        },
        {
          id: '2',
          sender: 'admin',
          senderName: 'Administrador SOSFU',
          content: 'Documentação recebida. Iniciando análise técnica.',
          timestamp: '2024-01-15T14:20:00',
          read: true
        },
        {
          id: '3',
          sender: 'admin',
          senderName: 'Administrador SOSFU',
          content: 'Favor complementar com o comprovante de pagamento da despesa do dia 10/01.',
          timestamp: '2024-01-16T09:15:00',
          read: false
        },
        {
          id: '4',
          sender: 'system',
          senderName: 'Sistema',
          content: 'Status alterado para: Pendente de Complementação',
          timestamp: '2024-01-16T09:16:00',
          read: false
        }
      ]
    },
    {
      id: '2',
      protocol: 'PC-2024-002',
      requester: 'Maria Oliveira Costa',
      department: 'Vara Cível',
      totalAmount: 3500.00,
      status: 'em_analise',
      priority: 'media',
      dueDate: '2024-02-20',
      createdAt: '2024-01-18',
      unreadMessages: 0,
      messages: [
        {
          id: '1',
          sender: 'user',
          senderName: 'Maria Oliveira Costa',
          content: 'Prestação de contas referente ao suprimento SF-2024-002.',
          timestamp: '2024-01-18T11:00:00',
          read: true
        },
        {
          id: '2',
          sender: 'admin',
          senderName: 'Administrador SOSFU',
          content: 'Documentação completa. Análise em andamento.',
          timestamp: '2024-01-18T15:30:00',
          read: true
        },
        {
          id: '3',
          sender: 'system',
          senderName: 'Sistema',
          content: 'Status alterado para: Em Análise',
          timestamp: '2024-01-18T15:31:00',
          read: true
        }
      ]
    },
    {
      id: '3',
      protocol: 'PC-2024-003',
      requester: 'Carlos Mendes Silva',
      department: 'Administrativo',
      totalAmount: 2800.00,
      status: 'aprovada',
      priority: 'baixa',
      dueDate: '2024-02-25',
      createdAt: '2024-01-20',
      unreadMessages: 1,
      messages: [
        {
          id: '1',
          sender: 'user',
          senderName: 'Carlos Mendes Silva',
          content: 'Prestação de contas com serviços de pessoa física.',
          timestamp: '2024-01-20T08:45:00',
          read: true
        },
        {
          id: '2',
          sender: 'admin',
          senderName: 'Administrador SOSFU',
          content: 'Análise concluída. Prestação aprovada conforme documentação apresentada.',
          timestamp: '2024-01-22T16:20:00',
          read: true
        },
        {
          id: '3',
          sender: 'system',
          senderName: 'Sistema',
          content: 'Status alterado para: Aprovada',
          timestamp: '2024-01-22T16:21:00',
          read: false
        }
      ]
    },
    {
      id: '4',
      protocol: 'PC-2024-004',
      requester: 'Ana Paula Silva',
      department: 'Vara de Família',
      totalAmount: 4200.00,
      status: 'em_analise',
      priority: 'alta',
      dueDate: '2024-02-28',
      createdAt: '2024-01-22',
      unreadMessages: 0,
      messages: [
        {
          id: '1',
          sender: 'user',
          senderName: 'Ana Paula Silva',
          content: 'Prestação de contas com múltiplos elementos de despesa.',
          timestamp: '2024-01-22T13:15:00',
          read: true
        },
        {
          id: '2',
          sender: 'admin',
          senderName: 'Administrador SOSFU',
          content: 'Recebido. Análise iniciada.',
          timestamp: '2024-01-22T14:00:00',
          read: true
        }
      ]
    },
    {
      id: '5',
      protocol: 'PC-2024-005',
      requester: 'Roberto Lima Santos',
      department: 'Vara Trabalhista',
      totalAmount: 1500.00,
      status: 'rejeitada',
      priority: 'media',
      dueDate: '2024-03-05',
      createdAt: '2024-01-25',
      unreadMessages: 3,
      messages: [
        {
          id: '1',
          sender: 'user',
          senderName: 'Roberto Lima Santos',
          content: 'Prestação de contas para análise.',
          timestamp: '2024-01-25T10:00:00',
          read: true
        },
        {
          id: '2',
          sender: 'admin',
          senderName: 'Administrador SOSFU',
          content: 'Documentação incompleta. Faltam comprovantes fiscais.',
          timestamp: '2024-01-26T11:30:00',
          read: false
        },
        {
          id: '3',
          sender: 'admin',
          senderName: 'Administrador SOSFU',
          content: 'Prazo para complementação expirado.',
          timestamp: '2024-01-28T17:00:00',
          read: false
        },
        {
          id: '4',
          sender: 'system',
          senderName: 'Sistema',
          content: 'Status alterado para: Rejeitada',
          timestamp: '2024-01-28T17:01:00',
          read: false
        }
      ]
    }
  ]);

  const expenseElements = [
    { value: '3.3.90.30.96.01', label: '3.3.90.30.96.01 - Material de Consumo' },
    { value: '3.3.90.30.96.02', label: '3.3.90.30.96.02 - Combustível e Lubrificantes' },
    { value: '3.3.90.33.96', label: '3.3.90.33.96 - Transporte e Locomoção' },
    { value: '3.3.90.36.96', label: '3.3.90.36.96 - Serviços de Terceiros - PF' },
    { value: '3.3.90.39.96', label: '3.3.90.39.96 - Serviços de Terceiros - PJ' }
  ];

  // Estatísticas
  const stats = {
    total: accountingRecords.length,
    pending: accountingRecords.filter(r => r.status === 'pendente').length,
    inAnalysis: accountingRecords.filter(r => r.status === 'em_analise').length,
    approved: accountingRecords.filter(r => r.status === 'aprovada').length,
    unreadMessages: accountingRecords.reduce((sum, r) => sum + r.unreadMessages, 0)
  };

  // Funções auxiliares
  const getStatusColor = (status: string) => {
    const colors = {
      'pendente': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'em_analise': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'aprovada': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'rejeitada': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'pendente': 'Pendente',
      'em_analise': 'Em Análise',
      'aprovada': 'Aprovada',
      'rejeitada': 'Rejeitada'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  const formatPIS = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{5})(\d)/, '$1.$2')
      .replace(/(\d{2})(\d{1})/, '$1-$2')
      .replace(/(-\d{1})\d+?$/, '$1');
  };

  // Cálculos automáticos para serviços PF
  const calculateINSS = (grossValue: number) => {
    const contributor = grossValue * 0.11; // 11%
    const employer = grossValue * 0.20; // 20%
    return { contributor, employer };
  };

  useEffect(() => {
    if (currentFiscalData.grossValue > 0) {
      const { contributor, employer } = calculateINSS(currentFiscalData.grossValue);
      setCurrentFiscalData(prev => ({
        ...prev,
        inssContributor: contributor,
        inssEmployer: employer
      }));
    }
  }, [currentFiscalData.grossValue]);

  // Scroll automático do chat
  useEffect(() => {
    if (showChatModal && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [showChatModal, chatRecord?.messages]);

  // Funções de manipulação
  const addExpense = () => {
    if (currentExpense.portariaNumber && currentExpense.voucherNumber && 
        currentExpense.expenseElement && currentExpense.expenseDate && 
        currentExpense.amount && currentExpense.description) {
      
      const newExpense: ExpenseItem = {
        id: Date.now().toString(),
        portariaNumber: currentExpense.portariaNumber!,
        voucherNumber: currentExpense.voucherNumber!,
        expenseElement: currentExpense.expenseElement!,
        expenseDate: currentExpense.expenseDate!,
        amount: currentExpense.amount!,
        description: currentExpense.description!,
        files: currentExpense.files || []
      };
      
      setExpenses([...expenses, newExpense]);
      setCurrentExpense({
        portariaNumber: '',
        voucherNumber: '',
        expenseElement: '',
        expenseDate: '',
        amount: 0,
        description: '',
        files: []
      });
    }
  };

  const addFiscalData = () => {
    if (currentFiscalData.grossValue > 0 && currentFiscalData.issueDate) {
      setFiscalDataList([...fiscalDataList, { ...currentFiscalData }]);
      setCurrentFiscalData({
        grossValue: 0,
        issueDate: '',
        inssContributor: 0,
        inssEmployer: 0,
        files: []
      });
    }
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const removeFiscalData = (index: number) => {
    setFiscalDataList(fiscalDataList.filter((_, i) => i !== index));
  };

  const openChat = (record: AccountingRecord) => {
    setChatRecord(record);
    setShowChatModal(true);
    // Marcar mensagens como lidas
    const updatedRecord = {
      ...record,
      unreadMessages: 0,
      messages: record.messages.map(msg => ({ ...msg, read: true }))
    };
    setAccountingRecords(prev => prev.map(r => r.id === record.id ? updatedRecord : r));
  };

  const sendMessage = () => {
    if (newMessage.trim() && chatRecord) {
      const message: Message = {
        id: Date.now().toString(),
        sender: 'user',
        senderName: user?.name || 'Usuário',
        content: newMessage.trim(),
        timestamp: new Date().toISOString(),
        read: true
      };

      const updatedRecord = {
        ...chatRecord,
        messages: [...chatRecord.messages, message]
      };

      setChatRecord(updatedRecord);
      setAccountingRecords(prev => prev.map(r => r.id === chatRecord.id ? updatedRecord : r));
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredRecords = accountingRecords.filter(record => {
    const matchesSearch = 
      record.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleFileUpload = (files: FileList | null, type: 'expense' | 'provider' | 'fiscal') => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    
    if (type === 'expense') {
      setCurrentExpense(prev => ({
        ...prev,
        files: [...(prev.files || []), ...fileArray]
      }));
    } else if (type === 'provider') {
      setServiceProvider(prev => ({
        ...prev,
        documents: [...prev.documents, ...fileArray]
      }));
    } else if (type === 'fiscal') {
      setCurrentFiscalData(prev => ({
        ...prev,
        files: [...prev.files, ...fileArray]
      }));
    }
  };

  if (currentView === 'form') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setCurrentView('list')}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center space-x-2">
                <FileText size={20} className="text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Nova Prestação de Contas
                </h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setFormType('general')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    formType === 'general'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  Formulário Geral
                </button>
                <button
                  onClick={() => setFormType('services')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    formType === 'services'
                      ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                  }`}
                >
                  Serviços PF
                </button>
              </div>
              
              <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center">
                <Save size={16} className="mr-2" />
                Salvar Rascunho
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <Send size={16} className="mr-2" />
                Enviar Prestação
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* ITEM 1 - DADOS DO SUPRIDO */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-blue-900 text-white px-6 py-4">
                  <div className="flex items-center">
                    <User size={20} className="mr-2" />
                    <h2 className="text-lg font-semibold">ITEM 1 - DADOS DO SUPRIDO</h2>
                  </div>
                  <p className="text-blue-100 text-sm mt-1">Informações pessoais e funcionais</p>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nome Completo *
                      </label>
                      <input
                        type="text"
                        value={suppliedData.fullName}
                        onChange={(e) => setSuppliedData({...suppliedData, fullName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Nome completo do suprido"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        CPF *
                      </label>
                      <input
                        type="text"
                        value={suppliedData.cpf}
                        onChange={(e) => setSuppliedData({...suppliedData, cpf: formatCPF(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="000.000.000-00"
                        maxLength={14}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Telefone *
                      </label>
                      <input
                        type="text"
                        value={suppliedData.phone}
                        onChange={(e) => setSuppliedData({...suppliedData, phone: formatPhone(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="(91) 99999-9999"
                        maxLength={15}
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={suppliedData.email}
                        onChange={(e) => setSuppliedData({...suppliedData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="email@tjpa.jus.br"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Departamento/Lotação *
                      </label>
                      <input
                        type="text"
                        value={suppliedData.department}
                        onChange={(e) => setSuppliedData({...suppliedData, department: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Departamento ou lotação"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Município *
                      </label>
                      <input
                        type="text"
                        value={suppliedData.municipio}
                        onChange={(e) => setSuppliedData({...suppliedData, municipio: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Município de lotação"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ITEM 2 - DADOS DA DESPESA */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="bg-green-900 text-white px-6 py-4">
                  <div className="flex items-center">
                    <DollarSign size={20} className="mr-2" />
                    <h2 className="text-lg font-semibold">ITEM 2 - DADOS DA DESPESA</h2>
                  </div>
                  <p className="text-green-100 text-sm mt-1">Informações sobre as despesas realizadas</p>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nº Portaria SF *
                      </label>
                      <input
                        type="text"
                        value={currentExpense.portariaNumber || ''}
                        onChange={(e) => setCurrentExpense({...currentExpense, portariaNumber: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Ex: SF-2024-001"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Nº Comprovante *
                      </label>
                      <input
                        type="text"
                        value={currentExpense.voucherNumber || ''}
                        onChange={(e) => setCurrentExpense({...currentExpense, voucherNumber: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Número do comprovante"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Elemento de Despesa *
                      </label>
                      <select
                        value={currentExpense.expenseElement || ''}
                        onChange={(e) => setCurrentExpense({...currentExpense, expenseElement: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        required
                      >
                        <option value="">Selecione o elemento</option>
                        {expenseElements.map((element) => (
                          <option key={element.value} value={element.value}>
                            {element.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Data da Despesa *
                      </label>
                      <input
                        type="date"
                        value={currentExpense.expenseDate || ''}
                        onChange={(e) => setCurrentExpense({...currentExpense, expenseDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Valor (R$) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={currentExpense.amount || ''}
                      onChange={(e) => setCurrentExpense({...currentExpense, amount: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="0,00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Descrição da Finalidade *
                    </label>
                    <textarea
                      value={currentExpense.description || ''}
                      onChange={(e) => setCurrentExpense({...currentExpense, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Descreva detalhadamente a finalidade da despesa"
                      required
                    />
                  </div>

                  {/* Upload de Arquivos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Documentos Comprobatórios
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                      <Upload size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                      <p className="text-gray-600 dark:text-gray-400 mb-2">Clique para selecionar ou arraste os arquivos</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Formatos: PDF, JPG, PNG (máx. 10MB cada)</p>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e.target.files, 'expense')}
                        className="hidden"
                        id="expense-files"
                      />
                      <label
                        htmlFor="expense-files"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                      >
                        <Upload size={16} className="mr-2" />
                        Selecionar Arquivos
                      </label>
                    </div>
                    
                    {currentExpense.files && currentExpense.files.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {currentExpense.files.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                            <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                            <button
                              onClick={() => {
                                const newFiles = currentExpense.files?.filter((_, i) => i !== index) || [];
                                setCurrentExpense({...currentExpense, files: newFiles});
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={addExpense}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                    >
                      <Plus size={16} className="mr-2" />
                      ADICIONAR DESPESA
                    </button>
                  </div>
                </div>
              </div>

              {/* Lista de Despesas Adicionadas */}
              {expenses.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Despesas Adicionadas</h3>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    {expenses.map((expense) => (
                      <div key={expense.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                              <div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Portaria:</span>
                                <p className="text-sm text-gray-900 dark:text-gray-100">{expense.portariaNumber}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Elemento:</span>
                                <p className="text-sm text-gray-900 dark:text-gray-100">{expense.expenseElement}</p>
                              </div>
                              <div>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Valor:</span>
                                <p className="text-sm font-bold text-green-600">{formatCurrency(expense.amount)}</p>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{expense.description}</p>
                            {expense.files.length > 0 && (
                              <p className="text-xs text-blue-600 mt-2">{expense.files.length} arquivo(s) anexado(s)</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeExpense(expense.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FORMULÁRIO ESPECÍFICO PARA SERVIÇOS PF */}
              {formType === 'services' && (
                <>
                  {/* ITEM 3 - DADOS DO PRESTADOR DE SERVIÇOS */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-purple-900 text-white px-6 py-4">
                      <div className="flex items-center">
                        <UserCheck size={20} className="mr-2" />
                        <h2 className="text-lg font-semibold">ITEM 3 - DADOS DO PRESTADOR DE SERVIÇOS</h2>
                      </div>
                      <p className="text-purple-100 text-sm mt-1">Informações da pessoa física prestadora</p>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Nome Completo *
                          </label>
                          <input
                            type="text"
                            value={serviceProvider.name}
                            onChange={(e) => setServiceProvider({...serviceProvider, name: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="Nome completo do prestador"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            CPF *
                          </label>
                          <input
                            type="text"
                            value={serviceProvider.cpf}
                            onChange={(e) => setServiceProvider({...serviceProvider, cpf: formatCPF(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="000.000.000-00"
                            maxLength={14}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Data de Nascimento *
                          </label>
                          <input
                            type="date"
                            value={serviceProvider.birthDate}
                            onChange={(e) => setServiceProvider({...serviceProvider, birthDate: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            PIS/NIT *
                          </label>
                          <input
                            type="text"
                            value={serviceProvider.pisNit}
                            onChange={(e) => setServiceProvider({...serviceProvider, pisNit: formatPIS(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="000.00000.00-0"
                            maxLength={14}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Nome do Pai
                          </label>
                          <input
                            type="text"
                            value={serviceProvider.fatherName}
                            onChange={(e) => setServiceProvider({...serviceProvider, fatherName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="Nome do pai (opcional)"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Nome da Mãe
                          </label>
                          <input
                            type="text"
                            value={serviceProvider.motherName}
                            onChange={(e) => setServiceProvider({...serviceProvider, motherName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="Nome da mãe (opcional)"
                          />
                        </div>
                      </div>

                      {/* Upload de Documentos do Prestador */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Documentos do Prestador *
                        </label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                          <Upload size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                          <p className="text-gray-600 dark:text-gray-400 mb-2">RG, CPF, Comprovante de Residência, PIS/NIT</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Formatos: PDF, JPG, PNG</p>
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(e.target.files, 'provider')}
                            className="hidden"
                            id="provider-files"
                          />
                          <label
                            htmlFor="provider-files"
                            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer transition-colors"
                          >
                            <Upload size={16} className="mr-2" />
                            Selecionar Documentos
                          </label>
                        </div>
                        
                        {serviceProvider.documents.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {serviceProvider.documents.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                                <button
                                  onClick={() => {
                                    const newDocs = serviceProvider.documents.filter((_, i) => i !== index);
                                    setServiceProvider({...serviceProvider, documents: newDocs});
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ITEM 4 - DADOS FISCAIS */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="bg-orange-900 text-white px-6 py-4">
                      <div className="flex items-center">
                        <Calculator size={20} className="mr-2" />
                        <h2 className="text-lg font-semibold">ITEM 4 - DADOS FISCAIS (Elemento 3.3.90.36.96)</h2>
                      </div>
                      <p className="text-orange-100 text-sm mt-1">Informações fiscais e tributárias</p>
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Valor Bruto da NF (R$) *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={currentFiscalData.grossValue || ''}
                            onChange={(e) => setCurrentFiscalData({...currentFiscalData, grossValue: parseFloat(e.target.value) || 0})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="0,00"
                            required
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Data de Emissão *
                          </label>
                          <input
                            type="date"
                            value={currentFiscalData.issueDate}
                            onChange={(e) => setCurrentFiscalData({...currentFiscalData, issueDate: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            required
                          />
                        </div>
                      </div>

                      {/* Cálculos Automáticos */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                          <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                            INSS Contribuinte 11% - Prestador
                          </label>
                          <div className="text-lg font-bold text-blue-900 dark:text-blue-100">
                            {formatCurrency(currentFiscalData.inssContributor)}
                          </div>
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Cálculo automático</p>
                        </div>
                        
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                          <label className="block text-sm font-medium text-red-700 dark:text-red-300 mb-2">
                            INSS Patronal 20% - Tomador
                          </label>
                          <div className="text-lg font-bold text-red-900 dark:text-red-100">
                            {formatCurrency(currentFiscalData.inssEmployer)}
                          </div>
                          <p className="text-xs text-red-600 dark:text-red-400 mt-1">Cálculo automático</p>
                        </div>
                      </div>

                      {/* Upload de NF */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Arquivos da Nota Fiscal *
                        </label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                          <Upload size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                          <p className="text-gray-600 dark:text-gray-400 mb-2">Nota Fiscal e documentos relacionados</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Formatos: PDF, JPG, PNG</p>
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => handleFileUpload(e.target.files, 'fiscal')}
                            className="hidden"
                            id="fiscal-files"
                          />
                          <label
                            htmlFor="fiscal-files"
                            className="inline-flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 cursor-pointer transition-colors"
                          >
                            <Upload size={16} className="mr-2" />
                            Selecionar Arquivos
                          </label>
                        </div>
                        
                        {currentFiscalData.files.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {currentFiscalData.files.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                                <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                                <button
                                  onClick={() => {
                                    const newFiles = currentFiscalData.files.filter((_, i) => i !== index);
                                    setCurrentFiscalData({...currentFiscalData, files: newFiles});
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={addFiscalData}
                          className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center"
                        >
                          <Plus size={16} className="mr-2" />
                          ADICIONAR NOTA FISCAL
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Lista de Notas Fiscais Adicionadas */}
                  {fiscalDataList.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notas Fiscais Adicionadas</h3>
                      </div>
                      
                      <div className="p-6 space-y-4">
                        {fiscalDataList.map((fiscal, index) => (
                          <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                                  <div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Valor Bruto:</span>
                                    <p className="text-sm font-bold text-green-600">{formatCurrency(fiscal.grossValue)}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">INSS Contribuinte:</span>
                                    <p className="text-sm text-blue-600">{formatCurrency(fiscal.inssContributor)}</p>
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">INSS Patronal:</span>
                                    <p className="text-sm text-red-600">{formatCurrency(fiscal.inssEmployer)}</p>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Data: {new Date(fiscal.issueDate).toLocaleDateString('pt-BR')}</p>
                                {fiscal.files.length > 0 && (
                                  <p className="text-xs text-orange-600 mt-2">{fiscal.files.length} arquivo(s) anexado(s)</p>
                                )}
                              </div>
                              <button
                                onClick={() => removeFiscalData(index)}
                                className="text-red-500 hover:text-red-700 p-1"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Resumo */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center mb-4">
                  <BarChart3 size={20} className="text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Resumo</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Despesas adicionadas:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{expenses.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Valor total:</span>
                    <span className="text-sm font-medium text-green-600">
                      {formatCurrency(expenses.reduce((sum, exp) => sum + exp.amount, 0))}
                    </span>
                  </div>
                  {formType === 'services' && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Notas fiscais:</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{fiscalDataList.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Total NFs:</span>
                        <span className="text-sm font-medium text-orange-600">
                          {formatCurrency(fiscalDataList.reduce((sum, fiscal) => sum + fiscal.grossValue, 0))}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Instruções */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800 p-6">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">Instruções</h3>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                  <li>• Preencha todos os campos obrigatórios (*)</li>
                  <li>• Anexe todos os documentos comprobatórios</li>
                  <li>• Para serviços PF, inclua documentos do prestador</li>
                  <li>• Verifique os cálculos automáticos do INSS</li>
                  <li>• Salve como rascunho antes de enviar</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Lista de prestações de contas
  return (
    <div className="space-y-6">
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock size={24} className="text-yellow-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Em Análise</p>
              <p className="text-2xl font-bold text-blue-600">{stats.inAnalysis}</p>
            </div>
            <Eye size={24} className="text-blue-600" />
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Mensagens</p>
              <p className="text-2xl font-bold text-red-600">{stats.unreadMessages}</p>
            </div>
            <MessageCircle size={24} className="text-red-600" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Prestação de Contas</h1>
            <p className="text-gray-600 dark:text-gray-400">Gerencie suas prestações de contas de suprimento de fundos</p>
          </div>
          <button
            onClick={() => setCurrentView('form')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Nova Prestação
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Buscar por protocolo, nome..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Todos os Status</option>
            <option value="pendente">Pendente</option>
            <option value="em_analise">Em Análise</option>
            <option value="aprovada">Aprovada</option>
            <option value="rejeitada">Rejeitada</option>
          </select>
        </div>

        {/* Table */}
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
                  Mensagens
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {record.protocol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{record.requester}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{record.department}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {formatCurrency(record.totalAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                      {getStatusLabel(record.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => openChat(record)}
                      className="relative inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    >
                      <MessageCircle size={14} className="mr-1" />
                      <span className="text-xs font-medium">{record.messages.length}</span>
                      {record.unreadMessages > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {record.unreadMessages}
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => {
                        setSelectedRecord(record);
                        setShowDetailsModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                      title="Ver detalhes"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="text-green-600 hover:text-green-900"
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button
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
            <FileText size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Nenhuma prestação encontrada</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm || statusFilter !== 'all'
                ? 'Tente ajustar os filtros de busca.' 
                : 'Não há prestações de contas cadastradas no momento.'}
            </p>
            <button
              onClick={() => setCurrentView('form')}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} className="mr-2" />
              Nova Prestação
            </button>
          </div>
        )}
      </div>

      {/* Modal de Chat */}
      {showChatModal && chatRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
            {/* Header do Chat */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <MessageCircle size={20} className="text-blue-600 mr-2" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Chat - {chatRecord.protocol}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{chatRecord.requester}</p>
                </div>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatRecord.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.sender === 'admin'
                        ? 'bg-blue-500 text-white'
                        : message.sender === 'system'
                        ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <div className="text-sm">
                      <div className="font-medium mb-1">{message.senderName}</div>
                      <div>{message.content}</div>
                      <div className={`text-xs mt-1 ${
                        message.sender === 'admin' 
                          ? 'text-blue-100' 
                          : message.sender === 'system'
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {formatDateTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input de Nova Mensagem */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes */}
      {showDetailsModal && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Detalhes da Prestação de Contas
              </h3>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Informações Básicas */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
                  Informações Básicas
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Protocolo:</span>
                    <p className="text-gray-900 dark:text-gray-100">{selectedRecord.protocol}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Solicitante:</span>
                    <p className="text-gray-900 dark:text-gray-100">{selectedRecord.requester}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Departamento:</span>
                    <p className="text-gray-900 dark:text-gray-100">{selectedRecord.department}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Valor Total:</span>
                    <p className="text-green-600 font-bold">
                      {formatCurrency(selectedRecord.totalAmount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Status e Prioridade
                </h4>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedRecord.status)}`}>
                    {getStatusLabel(selectedRecord.status)}
                  </span>
                </div>
              </div>

              {/* Histórico de Mensagens */}
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3">
                  Histórico de Comunicação
                </h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedRecord.messages.map((message) => (
                    <div key={message.id} className="border-l-4 border-purple-300 dark:border-purple-600 pl-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {message.senderName}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDateTime(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{message.content}</p>
                    </div>
                  ))}
                </div>
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
                onClick={() => {
                  setShowDetailsModal(false);
                  openChat(selectedRecord);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <MessageCircle size={16} className="mr-2" />
                Abrir Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountingSubmission;