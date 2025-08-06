import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Sun,
  Moon,
  Scale,
  Phone,
  Building,
  FileText
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

interface RegisterPageProps {
  onRegister?: (userData: any) => void;
  onNavigateToLogin?: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ 
  onRegister, 
  onNavigateToLogin 
}) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Dados Pessoais
    name: '',
    email: '',
    cpf: '',
    phone: '',
    // Dados Profissionais
    position: '',
    department: '',
    positionCode: '',
    // Credenciais
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const steps = [
    { number: 1, title: 'Dados Pessoais', icon: <User size={20} /> },
    { number: 2, title: 'Dados Profissionais', icon: <Building size={20} /> },
    { number: 3, title: 'Credenciais', icon: <Lock size={20} /> }
  ];

  const validateStep = (step: number) => {
    const newErrors: {[key: string]: string} = {};

    if (step === 1) {
      if (!formData.name) newErrors.name = 'Nome é obrigatório';
      if (!formData.email) newErrors.email = 'Email é obrigatório';
      if (!formData.cpf) newErrors.cpf = 'CPF é obrigatório';
      if (!formData.phone) newErrors.phone = 'Telefone é obrigatório';
    }

    if (step === 2) {
      if (!formData.position) newErrors.position = 'Cargo é obrigatório';
      if (!formData.department) newErrors.department = 'Departamento é obrigatório';
      if (!formData.positionCode) newErrors.positionCode = 'Código do cargo é obrigatório';
    }

    if (step === 3) {
      if (!formData.password) newErrors.password = 'Senha é obrigatória';
      if (formData.password.length < 6) newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
      if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Senhas não coincidem';
      if (!formData.acceptTerms) newErrors.acceptTerms = 'Você deve aceitar os termos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setIsLoading(true);
    
    // Simulação de cadastro
    setTimeout(() => {
      onRegister?.(formData);
      setIsLoading(false);
    }, 2000);
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Nome Completo *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 ${
                    errors.name ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Seu nome completo"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 ${
                    errors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="seu.email@tjpa.jus.br"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                CPF *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => handleInputChange('cpf', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 ${
                    errors.cpf ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="000.000.000-00"
                />
              </div>
              {errors.cpf && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cpf}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Telefone *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 ${
                    errors.phone ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="(91) 99999-9999"
                />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone}</p>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cargo *
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => handleInputChange('position', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 ${
                  errors.position ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Ex: Analista Judiciário"
              />
              {errors.position && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.position}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Departamento *
              </label>
              <select
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 ${
                  errors.department ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                <option value="">Selecione o departamento</option>
                <option value="Vara Criminal">Vara Criminal</option>
                <option value="Vara Cível">Vara Cível</option>
                <option value="Vara de Família">Vara de Família</option>
                <option value="Vara Trabalhista">Vara Trabalhista</option>
                <option value="Administrativo">Administrativo</option>
                <option value="TI">Tecnologia da Informação</option>
                <option value="Suprimento de Fundos">Suprimento de Fundos</option>
              </select>
              {errors.department && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.department}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Código do Cargo *
              </label>
              <input
                type="text"
                value={formData.positionCode}
                onChange={(e) => handleInputChange('positionCode', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 ${
                  errors.positionCode ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
                placeholder="Ex: AJ001"
              />
              {errors.positionCode && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.positionCode}</p>}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Senha *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 ${
                    errors.password ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Mínimo 6 caracteres"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirmar Senha *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 ${
                    errors.confirmPassword ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Confirme sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword}</p>}
            </div>

            <div>
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => handleInputChange('acceptTerms', e.target.checked)}
                  className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 mt-1 ${
                    errors.acceptTerms ? 'border-red-500' : ''
                  }`}
                />
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  Eu aceito os{' '}
                  <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Termos de Uso
                  </a>{' '}
                  e{' '}
                  <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
                    Política de Privacidade
                  </a>
                </span>
              </label>
              {errors.acceptTerms && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.acceptTerms}</p>}
            </div>
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
            Criar Conta
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Cadastre-se no Portal TJ-PA
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                  currentStep >= step.number
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                }`}>
                  {currentStep > step.number ? (
                    <CheckCircle size={20} />
                  ) : (
                    step.icon
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-2 transition-all duration-300 ${
                    currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            {steps.map((step) => (
              <span key={step.number} className={`text-xs transition-all duration-300 ${
                currentStep >= step.number
                  ? 'text-blue-600 dark:text-blue-400 font-medium'
                  : 'text-gray-500 dark:text-gray-400'
              }`}>
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {/* Register Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="flex items-center px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  <ArrowLeft size={20} className="mr-2" />
                  Anterior
                </button>
              ) : (
                <div />
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  Próximo
                  <ArrowRight size={20} className="ml-2" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <CheckCircle size={20} className="mr-2" />
                  )}
                  {isLoading ? 'Criando...' : 'Criar Conta'}
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Já tem uma conta?{' '}
            <button
              onClick={onNavigateToLogin}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
            >
              Faça login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;