import React, { useState, useEffect } from 'react';
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
  X,
  Activity,
  BarChart3,
  Clock,
  Zap,
  Server,
  HardDrive,
  Wifi,
  Monitor,
  Smartphone,
  Palette,
  Languages,
  MapPin,
  CreditCard,
  Key,
  UserCheck,
  FileCheck,
  AlertCircle,
  Copy,
  ExternalLink,
  History,
  Target,
  Layers,
  Code,
  Terminal
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SystemConfig {
  general: {
    systemName: string;
    systemVersion: string;
    timezone: string;
    language: string;
    dateFormat: string;
    currency: string;
    maintenanceMode: boolean;
    debugMode: boolean;
    logLevel: string;
  };
  security: {
    sessionTimeout: number;
    passwordMinLength: number;
    requireSpecialChars: boolean;
    requireNumbers: boolean;
    requireUppercase: boolean;
    maxLoginAttempts: number;
    lockoutDuration: number;
    twoFactorAuth: boolean;
    ipWhitelist: string[];
    allowedDomains: string[];
    encryptionLevel: string;
  };
  email: {
    smtpServer: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
    enableSSL: boolean;
    enableTLS: boolean;
    maxRetries: number;
    retryDelay: number;
    templates: {
      welcome: string;
      passwordReset: string;
      notification: string;
    };
  };
  notifications: {
    emailNotifications: boolean;
    systemAlerts: boolean;
    requestNotifications: boolean;
    accountingNotifications: boolean;
    reimbursementNotifications: boolean;
    deadlineAlerts: boolean;
    approvalNotifications: boolean;
    rejectionNotifications: boolean;
    reminderFrequency: number;
    escalationRules: boolean;
  };
  financial: {
    maxSupplyAmount: number;
    maxReimbursementAmount: number;
    accountingDeadlineDays: number;
    autoApprovalLimit: number;
    requireManagerApproval: boolean;
    allowPartialApproval: boolean;
    requireJustification: boolean;
    enableBudgetControl: boolean;
    fiscalYearStart: string;
    defaultCurrency: string;
    exchangeRateSource: string;
    taxCalculation: boolean;
  };
  documents: {
    maxFileSize: number;
    allowedExtensions: string[];
    documentRetentionDays: number;
    requireDigitalSignature: boolean;
    enableVersionControl: boolean;
    autoBackup: boolean;
    compressionEnabled: boolean;
    watermarkEnabled: boolean;
    ocrEnabled: boolean;
    storageLocation: string;
  };
  integration: {
    apiEnabled: boolean;
    apiKey: string;
    webhookUrl: string;
    externalSystems: {
      erp: { enabled: boolean; endpoint: string; token: string; };
      accounting: { enabled: boolean; endpoint: string; token: string; };
      hr: { enabled: boolean; endpoint: string; token: string; };
    };
    syncFrequency: number;
    dataMapping: any;
  };
  performance: {
    cacheEnabled: boolean;
    cacheDuration: number;
    compressionEnabled: boolean;
    cdnEnabled: boolean;
    loadBalancing: boolean;
    maxConcurrentUsers: number;
    sessionPoolSize: number;
    queryTimeout: number;
    backupFrequency: string;
    monitoringEnabled: boolean;
  };
  ui: {
    theme: string;
    primaryColor: string;
    secondaryColor: string;
    logoUrl: string;
    faviconUrl: string;
    customCss: string;
    showBranding: boolean;
    compactMode: boolean;
    animationsEnabled: boolean;
    soundEnabled: boolean;
  };
}

interface ExpenseElement {
  id: string;
  code: string;
  description: string;
  type: string;
  maxAmount?: number;
  active: boolean;
  category: string;
  requiresApproval: boolean;
  allowedRoles: string[];
  validityPeriod?: number;
}

interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  module: string;
  action: string;
  user: string;
  details: string;
  ip?: string;
}

interface BackupInfo {
  id: string;
  filename: string;
  size: string;
  date: string;
  type: 'full' | 'incremental' | 'differential';
  status: 'completed' | 'failed' | 'in_progress';
}

