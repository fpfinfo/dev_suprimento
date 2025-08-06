import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'administrador' | 'suprido';
  avatar?: string;
  cpf?: string;
  position?: string;
  department?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  canAccessModule: (module: string) => boolean;
  canEditProfile: (profileId?: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simulação de login
  const login = async (email: string, password: string) => {
    // Simulação de diferentes tipos de usuário
    let userData: User;
    
    if (email === 'admin@tjpa.jus.br' && password === '123456') {
      userData = {
        id: '1',
        name: 'Administrador Sistema',
        email: 'admin@tjpa.jus.br',
        role: 'administrador',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        position: 'Administrador do Sistema',
        department: 'TI'
      };
    } else if (email === 'suprido@tjpa.jus.br' && password === '123456') {
      userData = {
        id: '2',
        name: 'Servidor Suprido',
        email: 'suprido@tjpa.jus.br',
        role: 'suprido',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        position: 'Servidor Público',
        department: 'Administrativo'
      };
    } else {
      throw new Error('Credenciais inválidas');
    }

    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
  };

  // Verificar permissões baseadas no tipo de usuário
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    const permissions = {
      administrador: [
        'dashboard.full_access',
        'administration.full_access',
        'system.full_access',
        'users.manage',
        'settings.manage',
        'sosfu.full_access',
        'supply_funds.manage',
        'accounting.manage',
        'reimbursement.manage',
        'profile.edit_all'
      ],
      suprido: [
        'dashboard.personal_access',
        'supply_funds.access',
        'accounting.access',
        'reimbursement.access',
        'profile.edit_own'
      ]
    };

    return permissions[user.role]?.includes(permission) || false;
  };

  // Verificar acesso a módulos específicos
  const canAccessModule = (module: string): boolean => {
    if (!user) return false;

    const moduleAccess = {
      administrador: [
        'dashboard',
        'supply-funds',
        'accounting-submission',
        'reimbursement-submission',
        'request-analysis',
        'accounting-analysis',
        'reimbursement-analysis',
        'users-management',
        'system-settings'
      ],
      suprido: [
        'dashboard',
        'supply-funds',
        'accounting-submission',
        'reimbursement-submission'
      ]
    };

    return moduleAccess[user.role]?.includes(module) || false;
  };

  // Verificar se pode editar perfil
  const canEditProfile = (profileId?: string): boolean => {
    if (!user) return false;

    if (user.role === 'administrador') {
      return true; // Administrador pode editar qualquer perfil
    }

    if (user.role === 'suprido') {
      return !profileId || profileId === user.id; // Suprido só pode editar próprio perfil
    }

    return false;
  };

  // Recuperar usuário do localStorage na inicialização
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      logout,
      hasPermission,
      canAccessModule,
      canEditProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};