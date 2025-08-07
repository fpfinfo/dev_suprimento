import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  DollarSign, 
  FileText, 
  Calendar, 
  User, 
  Building, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  X, 
  Save,
  Download,
  Upload,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

interface SolicitacaoSuprimento {
  id: string;
  numeroProtocolo: string;
  solicitante: string;
  valorTotal: number;
  justificativa: string;
  dataLimite: string;
  status: 'pendente' | 'em_analise' | 'aprovado' | 'rejeitado';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  criadoEm: string;
  elementos: ElementoDespesa[];
}

interface ElementoDespesa {
  id: string;
  codigo: string;
  descricao: string;
  valor: number;
  justificativa: string;
}

const SupplyFundsModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<SolicitacaoSuprimento | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Dados simulados
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoSuprimento[]>([
    {
      id: '1',
      numeroProtocolo: 'SF-2024-0001',
      solicitante: 'João Silva Santos',
      valorTotal: 15000.00,
      justificativa: 'Aquisição de material de escritório para o departamento administrativo',
      dataLimite: '2024-02-15',
      status: 'aprovado',
      prioridade: 'media',
      criadoEm: '2024-01-15',
      elementos: [
        {
          id: '1',
          codigo: '3.3.90.30',
          descricao: 'Material de Consumo',
          valor: 10000.00,
          justificativa: 'Papel, canetas, grampeadores'
        },
        {
          id: '2',
          codigo: '3.3.90.39',
          descricao: 'Outros Serviços de Terceiros - PJ',
          valor: 5000.00,
          justificativa: 'Serviços de manutenção'
        }
      ]
    },
    {
      id: '2',
      numeroProtocolo: 'SF-2024-0002',
      solicitante: 'Maria Oliveira Costa',
      valorTotal: 8500.00,
      justificativa: 'Despesas com transporte para diligências judiciais',
      dataLimite: '2024-02-20',
      status: 'pendente',
      prioridade: 'alta',
      criadoEm: '2024-01-18',
      elementos: [
        {
          id: '3',
          codigo: '3.3.90.33',
          descricao: 'Passagens e Despesas com Locomoção',
          valor: 8500.00,
          justificativa: 'Viagens para audiências'
        }
      ]
    },
    {
      id: '3',
      numeroProtocolo: 'SF-2024-0003',
      solicitante: 'Carlos Mendes',
      valorTotal: 12000.00,
      justificativa: 'Aquisição de equipamentos de informática',
      dataLimite: '2024-02-25',
      status: 'em_analise',
      prioridade: 'media',
      criadoEm: '2024-01-20',
      elementos: [
        {
          id: '4',
          codigo: '4.4.90.52',
          descricao: 'Equipamentos e Material Permanente',
          valor: 12000.00,
          justificativa: 'Computadores e impressoras'
        }
      ]
    }
  ]);

  const [formData, setFormData] = useState({
    solicitante: '',
    valorTotal: '',
    justificativa: '',
    dataLimite: '',
    prioridade: 'media' as 'baixa' | 'media' | 'alta' | 'urgente',
    elementos: [] as ElementoDespesa[]
  });

  const elementosDisponiveis = [
    { codigo: '3.3.90.30', descricao: 'Material de Consumo' },
    { codigo: '3.3.90.33', descricao: 'Passagens e Despesas com Locomoção' },
    { codigo: '3.3.90.39', descricao: 'Outros Serviços de Terceiros - PJ' },
    { codigo: '4.4.90.52', descricao: 'Equipamentos e Material Permanente' },
    { codigo: '3.3.90.14', descricao: 'Diárias - Civil' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado': return 'bg-green-100 text-green-800';
      case 'rejeitado': return 'bg-red-100 text-red-800';
      case 'em_analise': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'aprovado': return 'Aprovado';
      case 'rejeitado': return 'Rejeitado';
      case 'em_analise': return 'Em Análise';
      default: return 'Pendente';
    }
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'urgente': return 'bg-red-100 text-red-800';
      case 'alta': return 'bg-orange-100 text-orange-800';
      case 'media': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityLabel = (prioridade: string) => {
    switch (prioridade) {
      case 'urgente': return 'Urgente';
      case 'alta': return 'Alta';
      case 'media': return 'Média';
      default: return 'Baixa';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const openModal = (solicitacao?: SolicitacaoSuprimento) => {
    if (solicitacao) {
      setSelectedSolicitacao(solicitacao);
      setFormData({
        solicitante: solicitacao.solicitante,
        valorTotal: solicitacao.valorTotal.toString(),
        justificativa: solicitacao.justificativa,
        dataLimite: solicitacao.dataLimite,
        prioridade: solicitacao.prioridade,
        elementos: solicitacao.elementos
      });
      setIsEditing(true);
    } else {
      setSelectedSolicitacao(null);
      setFormData({
        solicitante: '',
        valorTotal: '',
        justificativa: '',
        dataLimite: '',
        prioridade: 'media',
        elementos: []
      });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSolicitacao(null);
    setIsEditing(false);
  };

  const saveSolicitacao = () => {
    if (!formData.solicitante || !formData.valorTotal || !formData.justificativa || !formData.dataLimite) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (formData.elementos.length === 0) {
      alert('Adicione pelo menos um elemento de despesa');
      return;
    }

    const valorTotal = formData.elementos.reduce((sum, el) => sum + el.valor, 0);

    if (isEditing && selectedSolicitacao) {
      setSolicitacoes(prev => prev.map(sol => 
        sol.id === selectedSolicitacao.id 
          ? {
              ...sol,
              solicitante: formData.solicitante,
              valorTotal: valorTotal,
              justificativa: formData.justificativa,
              dataLimite: formData.dataLimite,
              prioridade: formData.prioridade,
              elementos: formData.elementos
            }
          : sol
      ));
    } else {
      const novaSolicitacao: SolicitacaoSuprimento = {
        id: Date.now().toString(),
        numeroProtocolo: `SF-2024-${String(solicitacoes.length + 1).padStart(4, '0')}`,
        solicitante: formData.solicitante,
        valorTotal: valorTotal,
        justificativa: formData.justificativa,
        dataLimite: formData.dataLimite,
        status: 'pendente',
        prioridade: formData.prioridade,
        criadoEm: new Date().toISOString().split('T')[0],
        elementos: formData.elementos
      };
      setSolicitacoes(prev => [...prev, novaSolicitacao]);
    }

    closeModal();
  };

  const deleteSolicitacao = (id: string) => {
    setSolicitacoes(prev => prev.filter(sol => sol.id !== id));
    setShowDeleteConfirm(null);
  };

  const addElemento = () => {
    const novoElemento: ElementoDespesa = {
      id: Date.now().toString(),
      codigo: '',
      descricao: '',
      valor: 0,
      justificativa: ''
    };
    setFormData(prev => ({
      ...prev,
      elementos: [...prev.elementos, novoElemento]
    }));
  };

  const updateElemento = (index: number, field: keyof ElementoDespesa, value: any) => {
    const novosElementos = [...formData.elementos];
    novosElementos[index] = { ...novosElementos[index], [field]: value };
    
    if (field === 'codigo') {
      const elemento = elementosDisponiveis.find(el => el.codigo === value);
      if (elemento) {
        novosElementos[index].descricao = elemento.descricao;
      }
    }
    
    setFormData(prev => ({ ...prev, elementos: novosElementos }));
  };

  const removeElemento = (index: number) => {
    setFormData(prev => ({
      ...prev,
      elementos: prev.elementos.filter((_, i) => i !== index)
    }));
  };

  const filteredSolicitacoes = solicitacoes.filter(sol => {
    const matchesSearch = 
      sol.numeroProtocolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sol.solicitante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sol.justificativa.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || sol.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || sol.prioridade === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: solicitacoes.length,
    pendentes: solicitacoes.filter(s => s.status === 'pendente').length,
    aprovadas: solicitacoes.filter(s => s.status === 'aprovado').length,
    valorTotal: solicitacoes.reduce((sum, s) => sum + s.valorTotal, 0)
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Suprimento de Fundos</h1>
            <p className="text-gray-600 dark:text-gray-400">Gerencie suas solicitações de suprimento</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors">
            <Download size={16} className="mr-2" />
            Exportar
          </button>
          <button
            onClick={() => openModal()}
            className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Pendentes</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pendentes}</p>
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
              <p className="text-2xl font-bold text-green-600">{stats.aprovadas}</p>
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
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.valorTotal)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <DollarSign size={24} className="text-purple-600" />
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
              placeholder="Buscar por protocolo, solicitante..."
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

          <div>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPriorityFilter('all');
              }}
              className="w-full px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
            >
              <X size={16} className="mr-2" />
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* Solicitações Table */}
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
                  Data Limite
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
              {filteredSolicitacoes.map((solicitacao) => (
                <tr key={solicitacao.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{solicitacao.numeroProtocolo}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{solicitacao.criadoEm}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">{solicitacao.solicitante}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{formatCurrency(solicitacao.valorTotal)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">{new Date(solicitacao.dataLimite).toLocaleDateString('pt-BR')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(solicitacao.status)}`}>
                      {getStatusLabel(solicitacao.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(solicitacao.prioridade)}`}>
                      {getPriorityLabel(solicitacao.prioridade)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => setSelectedSolicitacao(solicitacao)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Ver detalhes"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => openModal(solicitacao)}
                      className="text-green-600 hover:text-green-900"
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(solicitacao.id)}
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

        {filteredSolicitacoes.length === 0 && (
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

      {/* Modal de Formulário */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {isEditing ? 'Editar Solicitação' : 'Nova Solicitação'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Solicitante *
                  </label>
                  <input
                    type="text"
                    value={formData.solicitante}
                    onChange={(e) => setFormData({...formData, solicitante: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Nome do solicitante"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data Limite *
                  </label>
                  <input
                    type="date"
                    value={formData.dataLimite}
                    onChange={(e) => setFormData({...formData, dataLimite: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prioridade
                </label>
                <select
                  value={formData.prioridade}
                  onChange={(e) => setFormData({...formData, prioridade: e.target.value as any})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Justificativa *
                </label>
                <textarea
                  value={formData.justificativa}
                  onChange={(e) => setFormData({...formData, justificativa: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Descreva a justificativa para a solicitação"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">Elementos de Despesa</h4>
                  <button
                    onClick={addElemento}
                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus size={16} className="mr-2" />
                    Adicionar Elemento
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.elementos.map((elemento, index) => (
                    <div key={elemento.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Código do Elemento *
                          </label>
                          <select
                            value={elemento.codigo}
                            onChange={(e) => updateElemento(index, 'codigo', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          >
                            <option value="">Selecione um elemento</option>
                            {elementosDisponiveis.map(el => (
                              <option key={el.codigo} value={el.codigo}>{el.codigo} - {el.descricao}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Valor *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            value={elemento.valor}
                            onChange={(e) => updateElemento(index, 'valor', parseFloat(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                            placeholder="0,00"
                          />
                        </div>

                        <div className="flex items-end">
                          <button
                            onClick={() => removeElemento(index)}
                            className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center"
                          >
                            <Trash2 size={16} className="mr-2" />
                            Remover
                          </button>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Justificativa do Elemento
                        </label>
                        <input
                          type="text"
                          value={elemento.justificativa}
                          onChange={(e) => updateElemento(index, 'justificativa', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          placeholder="Justificativa específica para este elemento"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {formData.elementos.length > 0 && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-200">Valor Total:</span>
                      <span className="text-lg font-bold text-blue-800 dark:text-blue-200">
                        {formatCurrency(formData.elementos.reduce((sum, el) => sum + el.valor, 0))}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={saveSolicitacao}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center"
              >
                <Save size={16} className="mr-2" />
                {isEditing ? 'Atualizar' : 'Criar'} Solicitação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes */}
      {selectedSolicitacao && !showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Detalhes da Solicitação
              </h3>
              <button
                onClick={() => setSelectedSolicitacao(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Protocolo</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{selectedSolicitacao.numeroProtocolo}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedSolicitacao.status)}`}>
                    {getStatusLabel(selectedSolicitacao.status)}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Solicitante</p>
                <p className="text-sm text-gray-900 dark:text-gray-100">{selectedSolicitacao.solicitante}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Justificativa</p>
                <p className="text-sm text-gray-900 dark:text-gray-100">{selectedSolicitacao.justificativa}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Valor Total</p>
                  <p className="text-sm font-bold text-green-600">{formatCurrency(selectedSolicitacao.valorTotal)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Data Limite</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{new Date(selectedSolicitacao.dataLimite).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Elementos de Despesa</p>
                <div className="space-y-2">
                  {selectedSolicitacao.elementos.map(elemento => (
                    <div key={elemento.id} className="border border-gray-200 dark:border-gray-600 rounded p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{elemento.codigo}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{elemento.descricao}</p>
                          {elemento.justificativa && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{elemento.justificativa}</p>
                          )}
                        </div>
                        <p className="text-sm font-bold text-green-600">{formatCurrency(elemento.valor)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setSelectedSolicitacao(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={() => openModal(selectedSolicitacao)}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Editar Solicitação
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <AlertCircle size={24} className="text-red-600 mr-3" />
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
                onClick={() => deleteSolicitacao(showDeleteConfirm)}
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