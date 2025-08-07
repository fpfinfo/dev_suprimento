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
  Mail,
  MessageSquare,
  Bell,
  Send,
  Paperclip,
  CreditCard,
  Calculator,
  AlertTriangle,
  Info,
  CheckCircle2,
  XCircle,
  History,
  UserCheck
} from 'lucide-react';

interface SolicitacaoSuprimento {
  id: string;
  numeroProtocolo: string;
  solicitante: string;
  cpf: string;
  telefone: string;
  email: string;
  departamento: string;
  municipio: string;
  gestor: string;
  dadosBancarios: {
    banco: string;
    agencia: string;
    conta: string;
  };
  valorTotal: number;
  justificativa: string;
  dataLimite: string;
  status: 'pendente' | 'em_analise' | 'aprovado' | 'rejeitado';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  criadoEm: string;
  elementos: ElementoDespesa[];
  documentos: DocumentoAnexo[];
  mensagens: Mensagem[];
  notificacoes: Notificacao[];
}

interface ElementoDespesa {
  id: string;
  codigo: string;
  descricao: string;
  valor: number;
  justificativa: string;
}

interface DocumentoAnexo {
  id: string;
  nome: string;
  tipo: string;
  tamanho: number;
  dataUpload: string;
}

interface Mensagem {
  id: string;
  remetente: string;
  destinatario: string;
  conteudo: string;
  dataEnvio: string;
  lida: boolean;
  tipo: 'sistema' | 'usuario';
}

