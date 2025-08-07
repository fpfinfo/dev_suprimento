import React, { useState, useEffect } from 'react';
import { 
  Calculator,
  FileText,
  Download,
  Upload,
  Search,
  Filter,
  Calendar,
  MapPin,
  User,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  RefreshCw,
  BarChart3,
  TrendingUp,
  Users,
  Building
} from 'lucide-react';

interface INSSRecolhimento {
  id: string;
  cpfPrestador: string;
  nomePrestador: string;
  dataNascimentoPrestador: string;
  valorBrutoNF: number;
  dataNotaFiscal: string;
  numeroNotaFiscal?: string;
  inss11Contribuinte: number;
  inss20Patronal: number;
  municipio: string;
  portariaSF: string;
  finalidadeAtividade: string;
  validado: boolean;
  observacoes?: string;
  prestacaoProtocolo?: string;
  solicitacaoProtocolo?: string;
  supridoLotacao?: string;
  criadoEm: string;
}

interface RelatorioArrecadacao {
  periodo: string;
  municipio: string;
  totalRecolhimentos: number;
  valorBrutoTotal: number;
  inss11Total: number;
  inss20Total: number;
  inssTotal: number;
}

const INSSAnalysis: React.FC = () => {
  const [recolhimentos, setRecolhimentos] = useState<INSSRecolhimento[]>([]);
  const [filteredRecolhimentos, setFilteredRecolhimentos] = useState<INSSRecolhimento[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [municipioFilter, setMunicipioFilter] = useState('all');
  const [selectedRecolhimento, setSelectedRecolhimento] = useState<INSSRecolhimento | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showRelatorioModal, setShowRelatorioModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados para relatórios
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [municipioRelatorio, setMunicipioRelatorio] = useState('');
  const [relatorioData, setRelatorioData] = useState<RelatorioArrecadacao[]>([]);

  // Estados para formulário
  const [formData, setFormData] = useState<Partial<INSSRecolhimento>>({});

  // Dados simulados
  useEffect(() => {
    const dadosSimulados: INSSRecolhimento[] = [
      {
        id: '1',
        cpfPrestador: '123.456.789-00',
        nomePrestador: 'João Silva Santos',
        dataNascimentoPrestador: '1985-03-15',
        valorBrutoNF: 5000.00,
        dataNotaFiscal: '2024-01-15',
        numeroNotaFiscal: 'NF-001/2024',
        inss11Contribuinte: 550.00,
        inss20Patronal: 1000.00,
        municipio: 'Belém',
        portariaSF: 'SF-2024-0001',
        finalidadeAtividade: 'Serviços de consultoria técnica',
        validado: true,
        prestacaoProtocolo: 'PC-2024-0001',
        solicitacaoProtocolo: 'SF-2024-0001',
        supridoLotacao: 'Vara Criminal',
        criadoEm: '2024-01-16T10:30:00Z'
      },
      {
        id: '2',
        cpfPrestador: '987.654.321-00',
        nomePrestador: 'Maria Oliveira Costa',
        dataNascimentoPrestador: '1978-08-22',
        valorBrutoNF: 3200.00,
        dataNotaFiscal: '2024-01-20',
        numeroNotaFiscal: 'NF-002/2024',
        inss11Contribuinte: 352.00,
        inss20Patronal: 640.00,
        municipio: 'Santarém',
        portariaSF: 'SF-2024-0002',
        finalidadeAtividade: 'Material de escritório',
        validado: false,
        observacoes: 'Aguardando validação de documentos',
        prestacaoProtocolo: 'PC-2024-0002',
        solicitacaoProtocolo: 'SF-2024-0002',
        supridoLotacao: 'Vara Cível',
        criadoEm: '2024-01-21T14:15:00Z'
      },
      {
        id: '3',
        cpfPrestador: '456.789.123-00',
        nomePrestador: 'Carlos Mendes Silva',
        dataNascimentoPrestador: '1990-12-10',
        valorBrutoNF: 7500.00,
        dataNotaFiscal: '2024-01-25',
        numeroNotaFiscal: 'NF-003/2024',
        inss11Contribuinte: 825.00,
        inss20Patronal: 1500.00,
        municipio: 'Marabá',
        portariaSF: 'SF-2024-0003',
        finalidadeAtividade: 'Serviços de manutenção',
        validado: true,
        prestacaoProtocolo: 'PC-2024-0003',
        solicitacaoProtocolo: 'SF-2024-0003',
        supridoLotacao: 'Administrativo',
        criadoEm: '2024-01-26T09:45:00Z'
      },
      {
        id: '4',
        cpfPrestador: '321.654.987-00',
        nomePrestador: 'Ana Paula Ferreira',
        dataNascimentoPrestador: '1982-05-18',
        valorBrutoNF: 4200.00,
        dataNotaFiscal: '2024-02-01',
        numeroNotaFiscal: 'NF-004/2024',
        inss11Contribuinte: 462.00,
        inss20Patronal: 840.00,
        municipio: 'Belém',
        portariaSF: 'SF-2024-0004',
        finalidadeAtividade: 'Transporte e locomoção',
        validado: false,
        observacoes: 'Pendente de análise',
        prestacaoProtocolo: 'PC-2024-0004',
        solicitacaoProtocolo: 'SF-2024-0004',
        supridoLotacao: 'Vara de Família',
        criadoEm: '2024-02-02T11:20:00Z'
      }
    ];

    setRecolhimentos(dadosSimulados);
    setFilteredRecolhimentos(dadosSimulados);
  }, []);

  // Filtrar recolhimentos
  useEffect(() => {
    let filtered = recolhimentos.filter(recolhimento => {
      const matchesSearch = 
        recolhimento.cpfPrestador.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recolhimento.nomePrestador.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recolhimento.municipio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recolhimento.portariaSF.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'validado' && recolhimento.validado) ||
        (statusFilter === 'pendente' && !recolhimento.validado);
      
      const matchesMunicipio = municipioFilter === 'all' || recolhimento.municipio === municipioFilter;
      
      return matchesSearch && matchesStatus && matchesMunicipio;
    });

    setFilteredRecolhimentos(filtered);
  }, [recolhimentos, searchTerm, statusFilter, municipioFilter]);

  // Estatísticas
  const stats = {
    total: recolhimentos.length,
    validados: recolhimentos.filter(r => r.validado).length,
    pendentes: recolhimentos.filter(r => !r.validado).length,
    valorTotal: recolhimentos.reduce((sum, r) => sum + r.valorBrutoNF, 0),
    inssTotal: recolhimentos.reduce((sum, r) => sum + r.inss11Contribuinte + r.inss20Patronal, 0)
  };

  const municipios = [...new Set(recolhimentos.map(r => r.municipio))];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const openModal = (recolhimento?: INSSRecolhimento) => {
    if (recolhimento) {
      setSelectedRecolhimento(recolhimento);
      setFormData(recolhimento);
      setIsEditing(true);
    } else {
      setSelectedRecolhimento(null);
      setFormData({
        cpfPrestador: '',
        nomePrestador: '',
        dataNascimentoPrestador: '',
        valorBrutoNF: 0,
        dataNotaFiscal: '',
        numeroNotaFiscal: '',
        inss11Contribuinte: 0,
        inss20Patronal: 0,
        municipio: '',
        portariaSF: '',
        finalidadeAtividade: '',
        validado: false,
        observacoes: ''
      });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRecolhimento(null);
    setIsEditing(false);
    setFormData({});
  };

  const saveRecolhimento = () => {
    if (!formData.cpfPrestador || !formData.nomePrestador || !formData.valorBrutoNF) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (isEditing && selectedRecolhimento) {
      setRecolhimentos(prev => prev.map(r => 
        r.id === selectedRecolhimento.id 
          ? { ...r, ...formData } as INSSRecolhimento
          : r
      ));
    } else {
      const novoRecolhimento: INSSRecolhimento = {
        id: Date.now().toString(),
        ...formData as INSSRecolhimento,
        criadoEm: new Date().toISOString()
      };
      setRecolhimentos(prev => [...prev, novoRecolhimento]);
    }

    closeModal();
  };

  const toggleValidacao = (id: string) => {
    setRecolhimentos(prev => prev.map(r => 
      r.id === id ? { ...r, validado: !r.validado } : r
    ));
  };

  const deleteRecolhimento = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este recolhimento?')) {
      setRecolhimentos(prev => prev.filter(r => r.id !== id));
    }
  };

  const calcularINSS = (valorBruto: number) => {
    const inss11 = valorBruto * 0.11;
    const inss20 = valorBruto * 0.20;
    setFormData(prev => ({
      ...prev,
      inss11Contribuinte: Number(inss11.toFixed(2)),
      inss20Patronal: Number(inss20.toFixed(2))
    }));
  };

  const gerarRelatorio = () => {
    if (!dataInicio || !dataFim) {
      alert('Selecione o período para o relatório');
      return;
    }

    setLoading(true);
    
    // Simular geração de relatório
    setTimeout(() => {
      const dadosRelatorio: RelatorioArrecadacao[] = [
        {
          periodo: '01/2024',
          municipio: 'Belém',
          totalRecolhimentos: 15,
          valorBrutoTotal: 75000.00,
          inss11Total: 8250.00,
          inss20Total: 15000.00,
          inssTotal: 23250.00
        },
        {
          periodo: '01/2024',
          municipio: 'Santarém',
          totalRecolhimentos: 8,
          valorBrutoTotal: 32000.00,
          inss11Total: 3520.00,
          inss20Total: 6400.00,
          inssTotal: 9920.00
        },
        {
          periodo: '02/2024',
          municipio: 'Belém',
          totalRecolhimentos: 12,
          valorBrutoTotal: 60000.00,
          inss11Total: 6600.00,
          inss20Total: 12000.00,
          inssTotal: 18600.00
        }
      ];

      setRelatorioData(dadosRelatorio);
      setLoading(false);
    }, 1500);
  };

  const exportarRelatorio = () => {
    // Simular exportação
    alert('Relatório exportado com sucesso!');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setMunicipioFilter('all');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
            <Calculator size={24} className="text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Análise de Recolhimentos INSS</h1>
            <p className="text-gray-600 dark:text-gray-400">Consolidação e análise dos recolhimentos de INSS das prestações de contas</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowRelatorioModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            <BarChart3 size={16} className="mr-2" />
            Relatórios
          </button>
          <button
            onClick={() => openModal()}
            className="flex items-center px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Novo Recolhimento
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Total de Recolhimentos</p>
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Validados</p>
              <p className="text-2xl font-bold text-green-600">{stats.validados}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Pendentes</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pendentes}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <AlertCircle size={24} className="text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">Valor Total NF</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.valorTotal)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <DollarSign size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">INSS Total</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.inssTotal)}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <TrendingUp size={24} className="text-red-600" />
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
              placeholder="CPF, nome ou município..."
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
              <option value="validado">Validados</option>
              <option value="pendente">Pendentes</option>
            </select>
          </div>

          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={municipioFilter}
              onChange={(e) => setMunicipioFilter(e.target.value)}
            >
              <option value="all">Todos os Municípios</option>
              {municipios.map(municipio => (
                <option key={municipio} value={municipio}>{municipio}</option>
              ))}
            </select>
          </div>

          <div>
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
            >
              <X size={16} className="mr-2" />
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* Tabela de Recolhimentos */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  CPF Prestador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nome Completo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Data Nascimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Valor Bruto NF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Data NF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  INSS 11%
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  INSS 20%
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Município
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Portaria SF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Finalidade
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
              {filteredRecolhimentos.map((recolhimento) => (
                <tr key={recolhimento.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {recolhimento.cpfPrestador}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {recolhimento.nomePrestador}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {formatDate(recolhimento.dataNascimentoPrestador)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    {formatCurrency(recolhimento.valorBrutoNF)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {formatDate(recolhimento.dataNotaFiscal)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                    {formatCurrency(recolhimento.inss11Contribuinte)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-purple-600">
                    {formatCurrency(recolhimento.inss20Patronal)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {recolhimento.municipio}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {recolhimento.portariaSF}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate">
                    {recolhimento.finalidadeAtividade}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleValidacao(recolhimento.id)}
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80 ${
                        recolhimento.validado 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                          : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                      }`}
                    >
                      {recolhimento.validado ? 'Validado' : 'Pendente'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => setSelectedRecolhimento(recolhimento)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Ver detalhes"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => openModal(recolhimento)}
                      className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteRecolhimento(recolhimento.id)}
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

        {filteredRecolhimentos.length === 0 && (
          <div className="text-center py-12">
            <Calculator size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Nenhum recolhimento encontrado</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || statusFilter !== 'all' || municipioFilter !== 'all'
                ? 'Tente ajustar os filtros de busca.' 
                : 'Não há recolhimentos cadastrados no momento.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal de Detalhes */}
      {selectedRecolhimento && !showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Detalhes do Recolhimento INSS
              </h3>
              <button
                onClick={() => setSelectedRecolhimento(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">CPF do Prestador</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100 font-mono">{selectedRecolhimento.cpfPrestador}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome Completo</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{selectedRecolhimento.nomePrestador}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data de Nascimento</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{formatDate(selectedRecolhimento.dataNascimentoPrestador)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Valor Bruto da NF</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100 font-semibold">{formatCurrency(selectedRecolhimento.valorBrutoNF)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data da Nota Fiscal</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{formatDate(selectedRecolhimento.dataNotaFiscal)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Número da NF</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{selectedRecolhimento.numeroNotaFiscal || 'Não informado'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">INSS 11% (Contribuinte)</label>
                  <p className="text-sm text-blue-600 font-semibold">{formatCurrency(selectedRecolhimento.inss11Contribuinte)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">INSS 20% (Patronal)</label>
                  <p className="text-sm text-purple-600 font-semibold">{formatCurrency(selectedRecolhimento.inss20Patronal)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total INSS</label>
                  <p className="text-sm text-red-600 font-bold">
                    {formatCurrency(selectedRecolhimento.inss11Contribuinte + selectedRecolhimento.inss20Patronal)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Município</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{selectedRecolhimento.municipio}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Portaria SF</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{selectedRecolhimento.portariaSF}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    selectedRecolhimento.validado 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                  }`}>
                    {selectedRecolhimento.validado ? 'Validado' : 'Pendente'}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Finalidade/Atividade</label>
              <p className="text-sm text-gray-900 dark:text-gray-100 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                {selectedRecolhimento.finalidadeAtividade}
              </p>
            </div>

            {selectedRecolhimento.observacoes && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Observações</label>
                <p className="text-sm text-gray-900 dark:text-gray-100 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  {selectedRecolhimento.observacoes}
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setSelectedRecolhimento(null)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={() => openModal(selectedRecolhimento)}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Formulário */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {isEditing ? 'Editar Recolhimento INSS' : 'Novo Recolhimento INSS'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    CPF do Prestador *
                  </label>
                  <input
                    type="text"
                    value={formData.cpfPrestador || ''}
                    onChange={(e) => setFormData({...formData, cpfPrestador: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="000.000.000-00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={formData.nomePrestador || ''}
                    onChange={(e) => setFormData({...formData, nomePrestador: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Nome completo do prestador"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data de Nascimento *
                  </label>
                  <input
                    type="date"
                    value={formData.dataNascimentoPrestador || ''}
                    onChange={(e) => setFormData({...formData, dataNascimentoPrestador: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Valor Bruto da NF *
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      value={formData.valorBrutoNF || ''}
                      onChange={(e) => {
                        const valor = parseFloat(e.target.value) || 0;
                        setFormData({...formData, valorBrutoNF: valor});
                      }}
                      onBlur={() => formData.valorBrutoNF && calcularINSS(formData.valorBrutoNF)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      placeholder="0.00"
                    />
                    <button
                      type="button"
                      onClick={() => formData.valorBrutoNF && calcularINSS(formData.valorBrutoNF)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-800"
                      title="Calcular INSS automaticamente"
                    >
                      <Calculator size={16} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data da Nota Fiscal *
                  </label>
                  <input
                    type="date"
                    value={formData.dataNotaFiscal || ''}
                    onChange={(e) => setFormData({...formData, dataNotaFiscal: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Número da NF
                  </label>
                  <input
                    type="text"
                    value={formData.numeroNotaFiscal || ''}
                    onChange={(e) => setFormData({...formData, numeroNotaFiscal: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="NF-001/2024"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    INSS 11% (Contribuinte) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.inss11Contribuinte || ''}
                    onChange={(e) => setFormData({...formData, inss11Contribuinte: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    INSS 20% (Patronal) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.inss20Patronal || ''}
                    onChange={(e) => setFormData({...formData, inss20Patronal: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Município *
                  </label>
                  <input
                    type="text"
                    value={formData.municipio || ''}
                    onChange={(e) => setFormData({...formData, municipio: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Nome do município"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Portaria SF *
                  </label>
                  <input
                    type="text"
                    value={formData.portariaSF || ''}
                    onChange={(e) => setFormData({...formData, portariaSF: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="SF-2024-0001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Finalidade/Atividade *
                  </label>
                  <textarea
                    value={formData.finalidadeAtividade || ''}
                    onChange={(e) => setFormData({...formData, finalidadeAtividade: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Descrição da finalidade ou atividade"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Observações
                  </label>
                  <textarea
                    value={formData.observacoes || ''}
                    onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Observações adicionais"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="validado"
                    checked={formData.validado || false}
                    onChange={(e) => setFormData({...formData, validado: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                  />
                  <label htmlFor="validado" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Recolhimento validado
                  </label>
                </div>
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
                onClick={saveRecolhimento}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center"
              >
                <Save size={16} className="mr-2" />
                {isEditing ? 'Atualizar' : 'Salvar'} Recolhimento
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Relatórios */}
      {showRelatorioModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Relatórios de Arrecadação INSS
              </h3>
              <button
                onClick={() => setShowRelatorioModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            {/* Filtros do Relatório */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data Início
                  </label>
                  <input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data Fim
                  </label>
                  <input
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Município (Opcional)
                  </label>
                  <select
                    value={municipioRelatorio}
                    onChange={(e) => setMunicipioRelatorio(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Todos os municípios</option>
                    {municipios.map(municipio => (
                      <option key={municipio} value={municipio}>{municipio}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={gerarRelatorio}
                    disabled={loading}
                    className="w-full px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    {loading ? (
                      <RefreshCw size={16} className="mr-2 animate-spin" />
                    ) : (
                      <BarChart3 size={16} className="mr-2" />
                    )}
                    Gerar Relatório
                  </button>
                </div>
              </div>
            </div>

            {/* Tabela de Relatório */}
            {relatorioData.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Arrecadação por Período
                  </h4>
                  <button
                    onClick={exportarRelatorio}
                    className="flex items-center px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
                  >
                    <Download size={16} className="mr-2" />
                    Exportar
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200 dark:border-gray-700 rounded-lg">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Período
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Município
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Recolhimentos
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Valor Bruto Total
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          INSS 11%
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          INSS 20%
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          INSS Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {relatorioData.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                            {item.periodo}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {item.municipio}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                            {item.totalRecolhimentos}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                            {formatCurrency(item.valorBrutoTotal)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">
                            {formatCurrency(item.inss11Total)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-purple-600">
                            {formatCurrency(item.inss20Total)}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                            {formatCurrency(item.inssTotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <td colSpan={2} className="px-4 py-4 text-sm font-bold text-gray-900 dark:text-gray-100">
                          TOTAIS
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-gray-100">
                          {relatorioData.reduce((sum, item) => sum + item.totalRecolhimentos, 0)}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                          {formatCurrency(relatorioData.reduce((sum, item) => sum + item.valorBrutoTotal, 0))}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-blue-600">
                          {formatCurrency(relatorioData.reduce((sum, item) => sum + item.inss11Total, 0))}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-purple-600">
                          {formatCurrency(relatorioData.reduce((sum, item) => sum + item.inss20Total, 0))}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                          {formatCurrency(relatorioData.reduce((sum, item) => sum + item.inssTotal, 0))}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowRelatorioModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default INSSAnalysis;