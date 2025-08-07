import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  Download, 
  Calendar, 
  DollarSign, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  X,
  Save,
  Search,
  Filter,
  MapPin,
  Building,
  User,
  Receipt
} from 'lucide-react';

interface AccountingData {
  id: string;
  protocolNumber: string;
  supplyRequestId: string;
  totalReceived: number;
  totalUsed: number;
  balance: number;
  municipality: string; // Novo campo
  dueDate: string;
  status: 'pendente' | 'em_analise' | 'aprovado' | 'rejeitado';
  submittedAt: string;
  documents: Document[];
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
}

interface ExpenseElement {
  id: string;
  code: string;
  description: string;
  receivedAmount: number;
  usedAmount: number;
  balance: number;
}

const AccountingSubmission: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'list' | 'new' | 'edit'>('list');
  const [selectedAccounting, setSelectedAccounting] = useState<AccountingData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Form data
  const [formData, setFormData] = useState({
    supplyRequestId: '',
    totalReceived: '',
    totalUsed: '',
    municipality: '', // Novo campo
    dueDate: '',
    observations: '',
    elements: [] as ExpenseElement[]
  });

  // Mock data
  const [accountingList, setAccountingList] = useState<AccountingData[]>([
    {
      id: '1',
      protocolNumber: 'PC-2024-0001',
      supplyRequestId: 'SF-2024-0001',
      totalReceived: 15000,
      totalUsed: 12500,
      balance: 2500,
      municipality: 'Belém', // Novo campo
      dueDate: '2024-02-15',
      status: 'pendente',
      submittedAt: '2024-01-15',
      documents: [
        { id: '1', name: 'Nota Fiscal 001.pdf', type: 'application/pdf', size: 245760, uploadedAt: '2024-01-15' },
        { id: '2', name: 'Recibo 001.jpg', type: 'image/jpeg', size: 156432, uploadedAt: '2024-01-15' }
      ]
    },
    {
      id: '2',
      protocolNumber: 'PC-2024-0002',
      supplyRequestId: 'SF-2024-0002',
      totalReceived: 8000,
      totalUsed: 7800,
      balance: 200,
      municipality: 'Santarém', // Novo campo
      dueDate: '2024-02-20',
      status: 'aprovado',
      submittedAt: '2024-01-18',
      documents: [
        { id: '3', name: 'Comprovantes.pdf', type: 'application/pdf', size: 512000, uploadedAt: '2024-01-18' }
      ]
    },
    {
      id: '3',
      protocolNumber: 'PC-2024-0003',
      supplyRequestId: 'SF-2024-0003',
      totalReceived: 5000,
      totalUsed: 4950,
      balance: 50,
      municipality: 'Marabá', // Novo campo
      dueDate: '2024-02-25',
      status: 'em_analise',
      submittedAt: '2024-01-20',
      documents: [
        { id: '4', name: 'Relatório Financeiro.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 89432, uploadedAt: '2024-01-20' }
      ]
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'em_analise': return 'bg-blue-100 text-blue-800';
      case 'aprovado': return 'bg-green-100 text-green-800';
      case 'rejeitado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pendente': return <Clock size={16} />;
      case 'em_analise': return <Eye size={16} />;
      case 'aprovado': return <CheckCircle size={16} />;
      case 'rejeitado': return <AlertCircle size={16} />;
      default: return <Clock size={16} />;
    }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.supplyRequestId || !formData.totalReceived || !formData.totalUsed || !formData.municipality || !formData.dueDate) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const newAccounting: AccountingData = {
      id: Date.now().toString(),
      protocolNumber: `PC-2024-${String(accountingList.length + 1).padStart(4, '0')}`,
      supplyRequestId: formData.supplyRequestId,
      totalReceived: parseFloat(formData.totalReceived),
      totalUsed: parseFloat(formData.totalUsed),
      balance: parseFloat(formData.totalReceived) - parseFloat(formData.totalUsed),
      municipality: formData.municipality, // Novo campo
      dueDate: formData.dueDate,
      status: 'pendente',
      submittedAt: new Date().toISOString().split('T')[0],
      documents: []
    };

    if (selectedAccounting) {
      setAccountingList(prev => prev.map(item => 
        item.id === selectedAccounting.id ? { ...newAccounting, id: selectedAccounting.id } : item
      ));
    } else {
      setAccountingList(prev => [...prev, newAccounting]);
    }

    resetForm();
    setActiveTab('list');
  };

  const resetForm = () => {
    setFormData({
      supplyRequestId: '',
      totalReceived: '',
      totalUsed: '',
      municipality: '', // Novo campo
      dueDate: '',
      observations: '',
      elements: []
    });
    setSelectedAccounting(null);
  };

  const editAccounting = (accounting: AccountingData) => {
    setFormData({
      supplyRequestId: accounting.supplyRequestId,
      totalReceived: accounting.totalReceived.toString(),
      totalUsed: accounting.totalUsed.toString(),
      municipality: accounting.municipality, // Novo campo
      dueDate: accounting.dueDate,
      observations: '',
      elements: []
    });
    setSelectedAccounting(accounting);
    setActiveTab('edit');
  };

  const deleteAccounting = (id: string) => {
    setAccountingList(prev => prev.filter(item => item.id !== id));
    setShowDeleteConfirm(null);
  };

  const filteredAccountings = accountingList.filter(accounting => {
    const matchesSearch = 
      accounting.protocolNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accounting.supplyRequestId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      accounting.municipality.toLowerCase().includes(searchTerm.toLowerCase()); // Incluir município na busca
    
    const matchesStatus = statusFilter === 'all' || accounting.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const renderAccountingList = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
            <Receipt size={24} className="text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Prestação de Contas</h2>
            <p className="text-gray-600 dark:text-gray-400">Gerencie suas prestações de contas de suprimento</p>
          </div>
        </div>
        
        <button
          onClick={() => setActiveTab('new')}
          className="flex items-center px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Nova Prestação
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total de Prestações</p>
              <p className="text-2xl font-bold text-purple-600">{accountingList.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <FileText size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">
                {accountingList.filter(a => a.status === 'pendente').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <Clock size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Aprovadas</p>
              <p className="text-2xl font-bold text-green-600">
                {accountingList.filter(a => a.status === 'aprovado').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Valor Total</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(accountingList.reduce((sum, a) => sum + a.totalUsed, 0))}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <DollarSign size={24} className="text-blue-600" />
            </div>
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
              placeholder="Buscar por protocolo, solicitação ou município..."
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

          <div className="flex items-center space-x-2">
            <button className="flex items-center px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors">
              <Download size={16} className="mr-2" />
              Exportar
            </button>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <X size={16} className="mr-2" />
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* Accounting Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Protocolo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Solicitação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Município
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Valores
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Vencimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredAccountings.map((accounting) => (
                <tr key={accounting.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {accounting.protocolNumber}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(accounting.submittedAt).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {accounting.supplyRequestId}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {accounting.municipality}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      <div>Recebido: {formatCurrency(accounting.totalReceived)}</div>
                      <div>Utilizado: {formatCurrency(accounting.totalUsed)}</div>
                      <div className={`font-medium ${accounting.balance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                        Saldo: {formatCurrency(accounting.balance)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {new Date(accounting.dueDate).toLocaleDateString('pt-BR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(accounting.status)}`}>
                      {getStatusIcon(accounting.status)}
                      <span className="ml-1">
                        {accounting.status === 'pendente' && 'Pendente'}
                        {accounting.status === 'em_analise' && 'Em Análise'}
                        {accounting.status === 'aprovado' && 'Aprovado'}
                        {accounting.status === 'rejeitado' && 'Rejeitado'}
                      </span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => editAccounting(accounting)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(accounting.id)}
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

        {filteredAccountings.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Nenhuma prestação encontrada</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || statusFilter !== 'all'
                ? 'Tente ajustar os filtros de busca.' 
                : 'Não há prestações de contas cadastradas.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );

  const renderAccountingForm = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              resetForm();
              setActiveTab('list');
            }}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            <X size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {selectedAccounting ? 'Editar Prestação de Contas' : 'Nova Prestação de Contas'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {selectedAccounting ? 'Atualize os dados da prestação' : 'Preencha os dados da prestação de contas'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Básicos */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Dados Básicos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Solicitação de Suprimento *
                </label>
                <select
                  value={formData.supplyRequestId}
                  onChange={(e) => setFormData({...formData, supplyRequestId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                >
                  <option value="">Selecione uma solicitação</option>
                  <option value="SF-2024-0001">SF-2024-0001 - Material de Escritório</option>
                  <option value="SF-2024-0002">SF-2024-0002 - Combustível</option>
                  <option value="SF-2024-0003">SF-2024-0003 - Serviços Terceirizados</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Município *
                </label>
                <input
                  type="text"
                  value={formData.municipality}
                  onChange={(e) => setFormData({...formData, municipality: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Ex: Belém, Santarém, Marabá..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Valor Total Recebido *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                  <input
                    type="number"
                    step="0.01"
                    value={formData.totalReceived}
                    onChange={(e) => setFormData({...formData, totalReceived: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="0,00"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Valor Total Utilizado *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                  <input
                    type="number"
                    step="0.01"
                    value={formData.totalUsed}
                    onChange={(e) => setFormData({...formData, totalUsed: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="0,00"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Data de Vencimento *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    required
                  />
                </div>
              </div>

              {/* Saldo Calculado */}
              {formData.totalReceived && formData.totalUsed && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Saldo a Devolver
                  </label>
                  <div className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                    <span className={`text-lg font-semibold ${
                      (parseFloat(formData.totalReceived) - parseFloat(formData.totalUsed)) > 0 
                        ? 'text-orange-600' 
                        : 'text-green-600'
                    }`}>
                      {formatCurrency(parseFloat(formData.totalReceived) - parseFloat(formData.totalUsed))}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Observações */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Observações
            </label>
            <textarea
              value={formData.observations}
              onChange={(e) => setFormData({...formData, observations: e.target.value})}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="Observações adicionais sobre a prestação de contas..."
            />
          </div>

          {/* Upload de Documentos */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Documentos Comprobatórios</h3>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
              <div className="text-center">
                <Upload size={48} className="mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-purple-600 hover:text-purple-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-purple-500">
                    <span>Clique para fazer upload</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple />
                  </label>
                  <p className="pl-1">ou arraste e solte</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PDF, PNG, JPG, XLSX até 10MB cada
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setActiveTab('list');
              }}
              className="px-6 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center px-6 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
            >
              <Save size={16} className="mr-2" />
              {selectedAccounting ? 'Atualizar' : 'Salvar'} Prestação
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {activeTab === 'list' && renderAccountingList()}
      {(activeTab === 'new' || activeTab === 'edit') && renderAccountingForm()}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <AlertCircle size={24} className="text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Confirmar Exclusão</h3>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Tem certeza que deseja excluir esta prestação de contas? Esta ação não pode ser desfeita.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteAccounting(showDeleteConfirm)}
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

export default AccountingSubmission;