import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus,
  Download,
  Eye,
  Edit,
  Trash2,
  FileText,
  DollarSign,
  Calendar,
  MapPin,
  Building,
  User,
  CheckCircle,
  AlertTriangle,
  X,
  Save,
  Calculator,
  BarChart3
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
  // Campos de relacionamento
  prestacaoProtocolo?: string;
  solicitacaoProtocolo?: string;
  supridoLotacao?: string;
  criadoEm: string;
}

const INSSAnalysis: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [municipioFilter, setMunicipioFilter] = useState('all');
  const [selectedRecolhimento, setSelectedRecolhimento] = useState<INSSRecolhimento | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Dados simulados
  const [recolhimentos, setRecolhimentos] = useState<INSSRecolhimento[]>([
    {
      id: '1',
      cpfPrestador: '123.456.789-00',
      nomePrestador: 'João Silva Santos',
      dataNascimentoPrestador: '15/03/1980',
      valorBrutoNF: 5000.00,
      dataNotaFiscal: '10/01/2024',
      numeroNotaFiscal: 'NF-001',
      inss11Contribuinte: 550.00,
      inss20Patronal: 1000.00,
      municipio: 'Belém',
      portariaSF: 'SF-2024-0001',
      finalidadeAtividade: 'Serviços de consultoria técnica',
      validado: true,
      prestacaoProtocolo: 'PC-2024-0001',
      solicitacaoProtocolo: 'SF-2024-0001',
      supridoLotacao: 'Vara Criminal',
      criadoEm: '2024-01-10'
    },
    {
      id: '2',
      cpfPrestador: '987.654.321-00',
      nomePrestador: 'Maria Oliveira Costa',
      dataNascimentoPrestador: '22/07/1975',
      valorBrutoNF: 3500.00,
      dataNotaFiscal: '15/01/2024',
      numeroNotaFiscal: 'NF-002',
      inss11Contribuinte: 385.00,
      inss20Patronal: 700.00,
      municipio: 'Santarém',
      portariaSF: 'SF-2024-0002',
      finalidadeAtividade: 'Material de escritório',
      validado: false,
      prestacaoProtocolo: 'PC-2024-0002',
      solicitacaoProtocolo: 'SF-2024-0002',
      supridoLotacao: 'Vara Cível',
      criadoEm: '2024-01-15'
    },
    {
      id: '3',
      cpfPrestador: '456.789.123-00',
      nomePrestador: 'Carlos Mendes Silva',
      dataNascimentoPrestador: '08/11/1982',
      valorBrutoNF: 7200.00,
      dataNotaFiscal: '20/01/2024',
      numeroNotaFiscal: 'NF-003',
      inss11Contribuinte: 792.00,
      inss20Patronal: 1440.00,
      municipio: 'Marabá',
      portariaSF: 'SF-2024-0003',
      finalidadeAtividade: 'Serviços de manutenção',
      validado: true,
      prestacaoProtocolo: 'PC-2024-0003',
      solicitacaoProtocolo: 'SF-2024-0003',
      supridoLotacao: 'Administrativo',
      criadoEm: '2024-01-20'
    }
  ]);

  const [formData, setFormData] = useState<Partial<INSSRecolhimento>>({
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

  const [reportFilters, setReportFilters] = useState({
    dataInicio: '',
    dataFim: '',
    municipio: 'all'
  });

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

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const validateCPF = (cpf: string) => {
    const cleanCPF = cpf.replace(/[^\d]/g, '');
    if (cleanCPF.length !== 11) return false;
    
    // Verificar sequências inválidas
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
    
    // Calcular dígitos verificadores
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (10 - i);
    }
    let digit1 = 11 - (sum % 11);
    if (digit1 > 9) digit1 = 0;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanCPF.charAt(i)) * (11 - i);
    }
    let digit2 = 11 - (sum % 11);
    if (digit2 > 9) digit2 = 0;
    
    return digit1 === parseInt(cleanCPF.charAt(9)) && digit2 === parseInt(cleanCPF.charAt(10));
  };

  const calculateINSS = (valorBruto: number) => {
    return {
      inss11: Math.round(valorBruto * 0.11 * 100) / 100,
      inss20: Math.round(valorBruto * 0.20 * 100) / 100
    };
  };

  const handleValueChange = (field: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Calcular INSS automaticamente quando o valor bruto mudar
      if (field === 'valorBrutoNF' && typeof value === 'number') {
        const inss = calculateINSS(value);
        updated.inss11Contribuinte = inss.inss11;
        updated.inss20Patronal = inss.inss20;
      }
      
      return updated;
    });
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
  };

  const saveRecolhimento = () => {
    if (!formData.cpfPrestador || !formData.nomePrestador || !formData.valorBrutoNF) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    if (!validateCPF(formData.cpfPrestador)) {
      alert('CPF inválido');
      return;
    }

    if (isEditing && selectedRecolhimento) {
      setRecolhimentos(prev => prev.map(r => 
        r.id === selectedRecolhimento.id 
          ? { ...r, ...formData } as INSSRecolhimento
          : r
      ));
    } else {
      const newRecolhimento: INSSRecolhimento = {
        id: Date.now().toString(),
        ...formData as INSSRecolhimento,
        criadoEm: new Date().toISOString().split('T')[0]
      };
      setRecolhimentos(prev => [...prev, newRecolhimento]);
    }

    closeModal();
  };

  const deleteRecolhimento = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este recolhimento?')) {
      setRecolhimentos(prev => prev.filter(r => r.id !== id));
    }
  };

  const toggleValidacao = (id: string) => {
    setRecolhimentos(prev => prev.map(r => 
      r.id === id ? { ...r, validado: !r.validado } : r
    ));
  };

  const generateReport = () => {
    if (!reportFilters.dataInicio || !reportFilters.dataFim) {
      alert('Selecione o período para o relatório');
      return;
    }

    const filteredData = recolhimentos.filter(r => {
      const dataRecolhimento = new Date(r.dataNotaFiscal.split('/').reverse().join('-'));
      const dataInicio = new Date(reportFilters.dataInicio);
      const dataFim = new Date(reportFilters.dataFim);
      
      const dentroPeríodo = dataRecolhimento >= dataInicio && dataRecolhimento <= dataFim;
      const municipioMatch = reportFilters.municipio === 'all' || r.municipio === reportFilters.municipio;
      
      return dentroPeríodo && municipioMatch;
    });

    const relatorio = {
      periodo: `${reportFilters.dataInicio} a ${reportFilters.dataFim}`,
      municipio: reportFilters.municipio === 'all' ? 'Todos' : reportFilters.municipio,
      totalRecolhimentos: filteredData.length,
      valorBrutoTotal: filteredData.reduce((sum, r) => sum + r.valorBrutoNF, 0),
      inss11Total: filteredData.reduce((sum, r) => sum + r.inss11Contribuinte, 0),
      inss20Total: filteredData.reduce((sum, r) => sum + r.inss20Patronal, 0),
      inssTotal: filteredData.reduce((sum, r) => sum + r.inss11Contribuinte + r.inss20Patronal, 0),
      dados: filteredData
    };

    console.log('Relatório gerado:', relatorio);
    alert(`Relatório gerado com ${relatorio.totalRecolhimentos} recolhimentos. Total INSS: ${formatCurrency(relatorio.inssTotal)}`);
  };

  const filteredRecolhimentos = recolhimentos.filter(recolhimento => {
    const matchesSearch = 
      recolhimento.cpfPrestador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recolhimento.nomePrestador.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recolhimento.municipio.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'validado' && recolhimento.validado) ||
      (statusFilter === 'pendente' && !recolhimento.validado);
    
    const matchesMunicipio = municipioFilter === 'all' || recolhimento.municipio === municipioFilter;
    
    return matchesSearch && matchesStatus && matchesMunicipio;
  });

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Calculator size={24} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Análise de Recolhimentos INSS</h2>
              <p className="text-gray-600 dark:text-gray-400">Consolidação dos recolhimentos de INSS das prestações de contas</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowReportModal(true)}
              className="flex items-center px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
            >
              <BarChart3 size={16} className="mr-2" />
              Relatório
            </button>
            <button
              onClick={() => openModal()}
              className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} className="mr-2" />
              Novo Recolhimento
            </button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.total}</p>
              </div>
              <FileText size={24} className="text-blue-500" />
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Validados</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.validados}</p>
              </div>
              <CheckCircle size={24} className="text-green-500" />
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Pendentes</p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">{stats.pendentes}</p>
              </div>
              <AlertTriangle size={24} className="text-orange-500" />
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Valor Total</p>
                <p className="text-lg font-bold text-purple-700 dark:text-purple-300">{formatCurrency(stats.valorTotal)}</p>
              </div>
              <DollarSign size={24} className="text-purple-500" />
            </div>
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">INSS Total</p>
                <p className="text-lg font-bold text-indigo-700 dark:text-indigo-300">{formatCurrency(stats.inssTotal)}</p>
              </div>
              <Calculator size={24} className="text-indigo-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
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

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setMunicipioFilter('all');
              }}
              className="px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors flex items-center"
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
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  CPF Prestador
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nome Completo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Data Nascimento
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Valor Bruto NF
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Data NF
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  INSS 11%
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  INSS 20%
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Município
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Portaria SF
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Finalidade
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRecolhimentos.map((recolhimento) => (
                <tr key={recolhimento.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {recolhimento.cpfPrestador}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {recolhimento.nomePrestador}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {recolhimento.dataNascimentoPrestador}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {formatCurrency(recolhimento.valorBrutoNF)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {recolhimento.dataNotaFiscal}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {formatCurrency(recolhimento.inss11Contribuinte)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-purple-600">
                    {formatCurrency(recolhimento.inss20Patronal)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {recolhimento.municipio}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {recolhimento.portariaSF}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate">
                    {recolhimento.finalidadeAtividade}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
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
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
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
                  <p className="text-sm text-gray-900 dark:text-gray-100">{selectedRecolhimento.cpfPrestador}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nome Completo</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{selectedRecolhimento.nomePrestador}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data de Nascimento</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{selectedRecolhimento.dataNascimentoPrestador}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Valor Bruto da NF</label>
                  <p className="text-sm font-semibold text-green-600">{formatCurrency(selectedRecolhimento.valorBrutoNF)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Data da Nota Fiscal</label>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{selectedRecolhimento.dataNotaFiscal}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">INSS 11% (Contribuinte)</label>
                  <p className="text-sm font-semibold text-blue-600">{formatCurrency(selectedRecolhimento.inss11Contribuinte)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">INSS 20% (Patronal)</label>
                  <p className="text-sm font-semibold text-purple-600">{formatCurrency(selectedRecolhimento.inss20Patronal)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total INSS</label>
                  <p className="text-sm font-bold text-indigo-600">
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
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Finalidade/Atividade</label>
              <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                {selectedRecolhimento.finalidadeAtividade}
              </p>
            </div>

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
                    onChange={(e) => handleValueChange('cpfPrestador', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="000.000.000-00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nome Completo do Prestador *
                  </label>
                  <input
                    type="text"
                    value={formData.nomePrestador || ''}
                    onChange={(e) => handleValueChange('nomePrestador', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Nome completo"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data de Nascimento *
                  </label>
                  <input
                    type="text"
                    value={formData.dataNascimentoPrestador || ''}
                    onChange={(e) => handleValueChange('dataNascimentoPrestador', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="DD/MM/AAAA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Valor Bruto da NF *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.valorBrutoNF || ''}
                    onChange={(e) => handleValueChange('valorBrutoNF', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data da Nota Fiscal *
                  </label>
                  <input
                    type="text"
                    value={formData.dataNotaFiscal || ''}
                    onChange={(e) => handleValueChange('dataNotaFiscal', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="DD/MM/AAAA"
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
                    onChange={(e) => handleValueChange('inss11Contribuinte', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Calculado automaticamente"
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
                    onChange={(e) => handleValueChange('inss20Patronal', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Calculado automaticamente"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Município *
                  </label>
                  <input
                    type="text"
                    value={formData.municipio || ''}
                    onChange={(e) => handleValueChange('municipio', e.target.value)}
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
                    onChange={(e) => handleValueChange('portariaSF', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="SF-AAAA-NNNN"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.validado || false}
                      onChange={(e) => handleValueChange('validado', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Recolhimento validado
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Finalidade/Atividade *
              </label>
              <textarea
                value={formData.finalidadeAtividade || ''}
                onChange={(e) => handleValueChange('finalidadeAtividade', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Descreva a finalidade ou atividade..."
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Observações
              </label>
              <textarea
                value={formData.observacoes || ''}
                onChange={(e) => handleValueChange('observacoes', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Observações adicionais..."
              />
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

      {/* Modal de Relatório */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Gerar Relatório de Arrecadação INSS
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data Início *
                  </label>
                  <input
                    type="date"
                    value={reportFilters.dataInicio}
                    onChange={(e) => setReportFilters({...reportFilters, dataInicio: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Data Fim *
                  </label>
                  <input
                    type="date"
                    value={reportFilters.dataFim}
                    onChange={(e) => setReportFilters({...reportFilters, dataFim: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Município
                </label>
                <select
                  value={reportFilters.municipio}
                  onChange={(e) => setReportFilters({...reportFilters, municipio: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="all">Todos os Municípios</option>
                  {municipios.map(municipio => (
                    <option key={municipio} value={municipio}>{municipio}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={generateReport}
                className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center"
              >
                <BarChart3 size={16} className="mr-2" />
                Gerar Relatório
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default INSSAnalysis;