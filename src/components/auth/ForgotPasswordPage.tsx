import React, { useState } from 'react';
import { 
  Mail, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Sun,
  Moon,
  Scale,
  Send,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface ForgotPasswordPageProps {
  onNavigateToLogin?: () => void;
  onPasswordReset?: (email: string) => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ 
  onNavigateToLogin,
  onPasswordReset
}) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const [step, setStep] = useState<'email' | 'code' | 'newPassword' | 'success'>('email');
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulação de envio de email
    setTimeout(() => {
      setStep('code');
      setIsLoading(false);
    }, 1500);
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulação de verificação de código
    setTimeout(() => {
      if (formData.code === '123456') {
        setStep('newPassword');
      } else {
        setError('Código inválido');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.newPassword.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Senhas não coincidem');
      return;
    }

    setIsLoading(true);

    // Simulação de redefinição de senha
    setTimeout(() => {
      setStep('success');
      setIsLoading(false);
      onPasswordReset?.(formData.email);
    }, 1500);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const renderStepContent = () => {
    switch (step) {
      case 'email':
        return (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Esqueceu sua senha?
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Digite seu email para receber um código de recuperação
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
                <AlertCircle size={20} className="text-red-600 mr-3" />
                <span className="text-red-700 dark:text-red-400 text-sm">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                  placeholder="seu.email@tjpa.jus.br"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={20} className="mr-2" />
                  Enviar Código
                </>
              )}
            </button>
          </form>
        );

      case 'code':
        return (
          <form onSubmit={handleCodeSubmit} className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail size={32} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Código Enviado
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Digite o código de 6 dígitos enviado para<br />
                <span className="font-medium text-blue-600 dark:text-blue-400">{formData.email}</span>
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
                <AlertCircle size={20} className="text-red-600 mr-3" />
                <span className="text-red-700 dark:text-red-400 text-sm">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Código de Verificação
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => handleInputChange('code', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 text-center text-2xl font-mono tracking-widest"
                placeholder="123456"
                maxLength={6}
                required
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                Código de demonstração: <span className="font-mono font-bold">123456</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Verificar Código'
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep('email')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium transition-colors"
              >
                Não recebeu o código? Reenviar
              </button>
            </div>
          </form>
        );

      case 'newPassword':
        return (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock size={32} className="text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Nova Senha
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Crie uma nova senha segura para sua conta
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
                <AlertCircle size={20} className="text-red-600 mr-3" />
                <span className="text-red-700 dark:text-red-400 text-sm">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nova Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                  placeholder="Mínimo 6 caracteres"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                  placeholder="Confirme sua nova senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Lock size={20} className="mr-2" />
                  Redefinir Senha
                </>
              )}
            </button>
          </form>
        );

      case 'success':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={40} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Senha Redefinida!
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Sua senha foi alterada com sucesso.<br />
                Agora você pode fazer login com sua nova senha.
              </p>
            </div>
            <button
              onClick={onNavigateToLogin}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Ir para Login
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-all duration-300">
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-10"
      >
        {isDark ? (
          <Sun size={20} className="text-yellow-500" />
        ) : (
          <Moon size={20} className="text-gray-600" />
        )}
      </button>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Scale size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Portal TJ-PA
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sistema de Suprimento de Fundos
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          {renderStepContent()}

          {/* Back to Login */}
          {step !== 'success' && (
            <div className="mt-6 text-center">
              <button
                onClick={onNavigateToLogin}
                className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium transition-colors"
              >
                <ArrowLeft size={16} className="mr-2" />
                Voltar ao Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;