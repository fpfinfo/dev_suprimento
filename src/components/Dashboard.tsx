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
  UserCheck,
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
  UserCheck,
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
  documentos: DocumentoAnexo[];
  mensagens: Mensagem[];
  notificacoes: Notificacao[];
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
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
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
      gestor: 'Maria Oliveira',
      dadosBancarios: {
        banco: 'Banco do Brasil',
        agencia: '1234-5',
        conta: '12345-6'
      },
      valorTotal: 15000,
      justificativa: 'Aquisição de material de escritório para funcionamento da vara',
      dataLimite: '2024-02-15',
      status: 'pendente',
      prioridade: 'alta',
      criadoEm: '2024-01-15',
      elementos: [
        {
          id: '1',
          codigo: '3.3.90.30.96.01',
          descricao: 'Material de Consumo Geral',
          valor: 8000,
          justificativa: 'Papel, canetas, grampeadores'
        },
        {
          id: '2',
          codigo: '3.3.90.30.96.02',
          descricao: 'Combustível e Lubrificantes',
          valor: 7000,
          justificativa: 'Combustível para veículos oficiais'
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
          conteudo: 'Sua solicitação foi recebida e está em análise.',
          dataEnvio: '2024-01-15 10:30',
          lida: true,
          tipo: 'sistema'
        }
      ],
      notificacoes: [
        {
          id: '1',
          tipo: 'pendencia',
          titulo: 'Documentação Pendente',
          mensagem: 'Favor anexar orçamento atualizado',
          data: '2024-01-16',
          lida: false,
          prioridade: 'alta'
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
    // Outros
    justificativa: '',
    dataLimite: '',
    prioridade: 'media' as const,
    elementos: [] as ElementoDespesa[],
    documentos: [] as File[]
  });

  const [newElemento, setNewElemento] = useState({
    codigo: '',
    descricao: '',
    valor: '',
    justificativa: ''
  });

  const [newMessage, setNewMessage] = useState('');

  // Elementos de despesa disponíveis
  const elementosDisponiveis = [
    { codigo: '3.3.90.30.96.01', descricao: 'Material de Consumo Geral' },
    { codigo: '3.3.90.30.96.02', descricao: 'Combustível e Lubrificantes' },
    { codigo: '3.3.90.33.96', descricao: 'Passagens e Despesas com Locomoção' },
    { codigo: '3.3.90.36.96', descricao: 'Outros Serviços de Terceiros - PF' },
    { codigo: '3.3.90.39.96', descricao: 'Outros Serviços de Terceiros - PJ' }
  ];

  // Bancos disponíveis
  const bancosDisponiveis = [
    'Banco do Brasil',
    'Caixa Econômica Federal',
    'Bradesco',
    'Itaú',
    'Santander',
    'Banpará'
  ];

  // Validação de CPF
  const validateCPF = (cpf: string): boolean => {
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
    
    return digit1 === parseInt(cleanCPF.charAt(9)) && 
           digit2 === parseInt(cleanCPF.charAt(10));
  };

  // Validação de email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'em_analise': return 'bg-blue-100 text-blue-800';
      case 'aprovado': return 'bg-green-100 text-green-800';
      case 'rejeitado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (prioridade: string) => {
    switch (prioridade) {
      case 'baixa': return 'bg-gray-100 text-gray-800';
      case 'media': return 'bg-blue-100 text-blue-800';
      case 'alta': return 'bg-orange-100 text-orange-800';
      case 'urgente': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getNotificationIcon = (tipo: string) => {
    switch (tipo) {
      case 'aprovacao': return <CheckCircle2 size={16} className="text-green-600" />;
      case 'rejeicao': return <XCircle size={16} className="text-red-600" />;
      case 'pendencia': return <AlertTriangle size={16} className="text-yellow-600" />;
      case 'prazo': return <Clock size={16} className="text-orange-600" />;
      default: return <Info size={16} className="text-blue-600" />;
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

  const addElemento = () => {
    if (!newElemento.codigo || !newElemento.valor || !newElemento.justificativa) {
      alert('Preencha todos os campos do elemento de despesa');
      return;
    }

    const elemento: ElementoDespesa = {
      id: Date.now().toString(),
      codigo: newElemento.codigo,
      descricao: elementosDisponiveis.find(e => e.codigo === newElemento.codigo)?.descricao || '',
      valor: parseFloat(newElemento.valor),
      justificativa: newElemento.justificativa
    };

    setFormData(prev => ({
      ...prev,
      elementos: [...prev.elementos, elemento]
    }));

    setNewElemento({
      codigo: '',
      descricao: '',
      valor: '',
      justificativa: ''
    });
  };

  const removeElemento = (id: string) => {
    setFormData(prev => ({
      ...prev,
      elementos: prev.elementos.filter(e => e.id !== id)
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      documentos: [...prev.documentos, ...files]
    }));
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      documentos: prev.documentos.filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
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
      case 4:
        return true; // Documentos são opcionais
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
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
        justificativa: solicitacao.justificativa,
        dataLimite: solicitacao.dataLimite,
        prioridade: solicitacao.prioridade,
        elementos: solicitacao.elementos,
        documentos: []
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
        justificativa: '',
        dataLimite: '',
        prioridade: 'media',
        elementos: [],
        documentos: []
      });
      setIsEditing(false);
    }
    setCurrentStep(1);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSolicitacao(null);
    setIsEditing(false);
    setCurrentStep(1);
  };

  const saveSolicitacao = () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      return;
    }

    const valorTotal = formData.elementos.reduce((sum, el) => sum + el.valor, 0);

    if (isEditing && selectedSolicitacao) {
      setSolicitacoes(prev => prev.map(sol => 
        sol.id === selectedSolicitacao.id 
          ? {
              ...sol,
              ...formData,
              dadosBancarios: {
                banco: formData.banco,
                agencia: formData.agencia,
                conta: formData.conta
              },
              valorTotal
            }
          : sol
      ));
    } else {
      const newSolicitacao: SolicitacaoSuprimento = {
        id: Date.now().toString(),
        numeroProtocolo: `SF-2024-${String(solicitacoes.length + 1).padStart(4, '0')}`,
        ...formData,
        dadosBancarios: {
          banco: formData.banco,
          agencia: formData.agencia,
          conta: formData.conta
        },
        valorTotal,
        status: 'pendente',
        criadoEm: new Date().toISOString().split('T')[0],
        documentos: [],
        mensagens: [],
        notificacoes: []
      };
      setSolicitacoes(prev => [...prev, newSolicitacao]);
    }

    closeModal();
  };

  const deleteSolicitacao = (id: string) => {
    setSolicitacoes(prev => prev.filter(sol => sol.id !== id));
    setShowDeleteConfirm(null);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedSolicitacao) return;

    const message: Mensagem = {
      id: Date.now().toString(),
      remetente: 'Usuário Atual',
      destinatario: selectedSolicitacao.solicitante,
      conteudo: newMessage,
      dataEnvio: new Date().toLocaleString('pt-BR'),
      lida: false,
      tipo: 'usuario'
    };

    setSolicitacoes(prev => prev.map(sol => 
      sol.id === selectedSolicitacao.id 
        ? { ...sol, mensagens: [...sol.mensagens, message] }
        : sol
    ));

    setNewMessage('');
  };

  const markNotificationAsRead = (notificationId: string) => {
    if (!selectedSolicitacao) return;

    setSolicitacoes(prev => prev.map(sol => 
      sol.id === selectedSolicitacao.id 
        ? {
            ...sol,
            notificacoes: sol.notificacoes.map(not => 
              not.id === notificationId ? { ...not, lida: true } : not
            )
          }
        : sol
    ));
  };

  const filteredSolicitacoes = solicitacoes.filter(sol => {
    const matchesSearch = 
      sol.solicitante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sol.numeroProtocolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sol.departamento.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || sol.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || sol.prioridade === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
  };

  // Estatísticas
  const stats = {
    total: solicitacoes.length,
    pendentes: solicitacoes.filter(s => s.status === 'pendente').length,
    aprovadas: solicitacoes.filter(s => s.status === 'aprovado').length,
    valorTotal: solicitacoes.reduce((sum, s) => sum + s.valorTotal, 0),
    notificacoesNaoLidas: solicitacoes.reduce((sum, s) => 
      sum + s.notificacoes.filter(n => !n.lida).length, 0
    )
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados do Suprido</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={formData.solicitante}
                  onChange={(e) => setFormData({...formData, solicitante: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome completo do solicitante"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CPF *
                </label>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => setFormData({...formData, cpf: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formData.cpf && !validateCPF(formData.cpf) ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="000.000.000-00"
                />
                {formData.cpf && !validateCPF(formData.cpf) && (
                  <p className="text-red-500 text-sm mt-1">CPF inválido</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <input
                  type="text"
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(91) 99999-9999"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formData.email && !validateEmail(formData.email) ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="usuario@tjpa.jus.br"
                />
                {formData.email && !validateEmail(formData.email) && (
                  <p className="text-red-500 text-sm mt-1">Email inválido</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departamento/Lotação *
                </label>
                <input
                  type="text"
                  value={formData.departamento}
                  onChange={(e) => setFormData({...formData, departamento: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Vara Criminal, Administrativo, TI"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Município
                </label>
                <input
                  type="text"
                  value={formData.municipio}
                  onChange={(e) => setFormData({...formData, municipio: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Belém, Santarém, Marabá"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gestor/Responsável
                </label>
                <input
                  type="text"
                  value={formData.gestor}
                  onChange={(e) => setFormData({...formData, gestor: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome do gestor responsável"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Bancários</h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <Info size={20} className="text-blue-600 mr-2" />
                <p className="text-blue-800 text-sm">
                  Os dados bancários serão utilizados para transferência dos recursos aprovados.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banco *
                </label>
                <input
                  type="text"
                  value={formData.banco}
                  onChange={(e) => setFormData({...formData, banco: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Banco do Brasil, Caixa Econômica Federal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agência *
                </label>
                <input
                  type="text"
                  value={formData.agencia}
                  onChange={(e) => setFormData({...formData, agencia: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1234-5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conta *
                </label>
                <input
                  type="text"
                  value={formData.conta}
                  onChange={(e) => setFormData({...formData, conta: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="12345-6"
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Elementos de Despesa</h3>
            
            {/* Adicionar Elemento */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="text-md font-medium text-gray-900 mb-3">Adicionar Elemento</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código do Elemento *
                  </label>
                  <select
                    value={newElemento.codigo}
                    onChange={(e) => {
                      const selected = elementosDisponiveis.find(el => el.codigo === e.target.value);
                      setNewElemento({
                        ...newElemento,
                        codigo: e.target.value,
                        descricao: selected?.descricao || ''
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione o elemento</option>
                    {elementosDisponiveis.map(elemento => (
                      <option key={elemento.codigo} value={elemento.codigo}>
                        {elemento.codigo} - {elemento.descricao}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor (R$) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newElemento.valor}
                    onChange={(e) => setNewElemento({...newElemento, valor: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0,00"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Justificativa *
                  </label>
                  <textarea
                    value={newElemento.justificativa}
                    onChange={(e) => setNewElemento({...newElemento, justificativa: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={2}
                    placeholder="Justifique a necessidade deste elemento"
                  />
                </div>
              </div>

              <div className="mt-4">
                <button
                  onClick={addElemento}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} className="mr-2" />
                  Adicionar Elemento
                </button>
              </div>
            </div>

            {/* Lista de Elementos */}
            {formData.elementos.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-md font-medium text-gray-900">Elementos Adicionados</h4>
                {formData.elementos.map((elemento) => (
                  <div key={elemento.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                            {elemento.codigo}
                          </span>
                          <span className="ml-2 text-sm font-medium text-gray-900">
                            {elemento.descricao}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{elemento.justificativa}</p>
                        <p className="text-lg font-semibold text-green-600">
                          {formatCurrency(elemento.valor)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeElemento(elemento.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Remover elemento"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-blue-900">Total Geral:</span>
                    <span className="text-xl font-bold text-blue-900">
                      {formatCurrency(formData.elementos.reduce((sum, el) => sum + el.valor, 0))}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Anexar Documentos</h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">
                Clique para selecionar arquivos ou arraste e solte aqui
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
              >
                <Paperclip size={16} className="mr-2" />
                Selecionar Arquivos
              </label>
              <p className="text-sm text-gray-500 mt-2">
                Formatos aceitos: PDF, DOC, DOCX, JPG, PNG (máx. 10MB cada)
              </p>
            </div>

            {formData.documentos.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-md font-medium text-gray-900">Arquivos Selecionados</h4>
                {formData.documentos.map((file, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center">
                      <FileText size={20} className="text-gray-500 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeDocument(index)}
                      className="text-red-600 hover:text-red-800 p-1"
                      title="Remover arquivo"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle size={20} className="text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800">Documentos Recomendados</h4>
                  <ul className="text-sm text-yellow-700 mt-1 list-disc list-inside">
                    <li>Orçamentos ou cotações</li>
                    <li>Justificativa detalhada</li>
                    <li>Autorização do gestor</li>
                    <li>Especificações técnicas (se aplicável)</li>
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
      {/* Header com Notificações */}
      <div className="flex items-center justify-between bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <DollarSign size={24} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Suprimento de Fundos</h1>
            <p className="text-gray-600">Gerencie solicitações de suprimento com comunicação integrada</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Notificações */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bell size={20} />
              {stats.notificacoesNaoLidas > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {stats.notificacoesNaoLidas}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Notificações</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {solicitacoes.flatMap(sol => 
                    sol.notificacoes.map(not => (
                      <div
                        key={`${sol.id}-${not.id}`}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          !not.lida ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => markNotificationAsRead(not.id)}
                      >
                        <div className="flex items-start space-x-3">
                          {getNotificationIcon(not.tipo)}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{not.titulo}</p>
                            <p className="text-sm text-gray-600">{not.mensagem}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {sol.numeroProtocolo} • {not.data}
                            </p>
                          </div>
                          {!not.lida && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                  {stats.notificacoesNaoLidas === 0 && (
                    <div className="p-4 text-center text-gray-500">
                      <Bell size={32} className="mx-auto mb-2 opacity-50" />
                      <p>Nenhuma notificação</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Mensagens */}
          <button
            onClick={() => setShowMessages(!showMessages)}
            className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MessageSquare size={20} />
          </button>

          <button
            onClick={() => openModal()}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={16} className="mr-2" />
            Nova Solicitação
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Total de Solicitações</p>
              <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pendentes</p>
              <p className="text-2xl font-bold text-orange-600">{stats.pendentes}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock size={24} className="text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Aprovadas</p>
              <p className="text-2xl font-bold text-green-600">{stats.aprovadas}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Valor Total</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.valorTotal)}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calculator size={24} className="text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nome, protocolo ou departamento..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
            >
              <X size={16} className="mr-2" />
              Limpar
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Solicitação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Departamento/Município
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comunicação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredSolicitacoes.map((solicitacao) => (
                <tr key={solicitacao.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{solicitacao.solicitante}</div>
                      <div className="text-sm text-gray-500">{solicitacao.numeroProtocolo}</div>
                      <div className="text-sm text-gray-500">{solicitacao.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">{solicitacao.departamento}</div>
                      <div className="text-sm text-gray-500">{solicitacao.municipio}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(solicitacao.valorTotal)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {solicitacao.elementos.length} elemento(s)
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(solicitacao.status)}`}>
                        {solicitacao.status.replace('_', ' ')}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(solicitacao.prioridade)}`}>
                        {solicitacao.prioridade}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <MessageSquare size={16} className="text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">{solicitacao.mensagens.length}</span>
                      </div>
                      {solicitacao.notificacoes.filter(n => !n.lida).length > 0 && (
                        <div className="flex items-center">
                          <Bell size={16} className="text-orange-500 mr-1" />
                          <span className="text-sm text-orange-600">
                            {solicitacao.notificacoes.filter(n => !n.lida).length}
                          </span>
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma solicitação encontrada</h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Tente ajustar os filtros de busca.' 
                : 'Não há solicitações cadastradas no momento.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal de Formulário Multi-Step */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {isEditing ? 'Editar Solicitação' : 'Nova Solicitação de Suprimento'}
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
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                      currentStep >= step
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    }`}>
                      {currentStep > step ? (
                        <CheckCircle size={20} />
                      ) : (
                        <span>{step}</span>
                      )}
                    </div>
                    {step < 4 && (
                      <div className={`w-16 h-0.5 mx-2 transition-all duration-300 ${
                        currentStep > step ? 'bg-blue-600' : 'bg-gray-300'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2">
                <span className={`text-xs transition-all duration-300 ${
                  currentStep >= 1 ? 'text-blue-600 font-medium' : 'text-gray-500'
                }`}>
                  Dados do Suprido
                </span>
                <span className={`text-xs transition-all duration-300 ${
                  currentStep >= 2 ? 'text-blue-600 font-medium' : 'text-gray-500'
                }`}>
                  Dados Bancários
                </span>
                <span className={`text-xs transition-all duration-300 ${
                  currentStep >= 3 ? 'text-blue-600 font-medium' : 'text-gray-500'
                }`}>
                  Elementos de Despesa
                </span>
                <span className={`text-xs transition-all duration-300 ${
                  currentStep >= 4 ? 'text-blue-600 font-medium' : 'text-gray-500'
                }`}>
                  Anexar Documentos
                </span>
              </div>
            </div>

            {/* Step Content */}
            <div className="mb-8">
              {renderStepContent()}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              {currentStep > 1 ? (
                <button
                  onClick={prevStep}
                  className="flex items-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Anterior
                </button>
              ) : (
                <div />
              )}

              <div className="flex space-x-3">
                <button
                  onClick={closeModal}
                  className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                
                {currentStep < 4 ? (
                  <button
                    onClick={nextStep}
                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Próximo
                  </button>
                ) : (
                  <button
                    onClick={saveSolicitacao}
                    className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Save size={16} className="mr-2" />
                    {isEditing ? 'Atualizar' : 'Criar'} Solicitação
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes */}
      {selectedSolicitacao && !showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Detalhes da Solicitação - {selectedSolicitacao.numeroProtocolo}
              </h3>
              <button
                onClick={() => setSelectedSolicitacao(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Informações Principais */}
              <div className="lg:col-span-2 space-y-6">
                {/* Dados do Solicitante */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Dados do Solicitante</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Nome</p>
                      <p className="text-sm text-gray-900">{selectedSolicitacao.solicitante}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">CPF</p>
                      <p className="text-sm text-gray-900">{selectedSolicitacao.cpf}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Email</p>
                      <p className="text-sm text-gray-900">{selectedSolicitacao.email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Telefone</p>
                      <p className="text-sm text-gray-900">{selectedSolicitacao.telefone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Departamento</p>
                      <p className="text-sm text-gray-900">{selectedSolicitacao.departamento}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Município</p>
                      <p className="text-sm text-gray-900">{selectedSolicitacao.municipio}</p>
                    </div>
                  </div>
                </div>

                {/* Elementos de Despesa */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Elementos de Despesa</h4>
                  <div className="space-y-3">
                    {selectedSolicitacao.elementos.map((elemento) => (
                      <div key={elemento.id} className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                            {elemento.codigo}
                          </span>
                          <span className="text-lg font-semibold text-green-600">
                            {formatCurrency(elemento.valor)}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1">{elemento.descricao}</p>
                        <p className="text-sm text-gray-600">{elemento.justificativa}</p>
                      </div>
                    ))}
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-blue-900">Total Geral:</span>
                        <span className="text-xl font-bold text-blue-900">
                          {formatCurrency(selectedSolicitacao.valorTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Documentos */}
                {selectedSolicitacao.documentos.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Documentos Anexados</h4>
                    <div className="space-y-2">
                      {selectedSolicitacao.documentos.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
                          <div className="flex items-center">
                            <FileText size={20} className="text-gray-500 mr-3" />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{doc.nome}</p>
                              <p className="text-xs text-gray-500">
                                {formatFileSize(doc.tamanho)} • {doc.dataUpload}
                              </p>
                            </div>
                          </div>
                          <button className="text-blue-600 hover:text-blue-800">
                            <Download size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Comunicação */}
              <div className="space-y-6">
                {/* Status e Prioridade */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Status</h4>
                  <div className="space-y-2">
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedSolicitacao.status)}`}>
                      {selectedSolicitacao.status.replace('_', ' ')}
                    </span>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getPriorityColor(selectedSolicitacao.prioridade)}`}>
                      Prioridade: {selectedSolicitacao.prioridade}
                    </span>
                  </div>
                </div>

                {/* Mensagens */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Mensagens</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedSolicitacao.mensagens.map((msg) => (
                      <div key={msg.id} className={`p-3 rounded-lg ${
                        msg.tipo === 'sistema' ? 'bg-blue-50 border border-blue-200' : 'bg-white border border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{msg.remetente}</span>
                          <span className="text-xs text-gray-500">{msg.dataEnvio}</span>
                        </div>
                        <p className="text-sm text-gray-700">{msg.conteudo}</p>
                      </div>
                    ))}
                  </div>
                  
                  {/* Nova Mensagem */}
                  <div className="mt-4 space-y-2">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      rows={3}
                      placeholder="Digite sua mensagem..."
                    />
                    <button
                      onClick={sendMessage}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Send size={16} className="mr-2" />
                      Enviar
                    </button>
                  </div>
                </div>

                {/* Notificações */}
                {selectedSolicitacao.notificacoes.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Notificações</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selectedSolicitacao.notificacoes.map((not) => (
                        <div key={not.id} className={`p-3 rounded-lg border ${
                          !not.lida ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'
                        }`}>
                          <div className="flex items-start space-x-2">
                            {getNotificationIcon(not.tipo)}
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{not.titulo}</p>
                              <p className="text-sm text-gray-600">{not.mensagem}</p>
                              <p className="text-xs text-gray-500 mt-1">{not.data}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setSelectedSolicitacao(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Fechar
              </button>
              <button
                onClick={() => openModal(selectedSolicitacao)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center mb-4">
              <AlertCircle size={24} className="text-red-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Confirmar Exclusão</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja excluir esta solicitação? Esta ação não pode ser desfeita.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
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