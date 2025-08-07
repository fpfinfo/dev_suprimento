import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus,
  Eye,
  Edit,
  Trash2,
  FileText,
  Download,
  Upload,
  Calendar,
  DollarSign,
  User,
  Building,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  Save,
  Send,
  Printer,
  MessageSquare,
  Bell,
  AlertCircle,
  Info,
  CheckCircle2,
  XCircle,
  Zap,
  Archive,
  RefreshCw,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Hash,
  Calendar as CalendarIcon,
  Target,
  Flag,
  Users,
  FileCheck,
  ClipboardList,
  PenTool,
  Settings
} from 'lucide-react';

interface Solicitacao {
  id: string;
  numeroProtocolo: string;
  solicitante: {
    nome: string;
    cpf: string;
    email: string;
    telefone: string;
    lotacao: string;
    cargo: string;
  };
  valorTotal: number;
  justificativa: string;
  dataLimite: string;
  status: 'pendente' | 'em_analise' | 'aprovado' | 'rejeitado' | 'cancelado';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  dataSubmissao: string;
  analisadoPor?: string;
  dataAnalise?: string;
  parecerTecnico?: string;
  numeroPortaria?: string;
  dataPortaria?: string;
  observacoes?: string;
  elementos: {
    codigo: string;
    descricao: string;
    valor: number;
    justificativa: string;
  }[];
  documentos: {
    nome: string;
    tipo: string;
    tamanho: string;
    dataUpload: string;
  }[];
  mensagens: {
    id: string;
    remetente: string;
    conteudo: string;
    data: string;
    lida: boolean;
  }[];
}

interface Alert {
  id: string;
  tipo: 'prazo' | 'valor' | 'documento' | 'sistema';
  prioridade: 'alta' | 'media' | 'baixa';
  titulo: string;
  descricao: string;
  solicitacaoId?: string;
  data: string;
  lida: boolean;
  acao?: string;
}

