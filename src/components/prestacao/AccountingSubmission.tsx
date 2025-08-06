import React, { useState } from 'react';
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
  AlertTriangle
} from 'lucide-react';

interface AccountingRecord {
  id: string;
  protocol: string;
  requester: string;
  department: string;
  totalAmount: number;
  status: 'pendente' | 'em_elaboracao' | 'enviada' | 'aprovada' | 'rejeitada';
  priority: 'baixa' | 'media' | 'alta';
  dueDate: string;
  createdAt: string;
}

interface ExpenseRecord {
  id: string;
  type: string;
  description: string;
  date: string;
  amount: number;
  document?: File;
}

const AccountingSubmission: React.FC = () => {
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  const [currentStep, setCurrentStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<AccountingRecord | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  const [formData, setFormData] = useState({
    protocolNumber: 'Ex: PREST-2024-0001',
    totalAmount: '15000',
    suppliedPerson: 'Paulo Roberto',
    cpf: '123.456.789-00',
    department: 'UNIDADE DE FINANÇAS',
    totalReceived: '15000.00',
    totalSpent: '0.00',
    balance: '15000.00',
    progress: '0.0%'
  });

  const [expenses, setExpenses] = useState<ExpenseRecord[]>([]);
  const [newExpense, setNewExpense] = useState({
    type: '',
    description: '',
    date: '',
    amount: '',
    authorizationNumber: '',
    elementDescription: ''
  });

  // Dados simulados para a listagem
  const [accountingRecords, setAccountingRecords] = useState<AccountingRecord[]>([
    {
      id: '1',
      protocol: 'SF-2024-001',
      requester: 'João Silva Santos',
      department: 'Vara Criminal',
      totalAmount: 5000.00,
      status: 'pendente',
      priority: 'alta',
      dueDate: '2024-02-15',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      protocol: 'SF-2024-002',
      requester: 'Maria Oliveira Costa',
      department: 'Vara Cível',
      totalAmount: 3500.00,
      status: 'em_elaboracao',
      priority: 'media',
      dueDate: '2024-02-20',
      createdAt: '2024-01-18'
    }
  ]);

  const steps = [
    { number: 1, title: 'Dados', active: true, completed: false },
    { number: 2, title: 'Despesas', active: false, completed: false },
    { number: 3, title: 'Documentos', active: false, completed: false },
    { number: 4, title: 'Revisão', active: false, completed: false }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      'pendente': 'bg-yellow-100 text-yellow-800',
      'em_elaboracao': 'bg-blue-100 text-blue-800',
      'enviada': 'bg-purple-100 text-purple-800',
      'aprovada': 'bg-green-100 text-green-800',
      'rejeitada': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'pendente': 'Pendente',
      'em_elaboracao': 'Em Elaboração',
      'enviada': 'Enviada',
      'aprovada': 'Aprovada',
      'rejeitada': 'Rejeitada'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'baixa': 'bg-gray-100 text-gray-800',
      'media': 'bg-yellow-100 text-yellow-800',
      'alta': 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityLabel = (priority: string) => {
    const labels = {
      'baixa': 'Baixa',
      'media': 'Média',
      'alta': 'Alta'
    };
    return labels[priority as keyof typeof labels] || priority;
  };

  const stats = {
    total: accountingRecords.length,
    pending: accountingRecords.filter(r => r.status === 'pendente').length,
    inProgress: accountingRecords.filter(r => r.status === 'em_elaboracao').length,
    approved: accountingRecords.filter(r => r.status === 'aprovada').length
  };

  const filteredRecords = accountingRecords.filter(record => {
    const matchesSearch = 
      record.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const addExpense = () => {
    if (newExpense.type && newExpense.description && newExpense.date && newExpense.amount) {
      const expense: ExpenseRecord = {
        id: Date.now().toString(),
        type: newExpense.type,
        description: newExpense.description,
        date: newExpense.date,
        amount: parseFloat(newExpense.amount)
      };
      
      setExpenses([...expenses, expense]);
      setNewExpense({
        type: '',
        description: '',
        date: '',
        amount: '',
        authorizationNumber: '',
        elementDescription: ''
      });
    }
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  const handleNewAccounting = () => {
    setCurrentView('form');
  };

  const handleBackToList = () => {
    setCurrentView('list');
  };

  const handleViewDetails = (record: AccountingRecord) => {
    setSelectedRecord(record);
    setShowDetailsModal(true);
  };

  const handleEditAccounting = (record: AccountingRecord) => {
    setSelectedRecord(record);
    setCurrentView('form');
    // Pré-preencher dados do formulário
    setFormData({
      protocolNumber: record.protocol,
      totalAmount: record.totalAmount.toString(),
      suppliedPerson: record.requester,
      cpf: '123.456.789-00', // Dados simulados
      department: record.department,
      totalReceived: record.totalAmount.toString(),
      totalSpent: '0.00',
      balance: record.totalAmount.toString(),
      progress: '0.0%'
    });
  };

  const handleDeleteAccounting = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta prestação de contas?')) {
      setAccountingRecords(prev => prev.filter(record => record.id !== id));
    }
  };

  // Modal de detalhes
  const DetailsModal = () => {
    if (!selectedRecord || !showDetailsModal) return null;

    return (
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
                    R$ {selectedRecord.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedRecord.priority)}`}>
                  {getPriorityLabel(selectedRecord.priority)}
                </span>
              </div>
            </div>

            {/* Datas */}
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3">
                Cronograma
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Data de Criação:</span>
                  <p className="text-gray-900 dark:text-gray-100">
                    {new Date(selectedRecord.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Prazo de Vencimento:</span>
                  <p className="text-gray-900 dark:text-gray-100">
                    {new Date(selectedRecord.dueDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
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
                handleEditAccounting(selectedRecord);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Editar Prestação
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (currentView === 'form') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleBackToList}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="flex items-center space-x-2">
                <FileText size={20} className="text-blue-600" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Prestação de Contas</h1>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-800 text-sm">
              Salvar Rascunho
            </button>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Registre suas despesas realizadas com suprimento de fundos recebido
          </p>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-8">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                      step.completed 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : step.active 
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                    }`}>
                      {step.completed ? (
                        <CheckCircle size={20} />
                      ) : (
                        <span className="text-sm font-medium">{step.number}</span>
                      )}
                    </div>
                    <span className={`text-sm mt-2 ${
                      step.active ? 'text-blue-600 font-medium' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      step.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Dados da Prestação */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="bg-blue-900 text-white px-6 py-4 rounded-t-lg">
                  <h2 className="text-lg font-semibold">Dados da Prestação</h2>
                  <p className="text-blue-100 text-sm">Informações básicas da prestação de contas</p>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Número da Portaria *
                      </label>
                      <input
                        type="text"
                        value={formData.protocolNumber}
                        onChange={(e) => setFormData({...formData, protocolNumber: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Ex: PREST-2024-0001"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Valor da Portaria (R$) *
                      </label>
                      <input
                        type="text"
                        value={formData.totalAmount}
                        onChange={(e) => setFormData({...formData, totalAmount: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Suprido
                      </label>
                      <input
                        type="text"
                        value={formData.suppliedPerson}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        CPF
                      </label>
                      <input
                        type="text"
                        value={formData.cpf}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Lotação
                      </label>
                      <input
                        type="text"
                        value={formData.department}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      />
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Valor da Portaria</div>
                      <div className="text-lg font-bold text-blue-900 dark:text-blue-100">R$ {formData.totalReceived}</div>
                    </div>
                    
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                      <div className="text-xs text-orange-600 dark:text-orange-400 font-medium mb-1">Total Gasto</div>
                      <div className="text-lg font-bold text-orange-900 dark:text-orange-100">R$ {formData.totalSpent}</div>
                    </div>
                    
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <div className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Saldo Restante</div>
                      <div className="text-lg font-bold text-green-900 dark:text-green-100">R$ {formData.balance}</div>
                    </div>
                    
                    <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                      <div className="text-xs text-purple-600 dark:text-purple-400 font-medium mb-1">Progresso</div>
                      <div className="text-lg font-bold text-purple-900 dark:text-purple-100">{formData.progress}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Registrar Nova Despesa */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="bg-blue-900 text-white px-6 py-4 rounded-t-lg">
                  <h2 className="text-lg font-semibold">📝 Registrar Nova Despesa</h2>
                  <p className="text-blue-100 text-sm">Adicione uma nova despesa realizada</p>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tipo da Despesa *
                      </label>
                      <select
                        value={newExpense.type}
                        onChange={(e) => setNewExpense({...newExpense, type: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="">Selecione o tipo da despesa</option>
                        <option value="material_consumo">Material de Consumo</option>
                        <option value="servicos_terceiros">Serviços de Terceiros</option>
                        <option value="equipamentos">Equipamentos</option>
                        <option value="outros">Outros</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Elemento da Despesa *
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      >
                        <option value="">Selecione o elemento</option>
                        <option value="3.3.90.30.96.01">3.3.90.30.96.01 - Material de Consumo</option>
                        <option value="3.3.90.30.96.02">3.3.90.30.96.02 - Combustível e Lubrificantes</option>
                        <option value="3.3.90.33.96">3.3.90.33.96 - Transporte e Locomoção</option>
                        <option value="3.3.90.36.96">3.3.90.36.96 - Serviços de Terceiros - PF</option>
                        <option value="3.3.90.39.96">3.3.90.39.96 - Serviços de Terceiros - PJ</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Data da Despesa *
                      </label>
                      <input
                        type="date"
                        value={newExpense.date}
                        onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Valor *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="0,00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Número da Portaria de Autorização *
                    </label>
                    <input
                      type="text"
                      value={newExpense.authorizationNumber}
                      onChange={(e) => setNewExpense({...newExpense, authorizationNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Ex: PORT-2024-001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Descrição *
                    </label>
                    <textarea
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Descreva detalhadamente a despesa realizada"
                    />
                  </div>

                  {/* Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                    <Upload size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-2">Clique para selecionar ou arraste o arquivo</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Tipos suportados: PDF, JPG, PNG, JPEG</p>
                    <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Selecionar Arquivo
                    </button>
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      Limpar Campos
                    </button>
                    <button
                      onClick={addExpense}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <Plus size={16} className="mr-2" />
                      Adicionar Despesa
                    </button>
                  </div>
                </div>
              </div>

              {/* Despesas Registradas */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <FileText size={20} className="text-blue-600 mr-2" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Despesas Registradas</h2>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Despesas já adicionadas à prestação de contas</p>
                </div>
                
                <div className="p-6">
                  {expenses.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Nenhuma despesa registrada</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Adicione despesas para começar sua prestação de contas.
                      </p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">
                        Use o formulário acima para registrar suas primeiras despesas.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {expenses.map((expense) => (
                        <div key={expense.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs font-medium rounded">
                                  {expense.type}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{expense.date}</span>
                              </div>
                              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">{expense.description}</h4>
                              <p className="text-lg font-bold text-green-600">
                                R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </p>
                            </div>
                            <button
                              onClick={() => removeExpense(expense.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Resumo Atual */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center mb-4">
                  <BarChart3 size={20} className="text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Resumo Atual</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Valor recebido:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">R$ 15.000,00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total gasto:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">R$ 0,00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Saldo restante:</span>
                    <span className="text-sm font-medium text-green-600">R$ 15.000,00</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progresso:</span>
                      <span className="text-sm font-bold text-blue-600">0.0%</span>
                    </div>
                  </div>
                </div>
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
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Prestação de Contas</h1>
            <p className="text-gray-600 dark:text-gray-400">Gerencie suas prestações de contas de suprimento de fundos</p>
          </div>
          <button
            onClick={handleNewAccounting}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Nova Prestação
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Total</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.total}</p>
              </div>
              <FileText size={24} className="text-blue-600" />
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium mb-1">Em Elaboração</p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{stats.inProgress}</p>
              </div>
              <Edit size={24} className="text-yellow-600" />
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 dark:text-orange-400 font-medium mb-1">Pendentes</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.pending}</p>
              </div>
              <Clock size={24} className="text-orange-600" />
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium mb-1">Aprovadas</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.approved}</p>
              </div>
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
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
            <option value="em_elaboracao">Em Elaboração</option>
            <option value="enviada">Enviada</option>
            <option value="aprovada">Aprovada</option>
            <option value="rejeitada">Rejeitada</option>
          </select>

          <button className="flex items-center px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
            <Filter size={16} className="mr-2" />
            Filtros Avançados
          </button>
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
                  Prioridade
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
                    R$ {record.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                      {getStatusLabel(record.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(record.priority)}`}>
                      {getPriorityLabel(record.priority)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleViewDetails(record)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Ver detalhes"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleEditAccounting(record)}
                      className="text-green-600 hover:text-green-900"
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteAccounting(record.id)}
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
              onClick={handleNewAccounting}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} className="mr-2" />
              Nova Prestação
            </button>
          </div>
        )}
      </div>
      
      {/* Modal de Detalhes */}
      <DetailsModal />
    </div>
  );
};

export default AccountingSubmission;