interface Notificacao {
  id: string;
  tipo: 'aprovacao' | 'rejeicao' | 'pendencia' | 'prazo';
  titulo: string;
  mensagem: string;
  data: string;
  lida: boolean;
  prioridade: 'alta' | 'media' | 'baixa';
}
const SupplyFundsModule: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSolicitacao, setSelectedSolicitacao] = useState<SolicitacaoSuprimento | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Dados simulados
  const [solicitacoes, setSolicitacoes] = useState<SolicitacaoSuprimento[]>([
    {
      id: '1',
      numeroProtocolo: 'SF-2024-0001',
      solicitante: 'João Silva Santos',
      cpf: '123.456.789-00',
      telefone: '(91) 99999-9999',
      email: 'joao.silva@tjpa.jus.br',
      departamento: 'Vara Criminal',
      municipio: 'Belém',
      gestor: 'Dr. Carlos Mendes',
      dadosBancarios: {
        banco: '001 - Banco do Brasil',
        agencia: '1234-5',
        conta: '12345-6'
      },
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
      ],
      documentos: [
        {
          id: '1',
          nome: 'orcamento_material.pdf',
          tipo: 'application/pdf',
          tamanho: 245760,
          dataUpload: '2024-01-15'
        }
      ],
      mensagens: [
        {
          id: '1',
          remetente: 'Sistema',
          destinatario: 'João Silva Santos',
          conteudo: 'Sua solicitação foi aprovada e está sendo processada.',
          dataEnvio: '2024-01-16 10:30',
          lida: true,
          tipo: 'sistema'
        }
      ],
      notificacoes: [
        {
          id: '1',
          tipo: 'aprovacao',
          titulo: 'Solicitação Aprovada',
          mensagem: 'Sua solicitação SF-2024-0001 foi aprovada.',
          data: '2024-01-16 10:30',
          lida: false,
          prioridade: 'alta'
        }
      ]
    },
    {
      id: '2',
      numeroProtocolo: 'SF-2024-0002',
      solicitante: 'Maria Oliveira Costa',
      cpf: '987.654.321-00',
      telefone: '(91) 88888-8888',
      email: 'maria.costa@tjpa.jus.br',
      departamento: 'Vara Cível',
      municipio: 'Santarém',
      gestor: 'Dra. Ana Paula Silva',
      dadosBancarios: {
        banco: '104 - Caixa Econômica Federal',
        agencia: '5678-9',
        conta: '98765-4'
      },
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
      ],
      documentos: [],
      mensagens: [],
      notificacoes: [
        {
          id: '2',
          tipo: 'pendencia',
          titulo: 'Documentação Pendente',
          mensagem: 'Favor anexar comprovantes de orçamento.',
          data: '2024-01-19 14:20',
          lida: false,
          prioridade: 'media'
        }
      ]
    },
    {
      id: '3',
      numeroProtocolo: 'SF-2024-0003',
      solicitante: 'Carlos Mendes',
      cpf: '456.789.123-00',
      telefone: '(91) 77777-7777',
      email: 'carlos.mendes@tjpa.jus.br',
      departamento: 'Administrativo',
      municipio: 'Marabá',
      gestor: 'Dr. Roberto Lima',
      dadosBancarios: {
        banco: '237 - Bradesco',
        agencia: '9876-5',
        conta: '54321-0'
      },
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
      ],
      documentos: [
        {
          id: '2',
          nome: 'cotacao_equipamentos.xlsx',
          tipo: 'application/vnd.ms-excel',
          tamanho: 156432,
          dataUpload: '2024-01-20'
        }
      ],
      mensagens: [
        {
          id: '2',
          remetente: 'Analista SOSFU',
          destinatario: 'Carlos Mendes',
          conteudo: 'Solicitação em análise. Favor aguardar retorno em até 5 dias úteis.',
          dataEnvio: '2024-01-21 09:15',
          lida: false,
          tipo: 'usuario'
        }
      ],
      notificacoes: [
        {
          id: '3',
          tipo: 'prazo',
          titulo: 'Prazo de Análise',
          mensagem: 'Sua solicitação está em análise há 3 dias.',
          data: '2024-01-23 16:00',
          lida: false,
          prioridade: 'baixa'
        }
      ]
    }
  ]);

  const [formData, setFormData] = useState({
    // Dados do Suprido
    solicitante: '',
    cpf: '',
    telefone: '',
    email: '',
    departamento: '',
    municipio: '',
    gestor: '',
    // Dados Bancários
    banco: '',
    agencia: '',
    conta: '',
    // Dados da Solicitação
    valorTotal: '',
    justificativa: '',
    dataLimite: '',
    prioridade: 'media' as 'baixa' | 'media' | 'alta' | 'urgente',
    elementos: [] as ElementoDespesa[],
    documentos: [] as DocumentoAnexo[]
  });

  const elementosDisponiveis = [
    { codigo: '3.3.90.30.96.01', descricao: 'Material de Consumo Geral' },
    { codigo: '3.3.90.30.96.02', descricao: 'Combustível e Lubrificantes' },
    { codigo: '3.3.90.33.96', descricao: 'Passagens e Despesas com Locomoção' },
    { codigo: '3.3.90.36.96', descricao: 'Outros Serviços de Terceiros - PF' },
    { codigo: '3.3.90.39.96', descricao: 'Outros Serviços de Terceiros - PJ' }
  ];

  const bancos = [
    '001 - Banco do Brasil',
    '104 - Caixa Econômica Federal',
    '237 - Bradesco',
    '341 - Itaú',
    '033 - Santander',
    '756 - Sicoob',
    '748 - Sicredi'
  ];

  const departamentos = [
    'Vara Criminal',
    'Vara Cível',
    'Vara de Família',
    'Vara Trabalhista',
    'Administrativo',
    'TI',
    'Suprimento de Fundos',
    'Recursos Humanos'
  ];

  const municipios = [
    'Belém',
    'Santarém',
    'Marabá',
    'Castanhal',
    'Altamira',
    'Parauapebas',
    'Ananindeua',
    'Marituba'
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

  const getNotificationIcon = (tipo: string) => {
    switch (tipo) {
      case 'aprovacao': return <CheckCircle2 size={16} className="text-green-500" />;
      case 'rejeicao': return <XCircle size={16} className="text-red-500" />;
      case 'pendencia': return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'prazo': return <Clock size={16} className="text-blue-500" />;
      default: return <Info size={16} className="text-gray-500" />;
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

  const validateCPF = (cpf: string) => {
    const cleanCPF = cpf.replace(/[^\d]/g, '');
    if (cleanCPF.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
    
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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const openModal = (solicitacao?: SolicitacaoSuprimento) => {
    if (solicitacao) {
      setSelectedSolicitacao(solicitacao);
      setFormData({
        solicitante: solicitacao.solicitante,
        cpf: solicitacao.cpf,
        telefone: solicitacao.telefone,
        email: solicitacao.email,
        departamento: solicitacao.departamento,
        municipio: solicitacao.municipio,
        gestor: solicitacao.gestor,
        banco: solicitacao.dadosBancarios.banco,
        agencia: solicitacao.dadosBancarios.agencia,
        conta: solicitacao.dadosBancarios.conta,
        valorTotal: solicitacao.valorTotal.toString(),
        justificativa: solicitacao.justificativa,
        dataLimite: solicitacao.dataLimite,
        prioridade: solicitacao.prioridade,
        elementos: solicitacao.elementos,
        documentos: solicitacao.documentos
      });
      setIsEditing(true);
    } else {
      setSelectedSolicitacao(null);
      setFormData({
        solicitante: '',
        cpf: '',
        telefone: '',
        email: '',
        departamento: '',
        municipio: '',
        gestor: '',
        banco: '',
        agencia: '',
        conta: '',
        valorTotal: '',
        justificativa: '',
        dataLimite: '',
        prioridade: 'media',
        elementos: [],
        documentos: []
      });
      setIsEditing(false);
    }
    setShowModal(true);
    setCurrentStep(1);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSolicitacao(null);
    setIsEditing(false);
    setCurrentStep(1);
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.solicitante || !formData.cpf || !formData.email || !formData.departamento) {
          alert('Preencha todos os campos obrigatórios dos dados do suprido');
          return false;
        }
        if (!validateCPF(formData.cpf)) {
          alert('CPF inválido');
          return false;
        }
        if (!validateEmail(formData.email)) {
          alert('Email inválido');
          return false;
        }
        return true;
      case 2:
        if (!formData.banco || !formData.agencia || !formData.conta) {
          alert('Preencha todos os dados bancários');
          return false;
        }
        return true;
      case 3:
        if (formData.elementos.length === 0) {
          alert('Adicione pelo menos um elemento de despesa');
          return false;
        }
        return true;
      default:
        return true;
    }
  };
  const saveSolicitacao = () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (!formData.justificativa || !formData.dataLimite) {
      alert('Preencha a justificativa e data limite');
      return;
    }

    const valorTotal = formData.elementos.reduce((sum, el) => sum + el.valor, 0);

    if (isEditing && selectedSolicitacao) {
      setSolicitacoes(prev => prev.map(sol => 
        sol.id === selectedSolicitacao.id 
          ? {
              ...sol,
              solicitante: formData.solicitante,
              cpf: formData.cpf,
              telefone: formData.telefone,
              email: formData.email,
              departamento: formData.departamento,
              municipio: formData.municipio,
              gestor: formData.gestor,
              dadosBancarios: {
                banco: formData.banco,
                agencia: formData.agencia,
                conta: formData.conta
              },
              valorTotal: valorTotal,
              justificativa: formData.justificativa,
              dataLimite: formData.dataLimite,
              prioridade: formData.prioridade,
              elementos: formData.elementos,
              documentos: formData.documentos
            }
          : sol
      ));
    } else {
      const novaSolicitacao: SolicitacaoSuprimento = {
        id: Date.now().toString(),
        numeroProtocolo: `SF-2024-${String(solicitacoes.length + 1).padStart(4, '0')}`,
        solicitante: formData.solicitante,
        cpf: formData.cpf,
        telefone: formData.telefone,
        email: formData.email,
        departamento: formData.departamento,
        municipio: formData.municipio,
        gestor: formData.gestor,
        dadosBancarios: {
          banco: formData.banco,
          agencia: formData.agencia,
          conta: formData.conta
        },
        valorTotal: valorTotal,
        justificativa: formData.justificativa,
        dataLimite: formData.dataLimite,
        status: 'pendente',
        prioridade: formData.prioridade,
        criadoEm: new Date().toISOString().split('T')[0],
        elementos: formData.elementos,
        documentos: formData.documentos,
        mensagens: [],
        notificacoes: []
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newDocuments: DocumentoAnexo[] = Array.from(files).map(file => ({
        id: Date.now().toString() + Math.random(),
        nome: file.name,
        tipo: file.type,
        tamanho: file.size,
        dataUpload: new Date().toISOString().split('T')[0]
      }));
      
      setFormData(prev => ({
        ...prev,
        documentos: [...prev.documentos, ...newDocuments]
      }));
    }
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documentos: prev.documentos.filter((_, i) => i !== index)
    }));
  };

  const sendMessage = (solicitacaoId: string, conteudo: string) => {
    const novaMensagem: Mensagem = {
      id: Date.now().toString(),
      remetente: 'Usuário Atual',
      destinatario: 'Sistema',
      conteudo,
      dataEnvio: new Date().toLocaleString('pt-BR'),
      lida: false,
      tipo: 'usuario'
    };
    
    setSolicitacoes(prev => prev.map(sol => 
      sol.id === solicitacaoId 
        ? { ...sol, mensagens: [...sol.mensagens, novaMensagem] }
        : sol
    ));
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
    valorTotal: solicitacoes.reduce((sum, s) => sum + s.valorTotal, 0),
    notificacoesNaoLidas: solicitacoes.reduce((sum, s) => sum + s.notificacoes.filter(n => !n.lida).length, 0)
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center mb-4">
              <User size={20} className="text-blue-600 mr-2" />
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">Dados do Suprido</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={formData.solicitante}
                  onChange={(e) => setFormData({...formData, solicitante: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Nome completo do solicitante"
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                    formData.cpf && !validateCPF(formData.cpf) ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="000.000.000-00"
                />
                {formData.cpf && !validateCPF(formData.cpf) && (
                  <p className="text-red-500 text-sm mt-1">CPF inválido</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Telefone
                </label>
                <input
                  type="text"
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="(91) 99999-9999"
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
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                    formData.email && !validateEmail(formData.email) ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="usuario@tjpa.jus.br"
                />
                {formData.email && !validateEmail(formData.email) && (
                  <p className="text-red-500 text-sm mt-1">Email inválido</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Departamento/Lotação *
                </label>
                <select
                  value={formData.departamento}
                  onChange={(e) => setFormData({...formData, departamento: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Selecione o departamento</option>
                  {departamentos.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Município
                </label>
                <select
                  value={formData.municipio}
                  onChange={(e) => setFormData({...formData, municipio: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="">Selecione o município</option>
                  {municipios.map(mun => (
                    <option key={mun} value={mun}>{mun}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Gestor/Responsável
              </label>
              <input
                type="text"
                value={formData.gestor}
                onChange={(e) => setFormData({...formData, gestor: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Nome do gestor responsável"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center mb-4">
              <CreditCard size={20} className="text-green-600 mr-2" />
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">Dados Bancários</h4>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Banco *
              </label>
              <select
                value={formData.banco}
                onChange={(e) => setFormData({...formData, banco: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="">Selecione o banco</option>
                {bancos.map(banco => (
                  <option key={banco} value={banco}>{banco}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Agência *
                </label>
                <input
                  type="text"
                  value={formData.agencia}
                  onChange={(e) => setFormData({...formData, agencia: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="0000-0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Conta *
                </label>
                <input
                  type="text"
                  value={formData.conta}
                  onChange={(e) => setFormData({...formData, conta: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="00000-0"
                />
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center">
                <Info size={16} className="text-blue-600 mr-2" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Os dados bancários serão utilizados para transferência dos recursos aprovados.
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Calculator size={20} className="text-purple-600 mr-2" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">Elementos de Despesa</h4>
              </div>
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

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Justificativa Geral
              </label>
              <textarea
                value={formData.justificativa}
                onChange={(e) => setFormData({...formData, justificativa: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                placeholder="Descreva a justificativa geral para a solicitação"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center mb-4">
              <Paperclip size={20} className="text-orange-600 mr-2" />
              <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">Anexar Documentos</h4>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
              <div className="text-center">
                <Upload size={48} className="mx-auto text-gray-400 mb-4" />
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                    <span>Clique para selecionar arquivos</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      multiple
                      className="sr-only"
                      onChange={handleFileUpload}
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    />
                  </label>
                  <p className="pl-1">ou arraste e solte</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PDF, DOC, XLS, JPG até 10MB cada
                </p>
              </div>
            </div>

            {formData.documentos.length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">Documentos Anexados:</h5>
                {formData.documentos.map((doc, index) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <FileText size={16} className="text-blue-500 mr-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{doc.nome}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(doc.tamanho)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeDocument(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
              <div className="flex items-start">
                <AlertTriangle size={16} className="text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <h5 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Documentos Recomendados:</h5>
                  <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-1 list-disc list-inside">
                    <li>Orçamentos ou cotações</li>
                    <li>Justificativa detalhada</li>
                    <li>Autorização do gestor (se aplicável)</li>
                    <li>Especificações técnicas</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
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
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex items-center px-4 py-2 bg-yellow-600 dark:bg-yellow-700 text-white rounded-lg hover:bg-yellow-700 dark:hover:bg-yellow-600 transition-colors"
          >
            <Bell size={16} className="mr-2" />
            Notificações
            {stats.notificacoesNaoLidas > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {stats.notificacoesNaoLidas}
              </span>
            )}
          </button>
          <button 
            onClick={() => setShowMessages(!showMessages)}
            className="flex items-center px-4 py-2 bg-purple-600 dark:bg-purple-700 text-white rounded-lg hover:bg-purple-700 dark:hover:bg-purple-600 transition-colors"
          >
            <MessageSquare size={16} className="mr-2" />
            Mensagens
          </button>
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

      {/* Notifications Panel */}
      {showNotifications && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Notificações</h3>
            <button
              onClick={() => setShowNotifications(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-3">
            {solicitacoes.flatMap(sol => 
              sol.notificacoes.map(notif => (
                <div key={notif.id} className={`p-3 rounded-lg border-l-4 ${
                  notif.prioridade === 'alta' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                  notif.prioridade === 'media' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                  'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      {getNotificationIcon(notif.tipo)}
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{notif.titulo}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{notif.mensagem}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notif.data}</p>
                      </div>
                    </div>
                    {!notif.lida && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Messages Panel */}
      {showMessages && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Central de Mensagens</h3>
            <button
              onClick={() => setShowMessages(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="space-y-4">
            {solicitacoes.map(sol => (
              <div key={sol.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">{sol.numeroProtocolo}</h4>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(sol.status)}`}>
                    {getStatusLabel(sol.status)}
                  </span>
                </div>
                
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {sol.mensagens.map(msg => (
                    <div key={msg.id} className={`p-2 rounded ${
                      msg.tipo === 'sistema' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-gray-50 dark:bg-gray-700'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{msg.remetente}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{msg.dataEnvio}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{msg.conteudo}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-3 flex">
                  <input
                    type="text"
                    placeholder="Digite sua mensagem..."
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement;
                        if (input.value.trim()) {
                          sendMessage(sol.id, input.value);
                          input.value = '';
                        }
                      }
                    }}
                  />
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors">
                    <Send size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
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
                  Departamento
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
                  Comunicação
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
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{solicitacao.solicitante}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{solicitacao.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900 dark:text-gray-100">{solicitacao.departamento}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{solicitacao.municipio}</div>
                    </div>
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {solicitacao.mensagens.filter(m => !m.lida).length > 0 && (
                        <div className="flex items-center">
                          <MessageSquare size={16} className="text-blue-500" />
                          <span className="ml-1 text-xs text-blue-600">{solicitacao.mensagens.filter(m => !m.lida).length}</span>
                        </div>
                      )}
                      {solicitacao.notificacoes.filter(n => !n.lida).length > 0 && (
                        <div className="flex items-center">
                          <Bell size={16} className="text-yellow-500" />
                          <span className="ml-1 text-xs text-yellow-600">{solicitacao.notificacoes.filter(n => !n.lida).length}</span>
                        </div>
                      )}
                    </div>
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

            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                      currentStep >= step
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                    }`}>
                      {currentStep > step ? (
                        <CheckCircle size={16} />
                      ) : (
                        step
                      )}
                    </div>
                    {step < 4 && (
                      <div className={`w-16 h-0.5 mx-2 transition-all duration-300 ${
                        currentStep > step ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                <span className={`text-xs transition-all duration-300 ${
                  currentStep >= 1 ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  Dados do Suprido
                </span>
                <span className={`text-xs transition-all duration-300 ${
                  currentStep >= 2 ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  Dados Bancários
                </span>
                <span className={`text-xs transition-all duration-300 ${
                  currentStep >= 3 ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  Elementos de Despesa
                </span>
                <span className={`text-xs transition-all duration-300 ${
                  currentStep >= 4 ? 'text-blue-600 dark:text-blue-400 font-medium' : 'text-gray-500 dark:text-gray-400'
                }`}>
                  Documentos
                </span>
              </div>
            </div>
            {/* Step Content */}
            <div className="mb-8">
              {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              {currentStep > 1 ? (
                <button
                  onClick={prevStep}
                  className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Anterior
                </button>
              ) : (
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
              )}

              {currentStep < 4 ? (
                <button
                  onClick={nextStep}
                  className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                >
                  Próximo
                  <ArrowRight size={16} className="ml-2" />
                </button>
              ) : (
                <button
                  onClick={saveSolicitacao}
                  className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors flex items-center"
                >
                  <Save size={16} className="mr-2" />
                  {isEditing ? 'Atualizar' : 'Finalizar'} Solicitação
                </button>
              )}
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
                <p className="text-sm text-gray-500 dark:text-gray-400">{selectedSolicitacao.email}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">CPF</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{selectedSolicitacao.cpf}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Telefone</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{selectedSolicitacao.telefone}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Departamento</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{selectedSolicitacao.departamento}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Município</p>
                  <p className="text-sm text-gray-900 dark:text-gray-100">{selectedSolicitacao.municipio}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Dados Bancários</p>
                <div className="text-sm text-gray-900 dark:text-gray-100 space-y-1">
                  <p>Banco: {selectedSolicitacao.dadosBancarios.banco}</p>
                  <p>Agência: {selectedSolicitacao.dadosBancarios.agencia}</p>
                  <p>Conta: {selectedSolicitacao.dadosBancarios.conta}</p>
                </div>
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

              {selectedSolicitacao.documentos.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Documentos Anexados</p>
                  <div className="space-y-2">
                    {selectedSolicitacao.documentos.map(doc => (
                      <div key={doc.id} className="flex items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                        <FileText size={16} className="text-blue-500 mr-2" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 dark:text-gray-100">{doc.nome}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(doc.tamanho)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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