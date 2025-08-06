import React, { useState } from 'react';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import ForgotPasswordPage from './ForgotPasswordPage';

interface AuthContainerProps {
  onAuthenticated?: (user: any) => void;
}

const AuthContainer: React.FC<AuthContainerProps> = ({ onAuthenticated }) => {
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'forgot'>('login');

  const handleLogin = (email: string, password: string) => {
    // Simulação de autenticação
    const user = {
      id: '1',
      name: 'Fábio Freitas',
      email: email,
      role: 'Administrador',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    };
    onAuthenticated?.(user);
  };

  const handleRegister = (userData: any) => {
    // Simulação de cadastro
    const user = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: 'Usuário',
      avatar: null
    };
    onAuthenticated?.(user);
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