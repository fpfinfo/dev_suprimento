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
  ChevronRight,
  ChevronLeft,
  Banknote,
  Shield,
  ArrowRight
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
  dadosCompletos?: {
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
    documentos: any[];
  };
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

interface FormularioSolicitacao {
  // Dados do Suprido
  nomeCompleto: string;
  cpf: string;
  telefone: string;
  email: string;
  departamento: string;
  municipio: string;
  gestor: string;
  
  // Dados Bancários
  banco: string;
  agencia: string;
  conta: string;
  
  // Elementos de Despesa
  elementos: ElementoDespesa[];
  
  // Outros dados
  justificativa: string;
  dataLimite: string;
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  documentos: File[];
}

interface SupplyFundsModuleProps {
  onNavigateToAnalysis?: (solicitacao: SolicitacaoSuprimento) => void;
}

const SupplyFundsModule: React.FC<SupplyFundsModuleProps> = ({ onNavigateToAnalysis }) => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedSolicitacao, setSubmittedSolicitacao] = useState<SolicitacaoSuprimento | null>(null);

  // Estados do formulário multi-step
  const [formData, setFormData] = useState({
    // STEP 1 - Dados do Suprido
    nomeCompleto: '',
    cpf: '',
    telefone: '',
    email: '',
    departamento: '',
    municipio: '',
    gestor: '',
    
    // STEP 2 - Dados Bancários
    banco: '',
    agencia: '',
    conta: '',
    
    // STEP 3 - Elementos de Despesa
    elementos: [] as ElementoDespesa[],
    
    // STEP 4 - Documentos
    documentos: [] as File[],
    
    // Outros
    justificativa: '',
    dataLimite: '',
    prioridade: 'media' as 'baixa' | 'media' | 'alta' | 'urgente'
  });

  // Estado do formulário
  const [formulario, setFormulario] = useState<FormularioSolicitacao>({
    nomeCompleto: '',
    cpf: '',
    telefone: '',
    email: '',
    departamento: '',
    municipio: '',
    gestor: '',
    banco: '',
    agencia: '',
    conta: '',
    elementos: [],
    justificativa: '',
    dataLimite: '',
    prioridade: 'media',
    documentos: []
  });

  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [newElemento, setNewElemento] = useState({
    codigo: '',
    valor: '',
    justificativa: ''
  });

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
          data: '2024-01-20',
          lida: false,
          prioridade: 'alta'
        }
      ],
      dadosCompletos: {
        cpf: '123.456.789-00',
        telefone: '(91) 99999-9999',
        email: 'joao.silva@tjpa.jus.br',
        departamento: 'Vara Criminal',
        municipio: 'Belém',
        gestor: 'Maria Santos',
        dadosBancarios: {
          banco: 'Banco do Brasil',
          agencia: '1234-5',
          conta: '12345-6'
        },
        documentos: []
      }
    }
  ]);

  const [notificacoes] = useState<Notificacao[]>([
    {
      id: '1',
      tipo: 'aprovacao',
      titulo: 'Solicitação Aprovada',
      mensagem: 'Sua solicitação SF-2024-0001 foi aprovada',
      data: '2024-01-20 14:30',
      lida: false,
      prioridade: 'alta'
    },
    {
      id: '2',
      tipo: 'pendencia',
      titulo: 'Documentação Pendente',
      mensagem: 'Favor anexar comprovante de orçamento',
      data: '2024-01-19 09:15',
      lida: false,
      prioridade: 'media'
    },
    {
      id: '3',
      tipo: 'prazo',
      titulo: 'Prazo de Utilização',
      mensagem: 'Prazo para utilização expira em 5 dias',
      data: '2024-01-18 16:45',
      lida: true,
      prioridade: 'alta'
    }
  ]);

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

  // Função para validar CPF
  const validarCPF = (cpf: string): boolean => {
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

  // Função para validar formulário
  const validarFormulario = (): string[] => {
    const erros: string[] = [];
    
    if (!formulario.nomeCompleto) erros.push('Nome completo é obrigatório');
    if (!formulario.cpf) erros.push('CPF é obrigatório');
    else if (!validarCPF(formulario.cpf)) erros.push('CPF inválido');
    if (!formulario.email) erros.push('Email é obrigatório');
    if (!formulario.telefone) erros.push('Telefone é obrigatório');
    if (!formulario.departamento) erros.push('Departamento é obrigatório');
    if (!formulario.municipio) erros.push('Município é obrigatório');
    if (!formulario.banco) erros.push('Banco é obrigatório');
    if (!formulario.agencia) erros.push('Agência é obrigatória');
    if (!formulario.conta) erros.push('Conta é obrigatória');
    if (!formulario.justificativa) erros.push('Justificativa é obrigatória');
    if (!formulario.dataLimite) erros.push('Data limite é obrigatória');
    if (formulario.elementos.length === 0) erros.push('Pelo menos um elemento de despesa é obrigatório');
    
    return erros;
  };

  // Função para enviar formulário para análise
  const enviarFormularioParaAnalise = async () => {
    const erros = validarFormulario();
    
    if (erros.length > 0) {
      alert('Corrija os seguintes erros:\n' + erros.join('\n'));
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simular envio (em produção, seria uma chamada à API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Gerar número de protocolo
      const numeroProtocolo = `SF-${new Date().getFullYear()}-${String(solicitacoes.length + 1).padStart(4, '0')}`;
      
      // Criar nova solicitação
      const novaSolicitacao: SolicitacaoSuprimento = {
        id: Date.now().toString(),
        numeroProtocolo,
        solicitante: formulario.nomeCompleto,
        cpf: formulario.cpf,
        telefone: formulario.telefone,
        email: formulario.email,
        departamento: formulario.departamento,
        municipio: formulario.municipio,
        gestor: formulario.gestor,
        dadosBancarios: {
          banco: formulario.banco,
          agencia: formulario.agencia,
          conta: formulario.conta
        },
        valorTotal: formulario.elementos.reduce((total, el) => total + el.valor, 0),
        justificativa: formulario.justificativa,
        dataLimite: formulario.dataLimite,
        status: 'pendente',
        prioridade: formulario.prioridade,
        criadoEm: new Date().toISOString().split('T')[0],
        elementos: formulario.elementos,
        documentos: [],
        mensagens: [],
        notificacoes: [],
        dadosCompletos: {
          cpf: formulario.cpf,
          telefone: formulario.telefone,
          email: formulario.email,
          departamento: formulario.departamento,
          municipio: formulario.municipio,
          gestor: formulario.gestor,
          dadosBancarios: {
            banco: formulario.banco,
            agencia: formulario.agencia,
            conta: formulario.conta
          },
          documentos: formulario.documentos
        }
      };
      
      // Adicionar à lista de solicitações
      setSolicitacoes(prev => [novaSolicitacao, ...prev]);
      
      // Definir solicitação submetida para exibição
      setSubmittedSolicitacao(novaSolicitacao);
      
      // Fechar modal do formulário e abrir modal de sucesso
      setShowModal(false);
      setShowSuccessModal(true);
      
      // Limpar formulário
      setFormulario({
        nomeCompleto: '',
        cpf: '',
        telefone: '',
        email: '',
        departamento: '',
        municipio: '',
        gestor: '',
        banco: '',
        agencia: '',
        conta: '',
        elementos: [],
        justificativa: '',
        dataLimite: '',
        prioridade: 'media',
        documentos: []
      });
      
      // Log da operação
      console.log('Solicitação enviada com sucesso:', {
        protocolo: numeroProtocolo,
        solicitante: formulario.nomeCompleto,
        valor: formulario.elementos.reduce((total, el) => total + el.valor, 0),
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      alert('Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Função para navegar para análise
  const navegarParaAnalise = (solicitacao: SolicitacaoSuprimento) => {
    if (onNavigateToAnalysis) {
      onNavigateToAnalysis(solicitacao);
    } else {
      // Fallback: mostrar informações da solicitação
      alert(`Solicitação ${solicitacao.numeroProtocolo} enviada para análise!`);
    }
  };

  // Função para adicionar elemento de despesa
  const adicionarElemento = () => {
    const novoElemento: ElementoDespesa = {
      id: Date.now().toString(),
      codigo: '',
      descricao: '',
      valor: 0,
      justificativa: ''
    };
    setFormulario(prev => ({
      ...prev,
      elementos: [...prev.elementos, novoElemento]
    }));
  };

  // Função para remover elemento de despesa
  const removerElemento = (id: string) => {
    setFormulario(prev => ({
      ...prev,
      elementos: prev.elementos.filter(el => el.id !== id)
    }));
  };

  // Função para atualizar elemento de despesa
  const atualizarElemento = (id: string, campo: string, valor: any) => {
    setFormulario(prev => ({
      ...prev,
      elementos: prev.elementos.map(el => 
        el.id === id ? { ...el, [campo]: valor } : el
      )
    }));
  };

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
    
    return digit1 === parseInt(cleanCPF.charAt(9)) && digit2 === parseInt(cleanCPF.charAt(10));
  };

  // Validação de email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validação do step atual
  const validateCurrentStep = (): boolean => {
    const errors: {[key: string]: string} = {};
    
    if (currentStep === 1) {
      if (!formData.nomeCompleto) errors.nomeCompleto = 'Nome completo é obrigatório';
      if (!formData.cpf) errors.cpf = 'CPF é obrigatório';
      else if (!validateCPF(formData.cpf)) errors.cpf = 'CPF inválido';
      if (!formData.email) errors.email = 'Email é obrigatório';
      else if (!validateEmail(formData.email)) errors.email = 'Email inválido';
      if (!formData.telefone) errors.telefone = 'Telefone é obrigatório';
      if (!formData.departamento) errors.departamento = 'Departamento é obrigatório';
      if (!formData.municipio) errors.municipio = 'Município é obrigatório';
    }
    
    if (currentStep === 2) {
      if (!formData.banco) errors.banco = 'Banco é obrigatório';
      if (!formData.agencia) errors.agencia = 'Agência é obrigatória';
      if (!formData.conta) errors.conta = 'Conta é obrigatória';
    }
    
    if (currentStep === 3) {
      if (formData.elementos.length === 0) errors.elementos = 'Adicione pelo menos um elemento de despesa';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const addElemento = () => {
    if (!newElemento.codigo || !newElemento.valor || !newElemento.justificativa) {
      alert('Preencha todos os campos do elemento');
      return;
    }

    const elemento = elementosDisponiveis.find(e => e.codigo === newElemento.codigo);
    if (!elemento) return;

    const novoElemento: ElementoDespesa = {
      id: Date.now().toString(),
      codigo: newElemento.codigo,
      descricao: elemento.descricao,
      valor: parseFloat(newElemento.valor),
      justificativa: newElemento.justificativa
    };

    setFormData(prev => ({
      ...prev,
      elementos: [...prev.elementos, novoElemento]
    }));

    setNewElemento({ codigo: '', valor: '', justificativa: '' });
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovado': return 'bg-green-100 text-green-800';
      case 'rejeitado': return 'bg-red-100 text-red-800';
      case 'em_analise': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgente': return 'bg-red-100 text-red-800';
      case 'alta': return 'bg-orange-100 text-orange-800';
      case 'media': return 'bg-blue-100 text-blue-800';
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

  const filteredSolicitacoes = solicitacoes.filter(solicitacao => {
    const matchesSearch = 
      solicitacao.solicitante.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitacao.numeroProtocolo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solicitacao.departamento.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || solicitacao.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || solicitacao.prioridade === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
  };

  const openModal = (solicitacao?: SolicitacaoSuprimento) => {
    if (solicitacao) {
      setSelectedSolicitacao(solicitacao);
      setIsEditing(true);
      setFormData({
        nomeCompleto: solicitacao.solicitante,
        cpf: solicitacao.cpf,
        telefone: solicitacao.telefone,
        email: solicitacao.email,
        departamento: solicitacao.departamento,
        municipio: solicitacao.municipio,
        gestor: solicitacao.gestor,
        banco: solicitacao.dadosBancarios.banco,
        agencia: solicitacao.dadosBancarios.agencia,
        conta: solicitacao.dadosBancarios.conta,
        elementos: solicitacao.elementos,
        documentos: [],
        justificativa: solicitacao.justificativa,
        dataLimite: solicitacao.dataLimite,
        prioridade: solicitacao.prioridade
      });
    } else {
      setSelectedSolicitacao(null);
      setIsEditing(false);
      setFormData({
        nomeCompleto: '',
        cpf: '',
        telefone: '',
        email: '',
        departamento: '',
        municipio: '',
        gestor: '',
        banco: '',
        agencia: '',
        conta: '',
        elementos: [],
        documentos: [],
        justificativa: '',
        dataLimite: '',
        prioridade: 'media'
      });
    }
    setCurrentStep(1);
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSolicitacao(null);
    setCurrentStep(1);
    setFormErrors({});
  };

  const saveSolicitacao = () => {
    if (!validateCurrentStep()) return;

    const valorTotal = formData.elementos.reduce((sum, el) => sum + el.valor, 0);
    
    if (isEditing && selectedSolicitacao) {
      setSolicitacoes(prev => prev.map(sol => 
        sol.id === selectedSolicitacao.id 
          ? {
              ...sol,
              solicitante: formData.nomeCompleto,
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
              elementos: formData.elementos,
              valorTotal,
              justificativa: formData.justificativa,
              dataLimite: formData.dataLimite,
              prioridade: formData.prioridade
            }
          : sol
      ));
    } else {
      const novaSolicitacao: SolicitacaoSuprimento = {
        id: Date.now().toString(),
        numeroProtocolo: `SF-2024-${String(solicitacoes.length + 1).padStart(4, '0')}`,
        solicitante: formData.nomeCompleto,
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
        elementos: formData.elementos,
        valorTotal,
        justificativa: formData.justificativa,
        dataLimite: formData.dataLimite,
        status: 'pendente',
        prioridade: formData.prioridade,
        criadoEm: new Date().toISOString().split('T')[0],
        documentos: [],
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User size={20} className="mr-2 text-blue-600" />
              Dados do Suprido
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={formData.nomeCompleto}
                  onChange={(e) => setFormData({...formData, nomeCompleto: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.nomeCompleto ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nome completo do solicitante"
                />
                {formErrors.nomeCompleto && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.nomeCompleto}</p>
                )}
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
                    formErrors.cpf ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="000.000.000-00"
                  maxLength={14}
                />
                {formErrors.cpf && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.cpf}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone *
                </label>
                <input
                  type="text"
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.telefone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="(91) 99999-9999"
                />
                {formErrors.telefone && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.telefone}</p>
                )}
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
                    formErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="usuario@tjpa.jus.br"
                />
                {formErrors.email && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Departamento/Lotação *
                </label>
                <select
                  value={formData.departamento}
                  onChange={(e) => setFormData({...formData, departamento: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.departamento ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione o departamento</option>
                  <option value="Vara Criminal">Vara Criminal</option>
                  <option value="Vara Cível">Vara Cível</option>
                  <option value="Vara de Família">Vara de Família</option>
                  <option value="Vara Trabalhista">Vara Trabalhista</option>
                  <option value="Administrativo">Administrativo</option>
                  <option value="TI">Tecnologia da Informação</option>
                </select>
                {formErrors.departamento && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.departamento}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Município *
                </label>
                <select
                  value={formData.municipio}
                  onChange={(e) => setFormData({...formData, municipio: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.municipio ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione o município</option>
                  <option value="Belém">Belém</option>
                  <option value="Santarém">Santarém</option>
                  <option value="Marabá">Marabá</option>
                  <option value="Castanhal">Castanhal</option>
                  <option value="Altamira">Altamira</option>
                  <option value="Parauapebas">Parauapebas</option>
                </select>
                {formErrors.municipio && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.municipio}</p>
                )}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <CreditCard size={20} className="mr-2 text-blue-600" />
              Dados Bancários
            </h3>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center">
                <Shield size={16} className="text-blue-600 mr-2" />
                <p className="text-sm text-blue-800">
                  <strong>Segurança:</strong> Seus dados bancários são protegidos e utilizados apenas para transferências oficiais.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banco *
                </label>
                <select
                  value={formData.banco}
                  onChange={(e) => setFormData({...formData, banco: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.banco ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione o banco</option>
                  {bancosDisponiveis.map(banco => (
                    <option key={banco} value={banco}>{banco}</option>
                  ))}
                </select>
                {formErrors.banco && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.banco}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agência *
                </label>
                <input
                  type="text"
                  value={formData.agencia}
                  onChange={(e) => setFormData({...formData, agencia: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.agencia ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="1234-5"
                />
                {formErrors.agencia && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.agencia}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conta *
                </label>
                <input
                  type="text"
                  value={formData.conta}
                  onChange={(e) => setFormData({...formData, conta: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    formErrors.conta ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="12345-6"
                />
                {formErrors.conta && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.conta}</p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Informações Importantes:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• A conta deve estar em nome do solicitante</li>
                <li>• Verifique os dados antes de prosseguir</li>
                <li>• Em caso de erro, entre em contato com o suporte</li>
              </ul>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calculator size={20} className="mr-2 text-blue-600" />
              Elementos de Despesa
            </h3>

            {/* Adicionar Elemento */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Adicionar Elemento</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código do Elemento
                  </label>
                  <select
                    value={newElemento.codigo}
                    onChange={(e) => setNewElemento({...newElemento, codigo: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione o código</option>
                    {elementosDisponiveis.map(elemento => (
                      <option key={elemento.codigo} value={elemento.codigo}>
                        {elemento.codigo} - {elemento.descricao}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor (R$)
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Justificativa
                  </label>
                  <input
                    type="text"
                    value={newElemento.justificativa}
                    onChange={(e) => setNewElemento({...newElemento, justificativa: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Justificativa do elemento"
                  />
                </div>
              </div>

              <button
                onClick={addElemento}
                className="mt-3 flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={16} className="mr-2" />
                Adicionar Elemento
              </button>
            </div>

            {/* Lista de Elementos */}
            {formData.elementos.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Elementos Adicionados</h4>
                <div className="space-y-3">
                  {formData.elementos.map((elemento) => (
                    <div key={elemento.id} className="bg-white border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4">
                            <div>
                              <p className="font-medium text-gray-900">{elemento.codigo}</p>
                              <p className="text-sm text-gray-600">{elemento.descricao}</p>
                            </div>
                            <div>
                              <p className="font-bold text-green-600">{formatCurrency(elemento.valor)}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">{elemento.justificativa}</p>
                        </div>
                        <button
                          onClick={() => removeElemento(elemento.id)}
                          className="text-red-600 hover:text-red-800 p-2"
                          title="Remover elemento"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-green-800">Valor Total:</span>
                    <span className="text-xl font-bold text-green-600">
                      {formatCurrency(formData.elementos.reduce((sum, el) => sum + el.valor, 0))}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {formErrors.elementos && (
              <p className="text-red-500 text-sm">{formErrors.elementos}</p>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Paperclip size={20} className="mr-2 text-blue-600" />
              Anexar Documentos
            </h3>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-2">Clique para selecionar arquivos ou arraste aqui</p>
              <p className="text-sm text-gray-500 mb-4">PDF, DOC, DOCX, XLS, XLSX (máx. 10MB cada)</p>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
              >
                <Upload size={16} className="mr-2" />
                Selecionar Arquivos
              </label>
            </div>

            {formData.documentos.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Arquivos Selecionados</h4>
                <div className="space-y-2">
                  {formData.documentos.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <FileText size={16} className="text-gray-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
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
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Justificativa Geral
                </label>
                <textarea
                  value={formData.justificativa}
                  onChange={(e) => setFormData({...formData, justificativa: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descreva a justificativa geral para esta solicitação..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Limite para Utilização
                  </label>
                  <input
                    type="date"
                    value={formData.dataLimite}
                    onChange={(e) => setFormData({...formData, dataLimite: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridade
                  </label>
                  <select
                    value={formData.prioridade}
                    onChange={(e) => setFormData({...formData, prioridade: e.target.value as any})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start">
                <AlertTriangle size={16} className="text-yellow-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Documentos Recomendados:</h4>
                  <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                    <li>• Orçamentos detalhados</li>
                    <li>• Justificativa técnica</li>
                    <li>• Autorização do gestor</li>
                    <li>• Especificações técnicas (se aplicável)</li>
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

  const steps = [
    { number: 1, title: 'Dados do Suprido', icon: <User size={16} /> },
    { number: 2, title: 'Dados Bancários', icon: <CreditCard size={16} /> },
    { number: 3, title: 'Elementos de Despesa', icon: <Calculator size={16} /> },
    { number: 4, title: 'Documentos', icon: <Paperclip size={16} /> }
  ];

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
            <p className="text-gray-600">Gerencie suas solicitações de suprimento com comunicação integrada</p>
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
              {notificacoes.filter(n => !n.lida).length > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notificacoes.filter(n => !n.lida).length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-900">Notificações</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notificacoes.length > 0 ? (
                    notificacoes.map((notif) => (
                      <div key={notif.id} className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${!notif.lida ? 'bg-blue-50' : ''}`}>
                        <div className="flex items-start space-x-3">
                          {getNotificationIcon(notif.tipo)}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{notif.titulo}</p>
                            <p className="text-sm text-gray-600">{notif.mensagem}</p>
                            <p className="text-xs text-gray-500 mt-1">{notif.data}</p>
                          </div>
                          {!notif.lida && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <Bell size={24} className="mx-auto mb-2 opacity-50" />
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
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <MessageSquare size={16} className="mr-2" />
            Mensagens
          </button>

          <button
            onClick={() => setShowModal(true)}
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
              <p className="text-2xl font-bold text-blue-600">{solicitacoes.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Valor Total</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(solicitacoes.reduce((sum, s) => sum + s.valorTotal, 0))}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Pendentes</p>
              <p className="text-2xl font-bold text-orange-600">
                {solicitacoes.filter(s => s.status === 'pendente').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock size={24} className="text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Notificações</p>
              <p className="text-2xl font-bold text-red-600">
                {notificacoes.filter(n => !n.lida).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Bell size={24} className="text-red-600" />
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
                  Solicitante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Departamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Comunicação
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prioridade
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
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <MessageSquare size={16} className="text-blue-500 mr-1" />
                        <span className="text-sm text-gray-600">{solicitacao.mensagens.length}</span>
                      </div>
                      <div className="flex items-center">
                        <Bell size={16} className="text-orange-500 mr-1" />
                        <span className="text-sm text-gray-600">
                          {solicitacao.notificacoes.filter(n => !n.lida).length}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    {formatCurrency(solicitacao.valorTotal)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(solicitacao.status)}`}>
                      {solicitacao.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(solicitacao.prioridade)}`}>
                      {solicitacao.prioridade}
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
                    {solicitacao.status === 'pendente' && (
                      <button
                        onClick={() => navegarParaAnalise(solicitacao)}
                        className="text-purple-600 hover:text-purple-900"
                        title="Enviar para Análise"
                      >
                        <Send size={16} />
                      </button>
                    )}
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
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
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
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                        currentStep >= step.number
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}>
                        {currentStep > step.number ? (
                          <CheckCircle size={20} />
                        ) : (
                          step.icon
                        )}
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-16 h-0.5 mx-2 transition-all duration-300 ${
                          currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  {steps.map((step) => (
                    <span key={step.number} className={`text-xs transition-all duration-300 ${
                      currentStep >= step.number
                        ? 'text-blue-600 font-medium'
                        : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6">
              {renderStepContent()}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-between">
              <div>
                {currentStep > 1 && (
                  <button
                    onClick={prevStep}
                    className="flex items-center px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <ChevronLeft size={16} className="mr-2" />
                    Anterior
                  </button>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                
                {currentStep < 4 ? (
                  <button
                    onClick={nextStep}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Próximo
                    <ChevronRight size={16} className="ml-2" />
                  </button>
                ) : (
                  <button
                    onClick={saveSolicitacao}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
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

      {/* Modal de Sucesso */}
      {showSuccessModal && submittedSolicitacao && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-green-600" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Solicitação Enviada com Sucesso!
              </h3>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Protocolo:</strong> {submittedSolicitacao.numeroProtocolo}</p>
                  <p><strong>Solicitante:</strong> {submittedSolicitacao.solicitante}</p>
                  <p><strong>Valor Total:</strong> {formatCurrency(submittedSolicitacao.valorTotal)}</p>
                  <p><strong>Status:</strong> <span className="text-yellow-600 font-medium">Pendente de Análise</span></p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-6">
                Sua solicitação foi enviada para análise do SOSFU. Você receberá notificações sobre o andamento do processo.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false);
                    navegarParaAnalise(submittedSolicitacao);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <ArrowRight size={16} className="mr-2" />
                  Ver Análise
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Detalhes */}
      {selectedSolicitacao && !showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
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
            </div>

            <div className="p-6 space-y-6">
              {/* Dados do Solicitante */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <User size={20} className="mr-2 text-blue-600" />
                  Dados do Solicitante
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Nome:</p>
                    <p className="text-sm text-gray-900">{selectedSolicitacao.solicitante}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">CPF:</p>
                    <p className="text-sm text-gray-900">{selectedSolicitacao.cpf}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email:</p>
                    <p className="text-sm text-gray-900">{selectedSolicitacao.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Telefone:</p>
                    <p className="text-sm text-gray-900">{selectedSolicitacao.telefone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Departamento:</p>
                    <p className="text-sm text-gray-900">{selectedSolicitacao.departamento}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Município:</p>
                    <p className="text-sm text-gray-900">{selectedSolicitacao.municipio}</p>
                  </div>
                </div>
              </div>

              {/* Dados Bancários */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <CreditCard size={20} className="mr-2 text-blue-600" />
                  Dados Bancários
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Banco:</p>
                    <p className="text-sm text-gray-900">{selectedSolicitacao.dadosBancarios.banco}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Agência:</p>
                    <p className="text-sm text-gray-900">{selectedSolicitacao.dadosBancarios.agencia}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Conta:</p>
                    <p className="text-sm text-gray-900">{selectedSolicitacao.dadosBancarios.conta}</p>
                  </div>
                </div>
              </div>

              {/* Elementos de Despesa */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Calculator size={20} className="mr-2 text-blue-600" />
                  Elementos de Despesa
                </h4>
                <div className="space-y-3">
                  {selectedSolicitacao.elementos.map((elemento) => (
                    <div key={elemento.id} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900">{elemento.codigo}</p>
                          <p className="text-sm text-gray-600">{elemento.descricao}</p>
                        </div>
                        <p className="text-lg font-bold text-green-600">{formatCurrency(elemento.valor)}</p>
                      </div>
                      <p className="text-sm text-gray-600">{elemento.justificativa}</p>
                    </div>
                  ))}
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-green-800">Valor Total:</span>
                      <span className="text-xl font-bold text-green-600">
                        {formatCurrency(selectedSolicitacao.valorTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status e Informações */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Status</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status Atual:</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedSolicitacao.status)}`}>
                        {selectedSolicitacao.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Prioridade:</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedSolicitacao.prioridade)}`}>
                        {selectedSolicitacao.prioridade}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Data Limite:</span>
                      <span className="text-sm text-gray-900">{selectedSolicitacao.dataLimite}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Comunicação</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Mensagens:</span>
                      <span className="text-sm font-medium text-blue-600">
                        {selectedSolicitacao.mensagens.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Notificações:</span>
                      <span className="text-sm font-medium text-orange-600">
                        {selectedSolicitacao.notificacoes.length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Não Lidas:</span>
                      <span className="text-sm font-medium text-red-600">
                        {selectedSolicitacao.notificacoes.filter(n => !n.lida).length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
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
              {selectedSolicitacao.status === 'pendente' && (
                <button
                  onClick={() => {
                    setSelectedSolicitacao(null);
                    navegarParaAnalise(selectedSolicitacao);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                  <Send size={16} className="mr-2" />
                  Enviar para Análise
                </button>
              )}
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