import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  ArrowRight,
  Shield,
  CheckCircle,
  AlertCircle,
  Sun,
  Moon,
  Scale
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface LoginPageProps {
  onLogin?: (email: string, password: string) => void;
  onNavigateToRegister?: () => void;
  onNavigateToForgotPassword?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ 
  onLogin, 
  onNavigateToRegister, 
  onNavigateToForgotPassword 
}) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await onLogin?.(formData.email, formData.password);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
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

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Bem-vindo de volta
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Faça login para acessar sua conta
            </p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <User size={16} className="text-purple-600 mr-2" />
                <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
                  Outro Suprido
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,
                    email: 'servidor@tjpa.jus.br',
                    password: '123456'
                  });
                }}
                className="px-3 py-1 bg-purple-600 text-white text-xs rounded-md hover:bg-purple-700 transition-colors"
              >
                Usar credenciais
              </button>
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-400 space-y-1">
              <p><strong>Email:</strong> servidor@tjpa.jus.br</p>
              <p><strong>Senha:</strong> 123456</p>
              <p className="text-xs mt-2 opacity-75">• João Silva Santos • Vara Criminal</p>
            </div>
          </div>
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
              <AlertCircle size={20} className="text-red-600 mr-3" />
              <span className="text-red-700 dark:text-red-400 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
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

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                  placeholder="Digite sua senha"
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  Lembrar de mim
                </span>
              </label>
              <button
                type="button"
                onClick={onNavigateToForgotPassword}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Esqueceu a senha?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Entrar
                  <ArrowRight size={20} className="ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Não tem uma conta?{' '}
              <button
                onClick={onNavigateToRegister}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Cadastre-se
              </button>
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="mt-6 space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex items-center mb-2">
              <Shield size={16} className="text-red-600 mr-2" />
              <span className="text-sm font-medium text-red-800 dark:text-red-300">
                Super Administrador
              </span>
            </div>
            <div className="text-sm text-red-700 dark:text-red-400 space-y-1">
              <p><strong>Email:</strong> superadmin@tjpa.jus.br</p>
              <p><strong>Senha:</strong> 123456</p>
            </div>
          </div>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center mb-2">
              <Shield size={16} className="text-blue-600 mr-2" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                Administrador
              </span>
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
              <p><strong>Email:</strong> admin@tjpa.jus.br</p>
              <p><strong>Senha:</strong> 123456</p>
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <User size={16} className="text-purple-600 mr-2" />
                <span className="text-sm font-medium text-purple-800 dark:text-purple-300">
                  Outro Admin
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,
                    email: 'fabio.freitas@tjpa.jus.br',
                    password: '123456'
                  });
                }}
                className="px-3 py-1 bg-purple-600 text-white text-xs rounded-md hover:bg-purple-700 transition-colors"
              >
                Usar credenciais
              </button>
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-400 space-y-1">
              <p><strong>Email:</strong> fabio.freitas@tjpa.jus.br</p>
              <p><strong>Senha:</strong> 123456</p>
              <p className="text-xs mt-2 opacity-75">• Fábio Freitas • Analista de Sistemas</p>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center mb-2">
              <User size={16} className="text-green-600 mr-2" />
              <span className="text-sm font-medium text-green-800 dark:text-green-300">
                Suprido
              </span>
            </div>
            <div className="text-sm text-green-700 dark:text-green-400 space-y-1">
              <p><strong>Email:</strong> suprido@tjpa.jus.br</p>
              <p><strong>Senha:</strong> 123456</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;