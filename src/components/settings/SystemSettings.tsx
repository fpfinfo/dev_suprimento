import React, { useState } from 'react';
import { 
  Settings,
  Save,
  RefreshCw,
  Shield,
  Database,
  Mail,
  Bell,
  FileText,
  DollarSign,
  Users,
  Calendar,
  Globe,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Info,
  Upload,
  Download,
  Trash2,
  Plus,
  Edit,
  X
} from 'lucide-react';

interface SystemConfig {
  general: {
    systemName: string;
    systemVersion: string;
    timezone: string;
    language: string;
    dateFormat: string;
    currency: string;
  };
  security: {
    sessionTimeout: number;
    passwordMinLength: number;
    requireSpecialChars: boolean;
    requireNumbers: boolean;
    maxLoginAttempts: number;
    twoFactorAuth: boolean;
  };
  email: {
    smtpServer: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
    enableSSL: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    systemAlerts: boolean;
    requestNotifications: boolean;
    accountingNotifications: boolean;
    reimbursementNotifications: boolean;
  };
  financial: {
    maxSupplyAmount: number;
    maxReimbursementAmount: number;
    accountingDeadlineDays: number;
    autoApprovalLimit: number;
    requireManagerApproval: boolean;
  };
  documents: {
    maxFileSize: number;
    allowedExtensions: string[];
    documentRetentionDays: number;
    requireDigitalSignature: boolean;
  };
}

interface ExpenseElement {
  id: string;
  code: string;
  description: string;
  type: string;
  maxAmount?: number;
  active: boolean;
}