const RequestAnalysis: React.FC = () => {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [filteredSolicitacoes, setFilteredSolicitacoes] = useState<Solicitacao[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [prioridadeFilter, setPrioridadeFilter] = useState('all');
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<Solicitacao | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'create' | 'print' | 'portaria' | 'messages'>('view');
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showAlerts, setShowAlerts] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Dados simulados
  useEffect(() => {
    const mockSolicitacoes: Solicitacao[] = [
      {
        id: '1',
        numeroProtocolo: 'SF-2024-0001',
        solicitante: {
          nome: 'João Silva Santos',
          cpf: '123.456.789-00',
          email: 'joao.silva@tjpa.jus.br',
          telefone: '(91) 99999-9999',
          lotacao: 'Vara Criminal',
          cargo: 'Analista Judiciário'
        },
        valorTotal: 15000.00,
        justificativa: 'Aquisição de material de escritório e equipamentos para modernização da vara criminal.',
        dataLimite: '2024-03-15',
        status: 'pendente',
        prioridade: 'alta',
        dataSubmissao: '2024-01-15',
        observacoes: 'Solicitação urgente devido ao alto volume de processos.',
        elementos: [
          {
            codigo: '3.3.90.30',
            descricao: 'Material de Consumo',
            valor: 8000.00,
            justificativa: 'Papel, toner, material de escritório'
          },
          {
            codigo: '4.4.90.52',
            descricao: 'Equipamentos',
            valor: 7000.00,
            justificativa: 'Computadores e impressoras'
          }
        ],
        documentos: [
          {
            nome: 'orcamento_material.pdf',
            tipo: 'Orçamento',
            tamanho: '2.5 MB',
            dataUpload: '2024-01-15'
          },
          {
            nome: 'justificativa_tecnica.docx',
            tipo: 'Justificativa',
            tamanho: '1.2 MB',
            dataUpload: '2024-01-15'
          }
        ],
        mensagens: [
          {
            id: '1',
            remetente: 'João Silva Santos',
            conteudo: 'Solicito análise prioritária devido à urgência da demanda.',
            data: '2024-01-15 10:30',
            lida: true
          }
        ]
      },
      {
        id: '2',
        numeroProtocolo: 'SF-2024-0002',
        solicitante: {
          nome: 'Maria Oliveira Costa',
          cpf: '987.654.321-00',
          email: 'maria.costa@tjpa.jus.br',
          telefone: '(91) 88888-8888',
          lotacao: 'Vara Cível',
          cargo: 'Técnico Judiciário'
        },
        valorTotal: 8500.00,
        justificativa: 'Despesas com transporte e diárias para audiências em comarcas do interior.',
        dataLimite: '2024-02-28',
        status: 'em_analise',
        prioridade: 'media',
        dataSubmissao: '2024-01-10',
        analisadoPor: 'Analista SOSFU',
        dataAnalise: '2024-01-18',
        parecerTecnico: 'Solicitação em conformidade com as normas. Aguardando aprovação final.',
        elementos: [
          {
            codigo: '3.3.90.33',
            descricao: 'Passagens e Despesas com Locomoção',
            valor: 5000.00,
            justificativa: 'Transporte para audiências'
          },
          {
            codigo: '3.3.90.14',
            descricao: 'Diárias - Civil',
            valor: 3500.00,
            justificativa: 'Hospedagem e alimentação'
          }
        ],
        documentos: [
          {
            nome: 'cronograma_audiencias.pdf',
            tipo: 'Cronograma',
            tamanho: '1.8 MB',
            dataUpload: '2024-01-10'
          }
        ],
        mensagens: [
          {
            id: '2',
            remetente: 'Analista SOSFU',
            conteudo: 'Documentação analisada. Solicitação aprovada tecnicamente.',
            data: '2024-01-18 14:20',
            lida: false
          }
        ]
      },
      {
        id: '3',
        numeroProtocolo: 'SF-2024-0003',
        solicitante: {
          nome: 'Carlos Mendes Silva',
          cpf: '456.789.123-00',
          email: 'carlos.mendes@tjpa.jus.br',
          telefone: '(91) 77777-7777',
          lotacao: 'Administrativo',
          cargo: 'Servidor'
        },
        valorTotal: 12000.00,
        justificativa: 'Manutenção preventiva e corretiva de equipamentos de informática.',
        dataLimite: '2024-04-10',
        status: 'aprovado',
        prioridade: 'baixa',
        dataSubmissao: '2024-01-05',
        analisadoPor: 'Analista SOSFU',
        dataAnalise: '2024-01-12',
        parecerTecnico: 'Solicitação aprovada. Valores dentro dos limites estabelecidos.',
        numeroPortaria: 'PORT-2024-001',
        dataPortaria: '2024-01-12',
        elementos: [
          {
            codigo: '3.3.90.39',
            descricao: 'Outros Serviços de Terceiros - PJ',
            valor: 12000.00,
            justificativa: 'Contrato de manutenção de equipamentos'
          }
        ],
        documentos: [
          {
            nome: 'contrato_manutencao.pdf',
            tipo: 'Contrato',
            tamanho: '3.2 MB',
            dataUpload: '2024-01-05'
          }
        ],
        mensagens: []
      }
    ];

    const mockAlerts: Alert[] = [
      {
        id: '1',
        tipo: 'prazo',
        prioridade: 'alta',
        titulo: 'Prazo de Análise Vencendo',
        descricao: 'Solicitação SF-2024-0001 vence em 2 dias',
        solicitacaoId: '1',
        data: '2024-01-20',
        lida: false,
        acao: 'Analisar Solicitação'
      },
      {
        id: '2',
        tipo: 'valor',
        prioridade: 'media',
        titulo: 'Valor Acima do Limite',
        descricao: 'Solicitação SF-2024-0001 excede limite padrão',
        solicitacaoId: '1',
        data: '2024-01-19',
        lida: false,
        acao: 'Revisar Valores'
      },
      {
        id: '3',
        tipo: 'documento',
        prioridade: 'baixa',
        titulo: 'Documento Pendente',
        descricao: 'Aguardando upload de comprovante adicional',
        solicitacaoId: '2',
        data: '2024-01-18',
        lida: true
      }
    ];

    setSolicitacoes(mockSolicitacoes);
    setFilteredSolicitacoes(mockSolicitacoes);
    setAlerts(mockAlerts);
  }, []);

  // Filtros
  useEffect(() => {
    let filtered = solicitacoes.filter(sol => {
      const matchesSearch = 
        sol.numeroProtocolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sol.solicitante.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sol.solicitante.lotacao.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || sol.status === statusFilter;
      const matchesPrioridade = prioridadeFilter === 'all' || sol.prioridade === prioridadeFilter;
      
      return matchesSearch && matchesStatus && matchesPrioridade;
    });

    setFilteredSolicitacoes(filtered);
  }, [searchTerm, statusFilter, prioridadeFilter, solicitacoes]);

  const getStatusColor = (status: string) => {
    const colors = {
      pendente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      em_analise: 'bg-blue-100 text-blue-800 border-blue-200',
      aprovado: 'bg-green-100 text-green-800 border-green-200',
      rejeitado: 'bg-red-100 text-red-800 border-red-200',
      cancelado: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status as keyof typeof colors] || colors.pendente;
  };

  const getPrioridadeColor = (prioridade: string) => {
    const colors = {
      baixa: 'bg-gray-100 text-gray-800',
      media: 'bg-yellow-100 text-yellow-800',
      alta: 'bg-orange-100 text-orange-800',
      urgente: 'bg-red-100 text-red-800'
    };
    return colors[prioridade as keyof typeof colors] || colors.media;
  };

  const getAlertIcon = (tipo: string) => {
    const icons = {
      prazo: <Clock size={16} />,
      valor: <DollarSign size={16} />,
      documento: <FileText size={16} />,
      sistema: <Settings size={16} />
    };
    return icons[tipo as keyof typeof icons] || <Info size={16} />;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const openModal = (type: typeof modalType, solicitacao?: Solicitacao) => {
    setModalType(type);
    setSelectedSolicitacao(solicitacao || null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSolicitacao(null);
    setModalType('view');
  };

  const handleStatusChange = (solicitacaoId: string, newStatus: string) => {
    setSolicitacoes(prev => prev.map(sol => 
      sol.id === solicitacaoId 
        ? { ...sol, status: newStatus as any, dataAnalise: new Date().toISOString() }
        : sol
    ));
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedSolicitacao) return;

    const message = {
      id: Date.now().toString(),
      remetente: 'Analista SOSFU',
      conteudo: newMessage,
      data: new Date().toLocaleString('pt-BR'),
      lida: false
    };

    setSolicitacoes(prev => prev.map(sol => 
      sol.id === selectedSolicitacao.id 
        ? { ...sol, mensagens: [...sol.mensagens, message] }
        : sol
    ));

    setNewMessage('');
    setShowMessageModal(false);
  };

  const markAlertAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, lida: true } : alert
    ));
  };

  const printDetails = (solicitacao: Solicitacao) => {
    const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1>TRIBUNAL DE JUSTIÇA DO PARÁ</h1>
          <h2>DETALHES DA SOLICITAÇÃO DE SUPRIMENTO</h2>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3>Dados da Solicitação</h3>
          <p><strong>Protocolo:</strong> ${solicitacao.numeroProtocolo}</p>
          <p><strong>Data de Submissão:</strong> ${formatDate(solicitacao.dataSubmissao)}</p>
          <p><strong>Status:</strong> ${solicitacao.status.toUpperCase()}</p>
          <p><strong>Prioridade:</strong> ${solicitacao.prioridade.toUpperCase()}</p>
          <p><strong>Valor Total:</strong> ${formatCurrency(solicitacao.valorTotal)}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h3>Dados do Solicitante</h3>
          <p><strong>Nome:</strong> ${solicitacao.solicitante.nome}</p>
          <p><strong>CPF:</strong> ${solicitacao.solicitante.cpf}</p>
          <p><strong>Email:</strong> ${solicitacao.solicitante.email}</p>
          <p><strong>Lotação:</strong> ${solicitacao.solicitante.lotacao}</p>
          <p><strong>Cargo:</strong> ${solicitacao.solicitante.cargo}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h3>Justificativa</h3>
          <p>${solicitacao.justificativa}</p>
        </div>

        <div style="margin-bottom: 20px;">
          <h3>Elementos de Despesa</h3>
          ${solicitacao.elementos.map(el => `
            <div style="margin-bottom: 10px; padding: 10px; border: 1px solid #ddd;">
              <p><strong>Código:</strong> ${el.codigo}</p>
              <p><strong>Descrição:</strong> ${el.descricao}</p>
              <p><strong>Valor:</strong> ${formatCurrency(el.valor)}</p>
              <p><strong>Justificativa:</strong> ${el.justificativa}</p>
            </div>
          `).join('')}
        </div>

        ${solicitacao.parecerTecnico ? `
          <div style="margin-bottom: 20px;">
            <h3>Parecer Técnico</h3>
            <p>${solicitacao.parecerTecnico}</p>
            <p><strong>Analisado por:</strong> ${solicitacao.analisadoPor}</p>
            <p><strong>Data da Análise:</strong> ${solicitacao.dataAnalise ? formatDate(solicitacao.dataAnalise) : ''}</p>
          </div>
        ` : ''}

        <div style="margin-top: 40px; text-align: center;">
          <p>Documento gerado em ${new Date().toLocaleString('pt-BR')}</p>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const printPortaria = (solicitacao: Solicitacao) => {
    if (!solicitacao.numeroPortaria) {
      alert('Esta solicitação ainda não possui portaria gerada.');
      return;
    }

    const portariaContent = `
      <div style="font-family: Arial, sans-serif; padding: 40px; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1>TRIBUNAL DE JUSTIÇA DO ESTADO DO PARÁ</h1>
          <h2>PORTARIA Nº ${solicitacao.numeroPortaria}</h2>
          <p>Data: ${solicitacao.dataPortaria ? formatDate(solicitacao.dataPortaria) : ''}</p>
        </div>
        
        <div style="text-align: justify; margin-bottom: 30px;">
          <p><strong>O PRESIDENTE DO TRIBUNAL DE JUSTIÇA DO ESTADO DO PARÁ</strong>, no uso de suas atribuições legais,</p>
        </div>

        <div style="margin-bottom: 30px;">
          <p><strong>CONSIDERANDO</strong> a solicitação de suprimento de fundos protocolada sob nº ${solicitacao.numeroProtocolo};</p>
          <p><strong>CONSIDERANDO</strong> a análise técnica favorável do SOSFU;</p>
          <p><strong>CONSIDERANDO</strong> a necessidade de atendimento às demandas administrativas;</p>
        </div>

        <div style="text-align: center; margin-bottom: 30px;">
          <h3>R E S O L V E:</h3>
        </div>

        <div style="margin-bottom: 30px;">
          <p><strong>Art. 1º</strong> - Autorizar o suprimento de fundos no valor de <strong>${formatCurrency(solicitacao.valorTotal)}</strong> ao servidor <strong>${solicitacao.solicitante.nome}</strong>, CPF nº ${solicitacao.solicitante.cpf}, lotado na ${solicitacao.solicitante.lotacao}.</p>
          
          <p><strong>Art. 2º</strong> - O suprimento destina-se a: ${solicitacao.justificativa}</p>
          
          <p><strong>Art. 3º</strong> - O prazo para prestação de contas é de 30 (trinta) dias, contados a partir do recebimento dos recursos.</p>
          
          <p><strong>Art. 4º</strong> - Esta portaria entra em vigor na data de sua publicação.</p>
        </div>

        <div style="margin-top: 60px; text-align: center;">
          <p>_________________________________</p>
          <p><strong>Presidente do TJPA</strong></p>
        </div>

        <div style="margin-top: 40px; text-align: center; font-size: 12px;">
          <p>Documento gerado automaticamente em ${new Date().toLocaleString('pt-BR')}</p>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(portariaContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const stats = {
    total: solicitacoes.length,
    pendentes: solicitacoes.filter(s => s.status === 'pendente').length,
    emAnalise: solicitacoes.filter(s => s.status === 'em_analise').length,
    aprovadas: solicitacoes.filter(s => s.status === 'aprovado').length,
    valorTotal: solicitacoes.reduce((acc, s) => acc + s.valorTotal, 0),
    alertasNaoLidas: alerts.filter(a => !a.lida).length
  };

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <ClipboardList size={24} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Análise de Solicitações</h1>
              <p className="text-gray-600 dark:text-gray-400">Gestão completa de solicitações de suprimento de fundos</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Botão de Alertas */}
            <button
              onClick={() => setShowAlerts(!showAlerts)}
              className="relative flex items-center px-4 py-2 bg-orange-600 dark:bg-orange-700 text-white rounded-lg hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors"
            >
              <Bell size={16} className="mr-2" />
              Alertas
              {stats.alertasNaoLidas > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {stats.alertasNaoLidas}
                </span>
              )}
            </button>

            <button
              onClick={() => openModal('create')}
              className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} className="mr-2" />
              Nova Solicitação
            </button>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
              </div>
              <FileText size={24} className="text-gray-500" />
            </div>
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.pendentes}</p>
              </div>
              <Clock size={24} className="text-yellow-500" />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Em Análise</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.emAnalise}</p>
              </div>
              <Target size={24} className="text-blue-500" />
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">Aprovadas</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.aprovadas}</p>
              </div>
              <CheckCircle size={24} className="text-green-500" />
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
        </div>
      </div>

      {/* Painel de Alertas */}
      {showAlerts && (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
              <Bell size={20} className="mr-2 text-orange-500" />
              Central de Alertas
            </h3>
            <button
              onClick={() => setShowAlerts(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.prioridade === 'alta' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                  alert.prioridade === 'media' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                  'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                } ${!alert.lida ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${
                      alert.prioridade === 'alta' ? 'bg-red-100 dark:bg-red-900' :
                      alert.prioridade === 'media' ? 'bg-yellow-100 dark:bg-yellow-900' :
                      'bg-blue-100 dark:bg-blue-900'
                    }`}>
                      {getAlertIcon(alert.tipo)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">{alert.titulo}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{alert.descricao}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">{formatDate(alert.data)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {alert.acao && (
                      <button
                        onClick={() => {
                          if (alert.solicitacaoId) {
                            const solicitacao = solicitacoes.find(s => s.id === alert.solicitacaoId);
                            if (solicitacao) openModal('view', solicitacao);
                          }
                        }}
                        className="text-xs px-3 py-1 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                      >
                        {alert.acao}
                      </button>
                    )}
                    {!alert.lida && (
                      <button
                        onClick={() => markAlertAsRead(alert.id)}
                        className="text-xs px-3 py-1 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors"
                      >
                        Marcar como Lida
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Buscar por protocolo, nome ou lotação..."
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
              value={prioridadeFilter}
              onChange={(e) => setPrioridadeFilter(e.target.value)}
            >
              <option value="all">Todas as Prioridades</option>
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
              <option value="urgente">Urgente</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setPrioridadeFilter('all');
              }}
              className="flex-1 px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
            >
              <RefreshCw size={16} className="mr-2" />
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* Tabela de Solicitações */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
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
                  Data Limite
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSolicitacoes.map((solicitacao) => (
                <tr key={solicitacao.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Hash size={16} className="text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {solicitacao.numeroProtocolo}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(solicitacao.dataSubmissao)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User size={16} className="text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {solicitacao.solicitante.nome}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {solicitacao.solicitante.lotacao}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(solicitacao.valorTotal)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={solicitacao.status}
                      onChange={(e) => handleStatusChange(solicitacao.id, e.target.value)}
                      className={`text-xs font-semibold px-3 py-1 rounded-full border cursor-pointer ${getStatusColor(solicitacao.status)}`}
                    >
                      <option value="pendente">Pendente</option>
                      <option value="em_analise">Em Análise</option>
                      <option value="aprovado">Aprovado</option>
                      <option value="rejeitado">Rejeitado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPrioridadeColor(solicitacao.prioridade)}`}>
                      {solicitacao.prioridade.charAt(0).toUpperCase() + solicitacao.prioridade.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 dark:text-gray-100">
                      <CalendarIcon size={16} className="text-gray-400 mr-2" />
                      {formatDate(solicitacao.dataLimite)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openModal('view', solicitacao)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded"
                        title="Visualizar"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => openModal('edit', solicitacao)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 p-1 rounded"
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => printDetails(solicitacao)}
                        className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300 p-1 rounded"
                        title="Imprimir Detalhes"
                      >
                        <Printer size={16} />
                      </button>
                      {solicitacao.status === 'aprovado' && (
                        <button
                          onClick={() => printPortaria(solicitacao)}
                          className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300 p-1 rounded"
                          title="Imprimir Portaria"
                        >
                          <FileCheck size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setSelectedSolicitacao(solicitacao);
                          setShowMessageModal(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1 rounded relative"
                        title="Mensagens"
                      >
                        <MessageSquare size={16} />
                        {solicitacao.mensagens.some(m => !m.lida) && (
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-3 h-3"></span>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSolicitacoes.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Nenhuma solicitação encontrada</h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchTerm || statusFilter !== 'all' || prioridadeFilter !== 'all'
                ? 'Tente ajustar os filtros de busca.' 
                : 'Não há solicitações cadastradas no momento.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal de Detalhes/Edição */}
      {showModal && selectedSolicitacao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {modalType === 'view' ? 'Detalhes da Solicitação' : 
                 modalType === 'edit' ? 'Editar Solicitação' : 'Nova Solicitação'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Dados da Solicitação */}
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                    <FileText size={16} className="mr-2" />
                    Dados da Solicitação
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Protocolo:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{selectedSolicitacao.numeroProtocolo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Data de Submissão:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{formatDate(selectedSolicitacao.dataSubmissao)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Data Limite:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{formatDate(selectedSolicitacao.dataLimite)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Valor Total:</span>
                      <span className="font-medium text-green-600">{formatCurrency(selectedSolicitacao.valorTotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedSolicitacao.status)}`}>
                        {selectedSolicitacao.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Prioridade:</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPrioridadeColor(selectedSolicitacao.prioridade)}`}>
                        {selectedSolicitacao.prioridade.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dados do Solicitante */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                    <User size={16} className="mr-2" />
                    Dados do Solicitante
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Nome:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{selectedSolicitacao.solicitante.nome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">CPF:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{selectedSolicitacao.solicitante.cpf}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Email:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{selectedSolicitacao.solicitante.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Telefone:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{selectedSolicitacao.solicitante.telefone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Lotação:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{selectedSolicitacao.solicitante.lotacao}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Cargo:</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{selectedSolicitacao.solicitante.cargo}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Justificativa e Elementos */}
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3">Justificativa</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedSolicitacao.justificativa}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                    <DollarSign size={16} className="mr-2" />
                    Elementos de Despesa
                  </h4>
                  <div className="space-y-3">
                    {selectedSolicitacao.elementos.map((elemento, index) => (
                      <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{elemento.codigo}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{elemento.descricao}</p>
                          </div>
                          <span className="font-medium text-green-600">{formatCurrency(elemento.valor)}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-500">{elemento.justificativa}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documentos */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                    <FileText size={16} className="mr-2" />
                    Documentos Anexados
                  </h4>
                  <div className="space-y-2">
                    {selectedSolicitacao.documentos.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border border-gray-200 dark:border-gray-600 rounded">
                        <div className="flex items-center">
                          <FileText size={16} className="text-gray-400 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{doc.nome}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">{doc.tipo} • {doc.tamanho}</p>
                          </div>
                        </div>
                        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                          <Download size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Parecer Técnico */}
            {selectedSolicitacao.parecerTecnico && (
              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-3 flex items-center">
                  <CheckCircle size={16} className="mr-2 text-blue-600" />
                  Parecer Técnico
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{selectedSolicitacao.parecerTecnico}</p>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-500">
                  <span>Analisado por: {selectedSolicitacao.analisadoPor}</span>
                  <span>Data: {selectedSolicitacao.dataAnalise ? formatDate(selectedSolicitacao.dataAnalise) : ''}</span>
                </div>
              </div>
            )}

            {/* Ações */}
            <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={() => printDetails(selectedSolicitacao)}
                className="flex items-center px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
              >
                <Printer size={16} className="mr-2" />
                Imprimir Detalhes
              </button>
              {selectedSolicitacao.status === 'aprovado' && selectedSolicitacao.numeroPortaria && (
                <button
                  onClick={() => printPortaria(selectedSolicitacao)}
                  className="flex items-center px-4 py-2 bg-orange-600 dark:bg-orange-700 text-white rounded-lg hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors"
                >
                  <FileCheck size={16} className="mr-2" />
                  Imprimir Portaria
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal de Mensagens */}
      {showMessageModal && selectedSolicitacao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                <MessageSquare size={20} className="mr-2" />
                Mensagens - {selectedSolicitacao.numeroProtocolo}
              </h3>
              <button
                onClick={() => setShowMessageModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            {/* Lista de Mensagens */}
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto">
              {selectedSolicitacao.mensagens.length > 0 ? (
                selectedSolicitacao.mensagens.map((mensagem) => (
                  <div
                    key={mensagem.id}
                    className={`p-4 rounded-lg ${
                      mensagem.remetente === 'Analista SOSFU' 
                        ? 'bg-blue-50 dark:bg-blue-900/20 ml-8' 
                        : 'bg-gray-50 dark:bg-gray-700 mr-8'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        {mensagem.remetente}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-500">
                        {mensagem.data}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{mensagem.conteudo}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <MessageSquare size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">Nenhuma mensagem ainda</p>
                </div>
              )}
            </div>

            {/* Nova Mensagem */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
                rows={3}
              />
              <div className="flex justify-end space-x-3 mt-3">
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Fechar
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={16} className="mr-2" />
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestAnalysis;