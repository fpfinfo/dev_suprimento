import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'administrador' | 'suprido';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  canAccessModule: (module: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuários de teste
const testUsers: User[] = [
  {
    id: '1',
    name: 'Fábio Freitas',
    email: 'admin@tjpa.jus.br',
    role: 'administrador'
  },
  {
    id: '2',
    name: 'Administrador Sistema',
    email: 'fabio.freitas@tjpa.jus.br',
    role: 'administrador'
  },
  {
    id: '3',
    name: 'Usuário Suprido',
    email: 'suprido@tjpa.jus.br',
    role: 'suprido'
  },
  {
    id: '4',
    name: 'João Silva Santos',
    email: 'servidor@tjpa.jus.br',
    role: 'suprido'
  }
];

// Definir permissões por módulo
const modulePermissions: Record<string, string[]> = {
  'dashboard': ['administrador', 'suprido'],
  'supply-funds': ['suprido'],
  'accounting-submission': ['suprido'],
  'reimbursement-submission': ['suprido'],
  'request-analysis': ['administrador'],
  'accounting-analysis': ['administrador'],
  'reimbursement-analysis': ['administrador'],
  'users-management': ['administrador'],
  'system-settings': ['administrador']
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simular autenticação
      const foundUser = testUsers.find(u => u.email === email);
      
      if (foundUser && password === '123456') {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const canAccessModule = (module: string): boolean => {
    if (!user) return false;
    
    const allowedRoles = modulePermissions[module];
    return allowedRoles ? allowedRoles.includes(user.role) : false;
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    canAccessModule
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};