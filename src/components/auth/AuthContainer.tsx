import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ForgotPasswordPage from './ForgotPasswordPage';

const AuthContainer: React.FC = () => {
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'forgot'>('login');
  const { login } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
    } catch (error) {
      throw error; // Repassar erro para o componente de login
    }
  };

  const handleRegister = (userData: any) => {
    // Simulação de cadastro - em produção, implementar registro real
    alert('Funcionalidade de cadastro será implementada em breve.');
  };

  const handlePasswordReset = (email: string) => {
    // Após redefinir senha, volta para login
    setCurrentView('login');
  };

  switch (currentView) {
    case 'register':
      return (
        <RegisterPage
          onRegister={handleRegister}
          onNavigateToLogin={() => setCurrentView('login')}
        />
      );
    case 'forgot':
      return (
        <ForgotPasswordPage
          onNavigateToLogin={() => setCurrentView('login')}
          onPasswordReset={handlePasswordReset}
        />
      );
    default:
      return (
        <LoginPage
          onLogin={handleLogin}
          onNavigateToRegister={() => setCurrentView('register')}
          onNavigateToForgotPassword={() => setCurrentView('forgot')}
        />
      );
  }
};

export default AuthContainer;