const SystemSettings: React.FC = () => {
  const { user, isSuperAdmin, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [showPassword, setShowPassword] = useState(false);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [showElementModal, setShowElementModal] = useState(false);
  const [editingElement, setEditingElement] = useState<ExpenseElement | null>(null);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>([]);
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [systemStats, setSystemStats] = useState({
    uptime: '15 dias, 8 horas',
    cpuUsage: 45,
    memoryUsage: 62,
    diskUsage: 38,
    activeUsers: 23,
    totalRequests: 15847,
    errorRate: 0.2
  });

  const [config, setConfig] = useState<SystemConfig>({
    general: {
      systemName: 'Sistema de Suprimento de Fundos - TJ-PA',
      systemVersion: '2.1.0',
      timezone: 'America/Belem',
      language: 'pt-BR',
      dateFormat: 'DD/MM/YYYY',
      currency: 'BRL',
      maintenanceMode: false,
      debugMode: false,
      logLevel: 'info'
    },
    security: {
      sessionTimeout: 30,
      passwordMinLength: 8,
      requireSpecialChars: true,
      requireNumbers: true,
      requireUppercase: true,
      maxLoginAttempts: 3,
      lockoutDuration: 15,
      twoFactorAuth: false,
      ipWhitelist: [],
      allowedDomains: ['tjpa.jus.br'],
      encryptionLevel: 'AES-256'
    },
    email: {
      smtpServer: 'smtp.tjpa.jus.br',
      smtpPort: 587,
      smtpUser: 'sistema@tjpa.jus.br',
      smtpPassword: '••••••••',
      fromEmail: 'noreply@tjpa.jus.br',
      fromName: 'Sistema TJ-PA',
      enableSSL: true,
      enableTLS: false,
      maxRetries: 3,
      retryDelay: 5,
      templates: {
        welcome: 'template_welcome',
        passwordReset: 'template_reset',
        notification: 'template_notification'
      }
    },
    notifications: {
      emailNotifications: true,
      systemAlerts: true,
      requestNotifications: true,
      accountingNotifications: true,
      reimbursementNotifications: true,
      deadlineAlerts: true,
      approvalNotifications: true,
      rejectionNotifications: true,
      reminderFrequency: 24,
      escalationRules: true
    },
    financial: {
      maxSupplyAmount: 50000,
      maxReimbursementAmount: 5000,
      accountingDeadlineDays: 30,
      autoApprovalLimit: 1000,
      requireManagerApproval: true,
      allowPartialApproval: true,
      requireJustification: true,
      enableBudgetControl: true,
      fiscalYearStart: '01/01',
      defaultCurrency: 'BRL',
      exchangeRateSource: 'BCB',
      taxCalculation: true
    },
    documents: {
      maxFileSize: 10,
      allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx'],
      documentRetentionDays: 2555,
      requireDigitalSignature: false,
      enableVersionControl: true,
      autoBackup: true,
      compressionEnabled: true,
      watermarkEnabled: false,
      ocrEnabled: false,
      storageLocation: 'local'
    },
    integration: {
      apiEnabled: true,
      apiKey: 'sk_live_••••••••••••••••',
      webhookUrl: 'https://api.tjpa.jus.br/webhooks',
      externalSystems: {
        erp: { enabled: false, endpoint: '', token: '' },
        accounting: { enabled: false, endpoint: '', token: '' },
        hr: { enabled: true, endpoint: 'https://rh.tjpa.jus.br/api', token: '••••••••' }
      },
      syncFrequency: 60,
      dataMapping: {}
    },
    performance: {
      cacheEnabled: true,
      cacheDuration: 3600,
      compressionEnabled: true,
      cdnEnabled: false,
      loadBalancing: false,
      maxConcurrentUsers: 100,
      sessionPoolSize: 50,
      queryTimeout: 30,
      backupFrequency: 'daily',
      monitoringEnabled: true
    },
    ui: {
      theme: 'light',
      primaryColor: '#3B82F6',
      secondaryColor: '#8B5CF6',
      logoUrl: '/assets/logo-tjpa.png',
      faviconUrl: '/assets/favicon.ico',
      customCss: '',
      showBranding: true,
      compactMode: false,
      animationsEnabled: true,
      soundEnabled: false
    }
  });

  const [expenseElements, setExpenseElements] = useState<ExpenseElement[]>([
    {
      id: '1',
      code: '3.3.90.30.96.01',
      description: 'Material de Consumo',
      type: 'material_consumo',
      maxAmount: 10000,
      active: true,
      category: 'Materiais',
      requiresApproval: true,
      allowedRoles: ['administrador', 'suprido'],
      validityPeriod: 365
    },
    {
      id: '2',
      code: '3.3.90.30.96.02',
      description: 'Combustível e Lubrificantes',
      type: 'material_consumo',
      maxAmount: 5000,
      active: true,
      category: 'Materiais',
      requiresApproval: true,
      allowedRoles: ['administrador', 'suprido'],
      validityPeriod: 180
    },
    {
      id: '3',
      code: '3.3.90.33.96',
      description: 'Transporte e Locomoção',
      type: 'servicos_terceiros',
      maxAmount: 8000,
      active: true,
      category: 'Serviços',
      requiresApproval: true,
      allowedRoles: ['administrador', 'suprido'],
      validityPeriod: 90
    }
  ]);

  const [elementForm, setElementForm] = useState({
    code: '',
    description: '',
    type: 'material_consumo',
    maxAmount: '',
    active: true,
    category: 'Materiais',
    requiresApproval: true,
    allowedRoles: ['suprido'],
    validityPeriod: 365
  });

  // Carregar dados iniciais
  useEffect(() => {
    loadSystemLogs();
    loadBackups();
    loadSystemStats();
  }, []);

  const loadSystemLogs = () => {
    const mockLogs: SystemLog[] = [
      {
        id: '1',
        timestamp: new Date().toISOString(),
        level: 'info',
        module: 'Authentication',
        action: 'User Login',
        user: 'admin@tjpa.jus.br',
        details: 'Successful login from IP 192.168.1.100',
        ip: '192.168.1.100'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        level: 'warning',
        module: 'Financial',
        action: 'High Value Request',
        user: 'suprido@tjpa.jus.br',
        details: 'Request above auto-approval limit: R$ 15,000.00'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        level: 'error',
        module: 'Email',
        action: 'Send Failed',
        user: 'system',
        details: 'Failed to send notification email to user@tjpa.jus.br'
      }
    ];
    setSystemLogs(mockLogs);
  };

  const loadBackups = () => {
    const mockBackups: BackupInfo[] = [
      {
        id: '1',
        filename: 'backup_2024_01_20_full.sql',
        size: '2.3 GB',
        date: '2024-01-20 02:00:00',
        type: 'full',
        status: 'completed'
      },
      {
        id: '2',
        filename: 'backup_2024_01_19_inc.sql',
        size: '145 MB',
        date: '2024-01-19 02:00:00',
        type: 'incremental',
        status: 'completed'
      }
    ];
    setBackups(mockBackups);
  };

  const loadSystemStats = () => {
    // Simular carregamento de estatísticas do sistema
    setTimeout(() => {
      setSystemStats(prev => ({
        ...prev,
        cpuUsage: Math.floor(Math.random() * 30) + 30,
        memoryUsage: Math.floor(Math.random() * 20) + 50,
        activeUsers: Math.floor(Math.random() * 10) + 20
      }));
    }, 1000);
  };

  const tabs = [
    { id: 'general', label: 'Geral', icon: <Settings size={16} /> },
    { id: 'security', label: 'Segurança', icon: <Shield size={16} /> },
    { id: 'email', label: 'Email', icon: <Mail size={16} /> },
    { id: 'notifications', label: 'Notificações', icon: <Bell size={16} /> },
    { id: 'financial', label: 'Financeiro', icon: <DollarSign size={16} /> },
    { id: 'documents', label: 'Documentos', icon: <FileText size={16} /> },
    { id: 'elements', label: 'Elementos de Despesa', icon: <Database size={16} /> },
    { id: 'integration', label: 'Integrações', icon: <Zap size={16} /> },
    { id: 'performance', label: 'Performance', icon: <Activity size={16} /> },
    { id: 'ui', label: 'Interface', icon: <Palette size={16} /> },
    ...(isSuperAdmin() ? [
      { id: 'monitoring', label: 'Monitoramento', icon: <Monitor size={16} /> },
      { id: 'logs', label: 'Logs', icon: <Terminal size={16} /> },
      { id: 'backup', label: 'Backup', icon: <HardDrive size={16} /> }
    ] : [])
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
    // Simular salvamento
    setShowSaveConfirm(true);
    
    // Integração com outros módulos
    applySettingsToModules();
    
    setTimeout(() => setShowSaveConfirm(false), 3000);
  };

  const applySettingsToModules = () => {
    // Aplicar configurações aos módulos
    console.log('Aplicando configurações aos módulos:', {
      financial: config.financial,
      notifications: config.notifications,
      documents: config.documents,
      security: config.security
    });
    
    // Aqui seria feita a integração real com os módulos
    // Por exemplo: atualizar limites nos módulos de suprimento
    // Atualizar configurações de notificação nos módulos SOSFU
    // Etc.
  };

  const testEmailConnection = () => {
    alert('Testando conexão SMTP... Conexão bem-sucedida!');
  };

  const generateApiKey = () => {
    const newKey = 'sk_live_' + Math.random().toString(36).substring(2, 15);
    updateConfig('integration', 'apiKey', newKey);
  };

  const createBackup = () => {
    const newBackup: BackupInfo = {
      id: Date.now().toString(),
      filename: `backup_${new Date().toISOString().split('T')[0]}_manual.sql`,
      size: '0 MB',
      date: new Date().toISOString(),
      type: 'full',
      status: 'in_progress'
    };
    
    setBackups(prev => [newBackup, ...prev]);
    
    // Simular progresso do backup
    setTimeout(() => {
      setBackups(prev => prev.map(b => 
        b.id === newBackup.id 
          ? { ...b, status: 'completed', size: '1.8 GB' }
          : b
      ));
    }, 3000);
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Configurações Gerais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nome do Sistema
            </label>
            <input
              type="text"
              value={config.general.systemName}
              onChange={(e) => updateConfig('general', 'systemName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Versão do Sistema
            </label>
            <input
              type="text"
              value={config.general.systemVersion}
              onChange={(e) => updateConfig('general', 'systemVersion', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Fuso Horário
            </label>
            <select
              value={config.general.timezone}
              onChange={(e) => updateConfig('general', 'timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="America/Belem">América/Belém (UTC-3)</option>
              <option value="America/Sao_Paulo">América/São Paulo (UTC-3)</option>
              <option value="America/Manaus">América/Manaus (UTC-4)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nível de Log
            </label>
            <select
              value={config.general.logLevel}
              onChange={(e) => updateConfig('general', 'logLevel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="debug">Debug</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="maintenanceMode"
                checked={config.general.maintenanceMode}
                onChange={(e) => updateConfig('general', 'maintenanceMode', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label htmlFor="maintenanceMode" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Modo de Manutenção
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="debugMode"
                checked={config.general.debugMode}
                onChange={(e) => updateConfig('general', 'debugMode', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label htmlFor="debugMode" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Modo Debug
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderIntegrationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Configurações de Integração</h3>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <Info size={20} className="text-blue-600 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300">Integração com Módulos</h4>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                Estas configurações afetam diretamente o comportamento dos módulos de Suprimento, Prestação de Contas e Reembolso.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API Habilitada
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={config.integration.apiEnabled}
                onChange={(e) => updateConfig('integration', 'apiEnabled', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Permitir acesso via API externa
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Chave da API
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={config.integration.apiKey}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <button
                onClick={generateApiKey}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL do Webhook
            </label>
            <input
              type="url"
              value={config.integration.webhookUrl}
              onChange={(e) => updateConfig('integration', 'webhookUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="https://api.tjpa.jus.br/webhooks"
            />
          </div>
        </div>

        <div className="mt-8">
          <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4">Sistemas Externos</h4>
          
          <div className="space-y-4">
            {Object.entries(config.integration.externalSystems).map(([key, system]) => (
              <div key={key} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900 dark:text-gray-100 capitalize">
                    {key === 'erp' ? 'ERP' : key === 'hr' ? 'RH' : 'Contabilidade'}
                  </h5>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={system.enabled}
                      onChange={(e) => updateConfig('integration', 'externalSystems', {
                        ...config.integration.externalSystems,
                        [key]: { ...system, enabled: e.target.checked }
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Habilitado</span>
                  </div>
                </div>
                
                {system.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Endpoint
                      </label>
                      <input
                        type="url"
                        value={system.endpoint}
                        onChange={(e) => updateConfig('integration', 'externalSystems', {
                          ...config.integration.externalSystems,
                          [key]: { ...system, endpoint: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="https://api.sistema.com"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Token
                      </label>
                      <input
                        type="password"
                        value={system.token}
                        onChange={(e) => updateConfig('integration', 'externalSystems', {
                          ...config.integration.externalSystems,
                          [key]: { ...system, token: e.target.value }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                        placeholder="Token de acesso"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMonitoringSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Monitoramento do Sistema</h3>
        
        {/* System Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">CPU</p>
                <p className="text-2xl font-bold text-blue-600">{systemStats.cpuUsage}%</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Activity size={24} className="text-blue-600" />
              </div>
            </div>
            <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${systemStats.cpuUsage}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Memória</p>
                <p className="text-2xl font-bold text-green-600">{systemStats.memoryUsage}%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <HardDrive size={24} className="text-green-600" />
              </div>
            </div>
            <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${systemStats.memoryUsage}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Disco</p>
                <p className="text-2xl font-bold text-orange-600">{systemStats.diskUsage}%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <Database size={24} className="text-orange-600" />
              </div>
            </div>
            <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-orange-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${systemStats.diskUsage}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Usuários Ativos</p>
                <p className="text-2xl font-bold text-purple-600">{systemStats.activeUsers}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Users size={24} className="text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100 mb-4">Informações do Sistema</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tempo de Atividade</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{systemStats.uptime}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total de Requisições</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{systemStats.totalRequests.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Taxa de Erro</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{systemStats.errorRate}%</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Versão do Sistema</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{config.general.systemVersion}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLogsSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Logs do Sistema</h3>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100">Logs Recentes</h4>
              <button
                onClick={loadSystemLogs}
                className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                <RefreshCw size={14} className="mr-1 inline" />
                Atualizar
              </button>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {systemLogs.map((log) => (
              <div key={log.id} className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        log.level === 'error' ? 'bg-red-100 text-red-800' :
                        log.level === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        log.level === 'info' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {log.level.toUpperCase()}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{log.module}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">•</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">{log.action}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{log.details}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>Usuário: {log.user}</span>
                      {log.ip && <span>IP: {log.ip}</span>}
                      <span>{new Date(log.timestamp).toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderBackupSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Gerenciamento de Backup</h3>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100">Configurações de Backup</h4>
            <button
              onClick={createBackup}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Criar Backup Manual
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Frequência de Backup
              </label>
              <select
                value={config.performance.backupFrequency}
                onChange={(e) => updateConfig('performance', 'backupFrequency', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="hourly">A cada hora</option>
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
                <option value="monthly">Mensal</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="autoBackup"
                checked={config.documents.autoBackup}
                onChange={(e) => updateConfig('documents', 'autoBackup', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label htmlFor="autoBackup" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Backup Automático Habilitado
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100">Backups Existentes</h4>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Arquivo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Tamanho
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Data
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
                {backups.map((backup) => (
                  <tr key={backup.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {backup.filename}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 capitalize">
                      {backup.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {backup.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {new Date(backup.date).toLocaleString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        backup.status === 'completed' ? 'bg-green-100 text-green-800' :
                        backup.status === 'failed' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {backup.status === 'completed' ? 'Concluído' :
                         backup.status === 'failed' ? 'Falhou' : 'Em Progresso'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-900"
                        title="Download"
                      >
                        <Download size={16} />
                      </button>
                      <button
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
    </div>
  );

  // Renderizar outras seções (mantendo as existentes e adicionando as novas)
  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Configurações de Segurança</h3>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <AlertTriangle size={20} className="text-yellow-600 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">Impacto nos Módulos</h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                Alterações de segurança afetam o login e acesso a todos os módulos do sistema.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Timeout de Sessão (minutos)
            </label>
            <input
              type="number"
              value={config.security.sessionTimeout}
              onChange={(e) => updateConfig('security', 'sessionTimeout', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tamanho Mínimo da Senha
            </label>
            <input
              type="number"
              value={config.security.passwordMinLength}
              onChange={(e) => updateConfig('security', 'passwordMinLength', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Máximo de Tentativas de Login
            </label>
            <input
              type="number"
              value={config.security.maxLoginAttempts}
              onChange={(e) => updateConfig('security', 'maxLoginAttempts', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Duração do Bloqueio (minutos)
            </label>
            <input
              type="number"
              value={config.security.lockoutDuration}
              onChange={(e) => updateConfig('security', 'lockoutDuration', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireSpecialChars"
                checked={config.security.requireSpecialChars}
                onChange={(e) => updateConfig('security', 'requireSpecialChars', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label htmlFor="requireSpecialChars" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Exigir caracteres especiais na senha
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireNumbers"
                checked={config.security.requireNumbers}
                onChange={(e) => updateConfig('security', 'requireNumbers', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label htmlFor="requireNumbers" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Exigir números na senha
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireUppercase"
                checked={config.security.requireUppercase}
                onChange={(e) => updateConfig('security', 'requireUppercase', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label htmlFor="requireUppercase" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Exigir letras maiúsculas na senha
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="twoFactorAuth"
                checked={config.security.twoFactorAuth}
                onChange={(e) => updateConfig('security', 'twoFactorAuth', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label htmlFor="twoFactorAuth" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Habilitar autenticação de dois fatores
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFinancialSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Configurações Financeiras</h3>
        
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <CheckCircle size={20} className="text-green-600 mr-3" />
            <div>
              <h4 className="text-sm font-medium text-green-800 dark:text-green-300">Integração Direta</h4>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                Estas configurações são aplicadas automaticamente nos módulos de Suprimento, Prestação de Contas e Reembolso.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Valor Máximo de Suprimento (R$)
            </label>
            <input
              type="number"
              value={config.financial.maxSupplyAmount}
              onChange={(e) => updateConfig('financial', 'maxSupplyAmount', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Aplicado no módulo de Suprimento de Fundos
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Valor Máximo de Reembolso (R$)
            </label>
            <input
              type="number"
              value={config.financial.maxReimbursementAmount}
              onChange={(e) => updateConfig('financial', 'maxReimbursementAmount', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Aplicado no módulo de Reembolso de Despesas
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Prazo para Prestação de Contas (dias)
            </label>
            <input
              type="number"
              value={config.financial.accountingDeadlineDays}
              onChange={(e) => updateConfig('financial', 'accountingDeadlineDays', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Aplicado no módulo de Prestação de Contas
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Limite para Aprovação Automática (R$)
            </label>
            <input
              type="number"
              value={config.financial.autoApprovalLimit}
              onChange={(e) => updateConfig('financial', 'autoApprovalLimit', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Aplicado nos módulos SOSFU de análise
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireManagerApproval"
                checked={config.financial.requireManagerApproval}
                onChange={(e) => updateConfig('financial', 'requireManagerApproval', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label htmlFor="requireManagerApproval" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Exigir aprovação do gestor
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="allowPartialApproval"
                checked={config.financial.allowPartialApproval}
                onChange={(e) => updateConfig('financial', 'allowPartialApproval', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label htmlFor="allowPartialApproval" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Permitir aprovação parcial
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="enableBudgetControl"
                checked={config.financial.enableBudgetControl}
                onChange={(e) => updateConfig('financial', 'enableBudgetControl', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded"
              />
              <label htmlFor="enableBudgetControl" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                Habilitar controle orçamentário
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralSettings();
      case 'security': return renderSecuritySettings();
      case 'financial': return renderFinancialSettings();
      case 'integration': return renderIntegrationSettings();
      case 'monitoring': return renderMonitoringSettings();
      case 'logs': return renderLogsSettings();
      case 'backup': return renderBackupSettings();
      // Manter outras seções existentes...
      default: return renderGeneralSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
            <Settings size={24} className="text-gray-600 dark:text-gray-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Configurações do Sistema</h1>
            <p className="text-gray-600 dark:text-gray-400">Configure todos os aspectos do sistema e integração entre módulos</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center px-4 py-2 bg-gray-600 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            <RefreshCw size={16} className="mr-2" />
            Resetar
          </button>
          <button
            onClick={saveSettings}
            className="flex items-center px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
          >
            <Save size={16} className="mr-2" />
            Salvar Configurações
          </button>
        </div>
      </div>

      {/* Success Message */}
      {showSaveConfirm && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle size={20} className="text-green-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Configurações salvas com sucesso!</h3>
              <p className="text-sm text-green-700 dark:text-green-400 mt-1">Todas as alterações foram aplicadas ao sistema e módulos integrados.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6 overflow-x-auto" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
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
    </div>
  );
};

export default SystemSettings;