const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showElementModal, setShowElementModal] = useState(false);
  const [editingElement, setEditingElement] = useState<ExpenseElement | null>(null);

  const [config, setConfig] = useState<SystemConfig>({
    general: {
      systemName: 'Sistema de Suprimento de Fundos - TJ-PA',
      systemVersion: '2.1.0',
      timezone: 'America/Belem',
      language: 'pt-BR',
      dateFormat: 'DD/MM/YYYY',
      currency: 'BRL'
    },
    security: {
      sessionTimeout: 30,
      passwordMinLength: 8,
      requireSpecialChars: true,
      requireNumbers: true,
      maxLoginAttempts: 3,
      twoFactorAuth: false
    },
    email: {
      smtpServer: 'smtp.tjpa.jus.br',
      smtpPort: 587,
      smtpUser: 'sistema@tjpa.jus.br',
      smtpPassword: '••••••••',
      fromEmail: 'noreply@tjpa.jus.br',
      fromName: 'Sistema TJ-PA',
      enableSSL: true
    },
    notifications: {
      emailNotifications: true,
      systemAlerts: true,
      requestNotifications: true,
      accountingNotifications: true,
      reimbursementNotifications: true
    },
    financial: {
      maxSupplyAmount: 50000,
      maxReimbursementAmount: 5000,
      accountingDeadlineDays: 30,
      autoApprovalLimit: 1000,
      requireManagerApproval: true
    },
    documents: {
      maxFileSize: 10,
      allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx'],
      documentRetentionDays: 2555, // 7 anos
      requireDigitalSignature: false
    }
  });

  const [expenseElements, setExpenseElements] = useState<ExpenseElement[]>([
    {
      id: '1',
      code: '3.3.90.30.96.01',
      description: 'Material de Consumo',
      type: 'material_consumo',
      maxAmount: 10000,
      active: true
    },
    {
      id: '2',
      code: '3.3.90.30.96.02',
      description: 'Combustível e Lubrificantes',
      type: 'material_consumo',
      maxAmount: 5000,
      active: true
    },
    {
      id: '3',
      code: '3.3.90.33.96',
      description: 'Transporte e Locomoção',
      type: 'servicos_terceiros',
      maxAmount: 8000,
      active: true
    },
    {
      id: '4',
      code: '3.3.90.36.96',
      description: 'Serviços de Terceiros - PF',
      type: 'servicos_terceiros',
      maxAmount: 12000,
      active: true
    },
    {
      id: '5',
      code: '3.3.90.39.96',
      description: 'Serviços de Terceiros - PJ',
      type: 'servicos_terceiros',
      maxAmount: 15000,
      active: true
    }
  ]);

  const [elementForm, setElementForm] = useState({
    code: '',
    description: '',
    type: 'material_consumo',
    maxAmount: '',
    active: true
  });

  const tabs = [
    { id: 'general', label: 'Geral', icon: <Settings size={16} /> },
    { id: 'security', label: 'Segurança', icon: <Shield size={16} /> },
    { id: 'email', label: 'Email', icon: <Mail size={16} /> },
    { id: 'notifications', label: 'Notificações', icon: <Bell size={16} /> },
    { id: 'financial', label: 'Financeiro', icon: <DollarSign size={16} /> },
    { id: 'documents', label: 'Documentos', icon: <FileText size={16} /> },
    { id: 'elements', label: 'Elementos de Despesa', icon: <Database size={16} /> }
  ];

  const updateConfig = (section: keyof SystemConfig, field: string, value: any) => {
    setConfig(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const saveSettings = () => {
    setShowSaveConfirm(true);
    setTimeout(() => setShowSaveConfirm(false), 3000);
  };

  const testEmailConnection = () => {
    alert('Testando conexão SMTP... Conexão bem-sucedida!');
  };

  const openElementModal = (element?: ExpenseElement) => {
    if (element) {
      setEditingElement(element);
      setElementForm({
        code: element.code,
        description: element.description,
        type: element.type,
        maxAmount: element.maxAmount?.toString() || '',
        active: element.active
      });
    } else {
      setEditingElement(null);
      setElementForm({
        code: '',
        description: '',
        type: 'material_consumo',
        maxAmount: '',
        active: true
      });
    }
    setShowElementModal(true);
  };

  const saveElement = () => {
    if (!elementForm.code || !elementForm.description) {
      alert('Preencha todos os campos obrigatórios');
      return;
    }

    const elementData: ExpenseElement = {
      id: editingElement?.id || Date.now().toString(),
      code: elementForm.code,
      description: elementForm.description,
      type: elementForm.type,
      maxAmount: elementForm.maxAmount ? parseFloat(elementForm.maxAmount) : undefined,
      active: elementForm.active
    };

    if (editingElement) {
      setExpenseElements(prev => prev.map(el => el.id === editingElement.id ? elementData : el));
    } else {
      setExpenseElements(prev => [...prev, elementData]);
    }

    setShowElementModal(false);
  };

  const deleteElement = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este elemento?')) {
      setExpenseElements(prev => prev.filter(el => el.id !== id));
    }
  };

  const toggleElementStatus = (id: string) => {
    setExpenseElements(prev => prev.map(el => 
      el.id === id ? { ...el, active: !el.active } : el
    ));
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações Gerais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome do Sistema
            </label>
            <input
              type="text"
              value={config.general.systemName}
              onChange={(e) => updateConfig('general', 'systemName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Versão do Sistema
            </label>
            <input
              type="text"
              value={config.general.systemVersion}
              onChange={(e) => updateConfig('general', 'systemVersion', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fuso Horário
            </label>
            <select
              value={config.general.timezone}
              onChange={(e) => updateConfig('general', 'timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="America/Belem">América/Belém (UTC-3)</option>
              <option value="America/Sao_Paulo">América/São Paulo (UTC-3)</option>
              <option value="America/Manaus">América/Manaus (UTC-4)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Idioma
            </label>
            <select
              value={config.general.language}
              onChange={(e) => updateConfig('general', 'language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pt-BR">Português (Brasil)</option>
              <option value="en-US">English (US)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formato de Data
            </label>
            <select
              value={config.general.dateFormat}
              onChange={(e) => updateConfig('general', 'dateFormat', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="DD/MM/YYYY">DD/MM/YYYY</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Moeda
            </label>
            <select
              value={config.general.currency}
              onChange={(e) => updateConfig('general', 'currency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="BRL">Real Brasileiro (R$)</option>
              <option value="USD">Dólar Americano ($)</option>
              <option value="EUR">Euro (€)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Segurança</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timeout de Sessão (minutos)
            </label>
            <input
              type="number"
              value={config.security.sessionTimeout}
              onChange={(e) => updateConfig('security', 'sessionTimeout', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamanho Mínimo da Senha
            </label>
            <input
              type="number"
              value={config.security.passwordMinLength}
              onChange={(e) => updateConfig('security', 'passwordMinLength', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Máximo de Tentativas de Login
            </label>
            <input
              type="number"
              value={config.security.maxLoginAttempts}
              onChange={(e) => updateConfig('security', 'maxLoginAttempts', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireSpecialChars"
                checked={config.security.requireSpecialChars}
                onChange={(e) => updateConfig('security', 'requireSpecialChars', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="requireSpecialChars" className="ml-2 text-sm text-gray-700">
                Exigir caracteres especiais na senha
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireNumbers"
                checked={config.security.requireNumbers}
                onChange={(e) => updateConfig('security', 'requireNumbers', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="requireNumbers" className="ml-2 text-sm text-gray-700">
                Exigir números na senha
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="twoFactorAuth"
                checked={config.security.twoFactorAuth}
                onChange={(e) => updateConfig('security', 'twoFactorAuth', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="twoFactorAuth" className="ml-2 text-sm text-gray-700">
                Habilitar autenticação de dois fatores
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Email</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Servidor SMTP
            </label>
            <input
              type="text"
              value={config.email.smtpServer}
              onChange={(e) => updateConfig('email', 'smtpServer', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Porta SMTP
            </label>
            <input
              type="number"
              value={config.email.smtpPort}
              onChange={(e) => updateConfig('email', 'smtpPort', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuário SMTP
            </label>
            <input
              type="text"
              value={config.email.smtpUser}
              onChange={(e) => updateConfig('email', 'smtpUser', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Senha SMTP
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={config.email.smtpPassword}
                onChange={(e) => updateConfig('email', 'smtpPassword', e.target.value)}
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Remetente
            </label>
            <input
              type="email"
              value={config.email.fromEmail}
              onChange={(e) => updateConfig('email', 'fromEmail', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nome Remetente
            </label>
            <input
              type="text"
              value={config.email.fromName}
              onChange={(e) => updateConfig('email', 'fromName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableSSL"
              checked={config.email.enableSSL}
              onChange={(e) => updateConfig('email', 'enableSSL', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="enableSSL" className="ml-2 text-sm text-gray-700">
              Habilitar SSL/TLS
            </label>
          </div>

          <div>
            <button
              onClick={testEmailConnection}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Testar Conexão
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Notificações</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Notificações por Email</h4>
              <p className="text-sm text-gray-600">Enviar notificações por email para usuários</p>
            </div>
            <input
              type="checkbox"
              checked={config.notifications.emailNotifications}
              onChange={(e) => updateConfig('notifications', 'emailNotifications', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Alertas do Sistema</h4>
              <p className="text-sm text-gray-600">Alertas sobre funcionamento do sistema</p>
            </div>
            <input
              type="checkbox"
              checked={config.notifications.systemAlerts}
              onChange={(e) => updateConfig('notifications', 'systemAlerts', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Notificações de Solicitações</h4>
              <p className="text-sm text-gray-600">Notificar sobre novas solicitações de suprimento</p>
            </div>
            <input
              type="checkbox"
              checked={config.notifications.requestNotifications}
              onChange={(e) => updateConfig('notifications', 'requestNotifications', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Notificações de Prestação de Contas</h4>
              <p className="text-sm text-gray-600">Notificar sobre prestações de contas</p>
            </div>
            <input
              type="checkbox"
              checked={config.notifications.accountingNotifications}
              onChange={(e) => updateConfig('notifications', 'accountingNotifications', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="text-sm font-medium text-gray-900">Notificações de Reembolso</h4>
              <p className="text-sm text-gray-600">Notificar sobre solicitações de reembolso</p>
            </div>
            <input
              type="checkbox"
              checked={config.notifications.reimbursementNotifications}
              onChange={(e) => updateConfig('notifications', 'reimbursementNotifications', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderFinancialSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações Financeiras</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor Máximo de Suprimento (R$)
            </label>
            <input
              type="number"
              value={config.financial.maxSupplyAmount}
              onChange={(e) => updateConfig('financial', 'maxSupplyAmount', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor Máximo de Reembolso (R$)
            </label>
            <input
              type="number"
              value={config.financial.maxReimbursementAmount}
              onChange={(e) => updateConfig('financial', 'maxReimbursementAmount', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prazo para Prestação de Contas (dias)
            </label>
            <input
              type="number"
              value={config.financial.accountingDeadlineDays}
              onChange={(e) => updateConfig('financial', 'accountingDeadlineDays', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Limite para Aprovação Automática (R$)
            </label>
            <input
              type="number"
              value={config.financial.autoApprovalLimit}
              onChange={(e) => updateConfig('financial', 'autoApprovalLimit', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="requireManagerApproval"
              checked={config.financial.requireManagerApproval}
              onChange={(e) => updateConfig('financial', 'requireManagerApproval', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="requireManagerApproval" className="ml-2 text-sm text-gray-700">
              Exigir aprovação do gestor
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDocumentSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Documentos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamanho Máximo de Arquivo (MB)
            </label>
            <input
              type="number"
              value={config.documents.maxFileSize}
              onChange={(e) => updateConfig('documents', 'maxFileSize', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Retenção de Documentos (dias)
            </label>
            <input
              type="number"
              value={config.documents.documentRetentionDays}
              onChange={(e) => updateConfig('documents', 'documentRetentionDays', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Extensões Permitidas
            </label>
            <input
              type="text"
              value={config.documents.allowedExtensions.join(', ')}
              onChange={(e) => updateConfig('documents', 'allowedExtensions', e.target.value.split(', '))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="pdf, jpg, jpeg, png, doc, docx"
            />
            <p className="text-sm text-gray-500 mt-1">Separe as extensões por vírgula</p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="requireDigitalSignature"
              checked={config.documents.requireDigitalSignature}
              onChange={(e) => updateConfig('documents', 'requireDigitalSignature', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="requireDigitalSignature" className="ml-2 text-sm text-gray-700">
              Exigir assinatura digital
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExpenseElements = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Elementos de Despesa</h3>
        <button
          onClick={() => openElementModal()}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} className="mr-2" />
          Novo Elemento
        </button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Máximo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenseElements.map((element) => (
                <tr key={element.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {element.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {element.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {element.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {element.maxAmount ? `R$ ${element.maxAmount.toLocaleString('pt-BR')}` : 'Sem limite'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleElementStatus(element.id)}
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full cursor-pointer hover:opacity-80 ${
                        element.active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {element.active ? 'Ativo' : 'Inativo'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => openElementModal(element)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Editar"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteElement(element.id)}
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
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralSettings();
      case 'security': return renderSecuritySettings();
      case 'email': return renderEmailSettings();
      case 'notifications': return renderNotificationSettings();
      case 'financial': return renderFinancialSettings();
      case 'documents': return renderDocumentSettings();
      case 'elements': return renderExpenseElements();
      default: return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <Settings size={24} className="text-gray-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configurações do Sistema</h1>
            <p className="text-gray-600">Configure todos os aspectos do sistema</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RefreshCw size={16} className="mr-2" />
            Resetar
          </button>
          <button
            onClick={saveSettings}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Save size={16} className="mr-2" />
            Salvar Configurações
          </button>
        </div>
      </div>

      {/* Success Message */}
      {showSaveConfirm && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle size={20} className="text-green-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-green-800">Configurações salvas com sucesso!</h3>
              <p className="text-sm text-green-700 mt-1">Todas as alterações foram aplicadas ao sistema.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Element Modal */}
      {showElementModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingElement ? 'Editar Elemento' : 'Novo Elemento'}
              </h3>
              <button
                onClick={() => setShowElementModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código *
                  </label>
                  <input
                    type="text"
                    value={elementForm.code}
                    onChange={(e) => setElementForm({...elementForm, code: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ex: 3.3.90.30.96.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo *
                  </label>
                  <select
                    value={elementForm.type}
                    onChange={(e) => setElementForm({...elementForm, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="material_consumo">Material de Consumo</option>
                    <option value="servicos_terceiros">Serviços de Terceiros</option>
                    <option value="equipamentos">Equipamentos</option>
                    <option value="outros">Outros</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição *
                </label>
                <input
                  type="text"
                  value={elementForm.description}
                  onChange={(e) => setElementForm({...elementForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descrição do elemento de despesa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valor Máximo (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={elementForm.maxAmount}
                  onChange={(e) => setElementForm({...elementForm, maxAmount: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Deixe em branco para sem limite"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="elementActive"
                  checked={elementForm.active}
                  onChange={(e) => setElementForm({...elementForm, active: e.target.checked})}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="elementActive" className="ml-2 text-sm text-gray-700">
                  Elemento ativo
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowElementModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={saveElement}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Save size={16} className="mr-2" />
                {editingElement ? 'Atualizar' : 'Criar'} Elemento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemSettings;