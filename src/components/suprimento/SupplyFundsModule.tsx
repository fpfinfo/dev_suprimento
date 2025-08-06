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
  AlertTriangle,
  Send,
  Building,
  User,
  MapPin,
  Target
} from 'lucide-react';

interface SupplyRequest {
  id: string;
  protocol: string;
  requester: string;
  department: string;
  totalAmount: number;
  status: 'rascunho' | 'em_elaboracao' | 'enviada' | 'em_analise' | 'aprovada' | 'rejeitada';
  priority: 'baixa' | 'media' | 'alta';
  dueDate: string;
  createdAt: string;
  justification: string;
  expenses: ExpenseRecord[];
}

interface ExpenseRecord {
  id: string;
  type: string;
  description: string;
  date: string;
  amount: number;
  document?: File;
}

interface ExpenseItem {
  elementCode: string;
  description: string;
  amount: number;
}

const SupplyFundsModule: React.FC = () => {
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  const [editingRequest, setEditingRequest] = useState<SupplyRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SupplyRequest | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    protocol: 'SF-2024-004',
    requester: 'Paulo Roberto Silva',
    cpf: '123.456.789-00',
    email: 'paulo.roberto@tjpa.jus.br',
    department: 'VARA CRIMINAL',
    municipality: 'Belém',
    justification: '',
    limitDate: '',
    finalDate: '',
    observations: ''
  });

  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [newExpense, setNewExpense] = useState({
    elementCode: '',
    description: '',
    amount: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isEditing, setIsEditing] = useState(false);
  
  const [formDataOld, setFormDataOld] = useState({
    protocolNumber: '',
    totalAmount: '0.00',
    requester: 'Paulo Roberto Silva',
    cpf: '123.456.789-00',
    department: 'VARA CRIMINAL',
    justification: '',
    dueDate: '',
    ptres: '',
    dotacoes: ''
  });

  const [expensesOld, setExpensesOld] = useState<ExpenseRecord[]>([]);
  const [newExpenseOld, setNewExpenseOld] = useState({
    type: '',
    description: '',
    date: '',
    amount: '',
    authorizationNumber: '',
    elementDescription: ''
  });

  // Dados simulados para a listagem
  const [supplyRequests, setSupplyRequests] = useState<SupplyRequest[]>([
    {
      id: '1',
      protocol: 'SF-2024-001',
      requester: 'João Silva Santos',
      department: 'Vara Criminal',
      totalAmount: 5000.00,
      status: 'rascunho',
      priority: 'alta',
      dueDate: '2024-02-15',
      createdAt: '2024-01-15',
      justification: 'Aquisição de materiais de escritório para funcionamento da vara criminal.',
      expenses: [
        {
          id: '1',
          type: 'material_consumo',
          description: 'Papel A4, canetas e materiais diversos',
          date: '2024-01-20',
          amount: 2500.00
        },
        {
          id: '2',
          type: 'servicos_terceiros',
          description: 'Serviços de manutenção de equipamentos',
          date: '2024-01-22',
          amount: 2500.00
        }
      ]
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
      createdAt: '2024-01-18',
      justification: 'Compra de equipamentos de informática para modernização do setor.',
      expenses: [
        {
          id: '3',
          type: 'equipamentos',
          description: 'Computadores e periféricos',
          date: '2024-01-25',
          amount: 3500.00
        }
      ]
    },
    {
      id: '3',
      protocol: 'SF-2024-003',
      requester: 'Paulo Roberto Silva',
      department: 'VARA CRIMINAL',
      totalAmount: 1500.00,
      status: 'em_elaboracao',
      priority: 'media',
      dueDate: '2024-02-25',
      createdAt: '2024-01-20',
      justification: 'Materiais para manutenção e limpeza das instalações.',
      expenses: [
        {
          id: '4',
          type: 'material_consumo',
          description: 'Produtos de limpeza e manutenção',
          date: '2024-01-28',
          amount: 1500.00
        }
      ]
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
      'rascunho': 'bg-gray-100 text-gray-800',
      'em_elaboracao': 'bg-blue-100 text-blue-800',
      'enviada': 'bg-purple-100 text-purple-800',
      'em_analise': 'bg-yellow-100 text-yellow-800',
      'aprovada': 'bg-green-100 text-green-800',
      'rejeitada': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      'rascunho': 'Rascunho',
      'em_elaboracao': 'Em Elaboração',
      'enviada': 'Enviada',
      'em_analise': 'Em Análise',
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
    total: supplyRequests.length,
    inProgress: supplyRequests.filter(r => r.status === 'em_elaboracao').length,
    pending: supplyRequests.filter(r => r.status === 'rascunho').length,
    approved: supplyRequests.filter(r => r.status === 'aprovada').length
  };

  const filteredRequests = supplyRequests.filter(request => {
    const matchesSearch = 
      request.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requester.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const generateProtocolNumber = () => {
    const year = new Date().getFullYear();
    const nextNumber = supplyRequests.length + 1;
    return `SF-${year}-${nextNumber.toString().padStart(3, '0')}`;
  };

  const addExpense = () => {
    if (newExpense.elementCode && newExpense.description && newExpense.amount) {
      const expense: ExpenseItem = {
        elementCode: newExpense.elementCode,
        description: newExpense.description,
        amount: parseFloat(newExpense.amount)
      };
      
      setExpenses([...expenses, expense]);
      
      setNewExpense({
        elementCode: '',
        description: '',
        amount: ''
      });
    }
  };

  const removeExpense = (index: number) => {
    const updatedExpenses = expenses.filter((_, i) => i !== index);
    setExpenses(updatedExpenses);
  };

  const addExpenseOld = () => {
    if (newExpenseOld.type && newExpenseOld.description && newExpenseOld.date && newExpenseOld.amount) {
      const expense: ExpenseRecord = {
        id: Date.now().toString(),
        type: newExpenseOld.type,
        description: newExpenseOld.description,
        date: newExpenseOld.date,
        amount: parseFloat(newExpenseOld.amount)
      };
      
      setExpensesOld([...expensesOld, expense]);
      
      // Atualizar valor total
      const newTotal = expensesOld.reduce((sum, exp) => sum + exp.amount, 0) + expense.amount;
      setFormDataOld(prev => ({
        ...prev,
        totalAmount: newTotal.toFixed(2)
      }));
      
      setNewExpenseOld({
        type: '',
        description: '',
        date: '',
        amount: '',
        authorizationNumber: '',
        elementDescription: ''
      });
    }
  };

  const removeExpenseOld = (id: string) => {
    const updatedExpenses = expensesOld.filter(exp => exp.id !== id);
    setExpensesOld(updatedExpenses);
    
    // Atualizar valor total
    const newTotal = updatedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    setFormDataOld(prev => ({
      ...prev,
      totalAmount: newTotal.toFixed(2)
    }));
  };

  const handleNewRequest = () => {
    setCurrentView('form');
    setEditingRequest(null);
    // Reset form data
    setFormData({
      protocol: `SF-2024-${String(supplyRequests.length + 1).padStart(3, '0')}`,
      requester: 'Paulo Roberto Silva',
      cpf: '123.456.789-00',
      email: 'paulo.roberto@tjpa.jus.br',
      department: 'VARA CRIMINAL',
      municipality: 'Belém',
      justification: '',
      limitDate: '',
      finalDate: '',
      observations: ''
    });
    setExpenses([]);
    setNewExpense({
      elementCode: '',
      description: '',
      amount: ''
    });
  };

  const handleEditRequest = (request: SupplyRequest) => {
    setCurrentView('form');
    setEditingRequest(request);
    setFormData({
      protocol: request.protocol,
      requester: request.requester,
      cpf: '123.456.789-00',
      email: 'paulo.roberto@tjpa.jus.br',
      department: request.department,
      municipality: 'Belém',
      justification: request.justification || '',
      limitDate: request.dueDate,
      finalDate: '',
      observations: ''
    });
    setExpenses([]);
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setEditingRequest(null);
  };

  const handleSaveRequest = () => {
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    
    const requestData: SupplyRequest = {
      id: editingRequest?.id || Date.now().toString(),
      protocol: formData.protocol,
      requester: formData.requester,
      department: formData.department,
      totalAmount,
      status: 'em_elaboracao',
      priority: 'media',
      dueDate: formData.limitDate,
      createdAt: editingRequest?.createdAt || new Date().toISOString().split('T')[0],
      justification: formData.justification,
      expenses: expenses.map(exp => ({
        id: Date.now().toString(),
        type: exp.elementCode,
        description: exp.description,
        date: new Date().toISOString().split('T')[0],
        amount: exp.amount
      }))
    };

    if (editingRequest) {
      setSupplyRequests(prev => prev.map(req => 
        req.id === editingRequest.id ? requestData : req
      ));
    } else {
      setSupplyRequests(prev => [...prev, requestData]);
    }

    setCurrentView('list');
  };

  const handleNewRequestOld = () => {
    setIsEditing(false);
    setSelectedRequest(null);
    setFormDataOld({
      protocolNumber: generateProtocolNumber(),
      totalAmount: '0.00',
      requester: 'Paulo Roberto Silva',
      cpf: '123.456.789-00',
      department: 'VARA CRIMINAL',
      justification: '',
      dueDate: '',
      ptres: '',
      dotacoes: ''
    });
    setExpensesOld([]);
    setCurrentView('form');
  };

  const handleBackToListOld = () => {
    setCurrentView('list');
    setIsEditing(false);
    setSelectedRequest(null);
  };

  const handleViewDetails = (request: SupplyRequest) => {
    setSelectedRequest(request);
    setShowDetailsModal(true);
  };

  const handleEditRequestOld = (request: SupplyRequest) => {
    setIsEditing(true);
    setSelectedRequest(request);
    setFormDataOld({
      protocolNumber: request.protocol,
      totalAmount: request.totalAmount.toString(),
      requester: request.requester,
      cpf: '123.456.789-00',
      department: request.department,
      justification: request.justification,
      dueDate: request.dueDate,
      ptres: '12345',
      dotacoes: 'Dotação exemplo'
    });
    setExpensesOld(request.expenses);
    setCurrentView('form');
  };

  const handleDeleteRequest = (id: string) => {
    setSupplyRequests(prev => prev.filter(request => request.id !== id));
    setShowDeleteConfirm(null);
  };

  const handleSendForAnalysis = (request: SupplyRequest) => {
    // Atualizar status da solicitação para "em_analise"
    setSupplyRequests(prev => prev.map(req => 
      req.id === request.id 
        ? { ...req, status: 'em_analise' as const }
        : req
    ));

    // Aqui você pode implementar a lógica para enviar para a página de análise
    // Por exemplo, salvar no localStorage ou fazer uma chamada para API
    const analysisData = {
      ...request,
      status: 'em_analise',
      sentForAnalysisAt: new Date().toISOString()
    };

    // Salvar no localStorage para simular o envio para análise
    const existingAnalysis = JSON.parse(localStorage.getItem('pendingAnalysis') || '[]');
    existingAnalysis.push(analysisData);
    localStorage.setItem('pendingAnalysis', JSON.stringify(existingAnalysis));

    alert('Solicitação enviada para análise com sucesso!');
  };

  const handleSaveRequestOld = () => {
    if (!formDataOld.justification || !formDataOld.dueDate || expensesOld.length === 0) {
      alert('Preencha todos os campos obrigatórios e adicione pelo menos uma despesa');
      return;
    }

    const requestData: SupplyRequest = {
      id: selectedRequest?.id || Date.now().toString(),
      protocol: formDataOld.protocolNumber,
      requester: formDataOld.requester,
      department: formDataOld.department,
      totalAmount: parseFloat(formDataOld.totalAmount),
      status: 'em_elaboracao',
      priority: 'media',
      dueDate: formDataOld.dueDate,
      createdAt: selectedRequest?.createdAt || new Date().toISOString().split('T')[0],
      justification: formDataOld.justification,
      expenses: expensesOld
    };

    if (isEditing && selectedRequest) {
      setSupplyRequests(prev => prev.map(req => 
        req.id === selectedRequest.id ? requestData : req
      ));
    } else {
      setSupplyRequests(prev => [...prev, requestData]);
    }

    handleBackToListOld();
  };

  // Modal de detalhes
  const DetailsModal = () => {
    if (!selectedRequest || !showDetailsModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Detalhes da Solicitação
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
                  <p className="text-gray-900 dark:text-gray-100">{selectedRequest.protocol}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Solicitante:</span>
                  <p className="text-gray-900 dark:text-gray-100">{selectedRequest.requester}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Departamento:</span>
                  <p className="text-gray-900 dark:text-gray-100">{selectedRequest.department}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Valor Total:</span>
                  <p className="text-green-600 font-bold">
                    R$ {selectedRequest.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
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
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedRequest.status)}`}>
                  {getStatusLabel(selectedRequest.status)}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedRequest.priority)}`}>
                  {getPriorityLabel(selectedRequest.priority)}
                </span>
              </div>
            </div>

            {/* Justificativa */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-3">
                Justificativa
              </h4>
              <p className="text-gray-700 dark:text-gray-300">{selectedRequest.justification}</p>
            </div>

            {/* Elementos de Despesa */}
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-3">
                Elementos de Despesa ({selectedRequest.expenses.length})
              </h4>
              <div className="space-y-2">
                {selectedRequest.expenses.map((expense, index) => (
                  <div key={expense.id} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded border">
                    <div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{expense.description}</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{expense.type} - {expense.date}</p>
                    </div>
                    <span className="text-sm font-bold text-green-600">
                      R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cronograma */}
            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-3">
                Cronograma
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Data de Criação:</span>
                  <p className="text-gray-900 dark:text-gray-100">
                    {new Date(selectedRequest.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Prazo de Utilização:</span>
                  <p className="text-gray-900 dark:text-gray-100">
                    {new Date(selectedRequest.dueDate).toLocaleDateString('pt-BR')}
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
                handleEditRequest(selectedRequest);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Editar Solicitação
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render form view
  if (currentView === 'form') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={handleBackToList}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                ← Voltar ao Dashboard
              </button>
            </div>
            <button
              onClick={handleSaveRequest}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Salvar
            </button>
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {editingRequest ? 'Editar Solicitação' : 'Suprimento de Fundos'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {editingRequest ? 'Edite sua solicitação de suprimento de fundos' : 'Gerencie suas solicitações de suprimento de fundos'}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Valor Solicitado</p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  R$ {expenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <DollarSign size={24} className="text-blue-600" />
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium mb-1">Itens Solicitados</p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{expenses.length}</p>
              </div>
              <FileText size={24} className="text-yellow-600" />
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium mb-1">Status Solicitação</p>
                <p className="text-lg font-bold text-green-900 dark:text-green-100">
                  {editingRequest ? 'Em Edição' : 'Rascunho'}
                </p>
              </div>
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">Valor Disponível</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">R$ 5.500,00</p>
              </div>
              <BarChart3 size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Nova Solicitação */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg flex items-center">
                <Plus size={20} className="mr-2" />
                <div>
                  <h2 className="text-lg font-semibold">Nova Solicitação</h2>
                  <p className="text-blue-100 text-sm">Preencha os dados da solicitação de suprimento de fundos</p>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Dados da Solicitação */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Dados da Solicitação</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Solicitante *
                      </label>
                      <input
                        type="text"
                        value={formData.requester}
                        onChange={(e) => setFormData({...formData, requester: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Nome do solicitante"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        CPF *
                      </label>
                      <input
                        type="text"
                        value={formData.cpf}
                        onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="000.000.000-00"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="email@tjpa.jus.br"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Telefone *
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="(91) 99999-9999"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Departamento *
                      </label>
                      <input
                        type="text"
                        value={formData.department}
                        onChange={(e) => setFormData({...formData, department: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Departamento"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Município *
                    </label>
                    <select
                      value={formData.municipality}
                      onChange={(e) => setFormData({...formData, municipality: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Selecione o município</option>
                      <option value="Belém">Belém</option>
                      <option value="Santarém">Santarém</option>
                      <option value="Marabá">Marabá</option>
                      <option value="Castanhal">Castanhal</option>
                      <option value="Altamira">Altamira</option>
                    </select>
                  </div>
                </div>

                {/* Período de Utilização */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Período de Utilização</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Data Inicial *
                      </label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Data Final *
                      </label>
                      <input
                        type="date"
                        value={formData.finalDate}
                        onChange={(e) => setFormData({...formData, finalDate: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>
                </div>

                {/* Justificativa */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Justificativa *
                  </label>
                  <textarea
                    value={formData.justification}
                    onChange={(e) => setFormData({...formData, justification: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Descreva a justificativa para a solicitação de suprimento de fundos"
                  />
                </div>
              </div>
            </div>

            {/* Elementos de Despesa */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="bg-green-600 text-white px-6 py-4 rounded-t-lg flex items-center">
                <Plus size={20} className="mr-2" />
                <div>
                  <h2 className="text-lg font-semibold">Elementos de Despesa</h2>
                  <p className="text-green-100 text-sm">Adicione os elementos de despesa da solicitação</p>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Add New Expense */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                  <div className="md:col-span-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Código do Elemento
                    </label>
                    <select
                      value={newExpense.elementCode}
                      onChange={(e) => setNewExpense({...newExpense, elementCode: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Selecione</option>
                      <option value="3.3.90.30.96.01">3.3.90.30.96.01</option>
                      <option value="3.3.90.30.96.02">3.3.90.30.96.02</option>
                      <option value="3.3.90.33.96">3.3.90.33.96</option>
                      <option value="3.3.90.36.96">3.3.90.36.96</option>
                      <option value="3.3.90.39.96">3.3.90.39.96</option>
                    </select>
                  </div>
                  
                  <div className="md:col-span-5">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Descrição
                    </label>
                    <input
                      type="text"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="Descrição do elemento"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Valor (R$)
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
                  
                  <div className="md:col-span-1">
                    <button
                      onClick={addExpense}
                      className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-blue-900 dark:text-blue-100">Total da Solicitação:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      R$ {expenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleBackToList}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveRequest}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Criar Solicitação
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resumo */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Resumo</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Protocolo:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{formData.protocol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Itens:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{expenses.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total:</span>
                  <span className="text-sm font-bold text-green-600">
                    R$ {expenses.reduce((sum, exp) => sum + exp.amount, 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Expenses List */}
        {expenses.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Lista de Solicitações</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Elementos de despesa adicionados à solicitação</p>
            </div>
            
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
                      Departamento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Município
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Valor Total
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
                  {expenses.map((expense, index) => (
                    <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {expense.elementCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {expense.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        R$ {expense.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        -
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        -
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Rascunho
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          Média
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => removeExpense(index)}
                          className="text-red-600 hover:text-red-900"
                          title="Remover"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Render list view
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Suprimento de Fundos</h1>
            <p className="text-gray-600 dark:text-gray-400">Gerencie suas solicitações de suprimento de fundos</p>
          </div>
          <button
            onClick={handleNewRequest}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Nova Solicitação
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
            <option value="rascunho">Rascunho</option>
            <option value="em_elaboracao">Em Elaboração</option>
            <option value="enviada">Enviada</option>
            <option value="em_analise">Em Análise</option>
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
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {request.protocol}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{request.requester}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{request.department}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    R$ {request.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(request.status)}`}>
                      {getStatusLabel(request.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(request.priority)}`}>
                      {getPriorityLabel(request.priority)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleViewDetails(request)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Ver detalhes"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleEditRequest(request)}
                      className="text-green-600 hover:text-green-900"
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    {request.status === 'em_elaboracao' && (
                      <button
                        onClick={() => handleSendForAnalysis(request)}
                        className="text-purple-600 hover:text-purple-900"
                        title="Enviar para análise"
                      >
                        <Send size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => setShowDeleteConfirm(request.id)}
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

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Nenhuma solicitação encontrada</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm || statusFilter !== 'all'
                ? 'Tente ajustar os filtros de busca.' 
                : 'Não há solicitações cadastradas no momento.'}
            </p>
            <button
              onClick={handleNewRequest}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} className="mr-2" />
              Nova Solicitação
            </button>
          </div>
        )}
      </div>
      
      {/* Modal de Detalhes */}
      <DetailsModal />

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <AlertTriangle size={24} className="text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Confirmar Exclusão</h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Tem certeza que deseja excluir esta solicitação? Esta ação não pode ser desfeita.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteRequest(showDeleteConfirm)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplyFundsModule;