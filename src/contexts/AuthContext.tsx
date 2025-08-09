import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'administrador' | 'suprido';
  avatar?: string;
  cpf?: string;
  position?: string;
  department?: string;
  permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  canAccessModule: (module: string) => boolean;
  canEditProfile: (profileId?: string) => boolean;
  getUserTypeLabel: () => string;
  isSuperAdmin: () => boolean;
  isAdmin: () => boolean;
  isSuprido: () => boolean;
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
    
    if (email === 'superadmin@tjpa.jus.br' && password === '123456') {
      userData = {
        id: '1',
        name: 'Super Administrador',
        email: 'superadmin@tjpa.jus.br',
        role: 'super_admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        position: 'Super Administrador do Sistema',
        department: 'TI',
        permissions: ['*'] // Todas as permissões
      };
    } else if (email === 'admin@tjpa.jus.br' && password === '123456') {
      userData = {
        id: '2',
        name: 'Administrador Sistema',
        email: 'admin@tjpa.jus.br',
        role: 'administrador',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        position: 'Administrador do Sistema',
        department: 'SOSFU',
        permissions: ['sosfu.*', 'users.view', 'reports.*', 'analysis.*']
      };
    } else if (email === 'suprido@tjpa.jus.br' && password === '123456') {
      userData = {
        id: '3',
        name: 'Servidor Suprido',
        email: 'suprido@tjpa.jus.br',
        role: 'suprido',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        position: 'Servidor Público',
        department: 'Administrativo',
        permissions: ['supply_funds.own', 'accounting.own', 'reimbursement.own']
      };
    } else if (email === 'fabio.freitas@tjpa.jus.br' && password === '123456') {
      userData = {
        id: '4',
        name: 'Fábio Freitas',
        email: 'fabio.freitas@tjpa.jus.br',
        role: 'administrador',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        position: 'Analista de Sistemas',
        department: 'Suprimento de Fundos',
        permissions: ['sosfu.*', 'users.view', 'reports.*', 'analysis.*']
      };
    } else if (email === 'servidor@tjpa.jus.br' && password === '123456') {
      userData = {
        id: '5',
        name: 'João Silva Santos',
        email: 'servidor@tjpa.jus.br',
        role: 'suprido',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        position: 'Analista Judiciário',
        department: 'Vara Criminal',
        permissions: ['supply_funds.own', 'accounting.own', 'reimbursement.own']
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

    // Super Admin tem todas as permissões
    if (user.role === 'super_admin') return true;

    // Verificar permissões específicas do usuário
    if (user.permissions?.includes('*')) return true;
    if (user.permissions?.includes(permission)) return true;

    // Verificar permissões com wildcard
    const hasWildcardPermission = user.permissions?.some(p => {
      if (p.endsWith('.*')) {
        const prefix = p.slice(0, -2);
        return permission.startsWith(prefix);
      }
      return false;
    });

    if (hasWildcardPermission) return true;

    // Sistema de permissões legado (fallback)
    const permissions = {
      super_admin: [
        'dashboard.full_access',
        'administration.full_access',
        'system.full_access',
        'users.manage',
        'users.create',
        'users.delete',
        'settings.manage',
        'sosfu.full_access',
        'supply_funds.manage',
        'accounting.manage',
        'reimbursement.manage',
        'profile.edit_all',
        'reports.all',
        'audit.full_access',
        'database.manage'
      ],
      administrador: [
        'dashboard.full_access',
        'users.view',
        'users.edit',
        'sosfu.full_access',
        'supply_funds.manage',
        'accounting.manage',
        'reimbursement.manage',
        'profile.edit_all',
        'reports.generate',
        'analysis.full_access'
      ],
      suprido: [
        'dashboard.personal_access',
        'supply_funds.access',
        'supply_funds.own',
        'accounting.access',
        'accounting.own',
        'reimbursement.access',
        'reimbursement.own',
        'profile.edit_own',
        'reports.own'
      ]
    };

    return permissions[user.role]?.includes(permission) || false;
  };

  // Verificar acesso a módulos específicos
  const canAccessModule = (module: string): boolean => {
    if (!user) return false;

    // Super Admin tem acesso a tudo
    if (user.role === 'super_admin') return true;

    const moduleAccess = {
      super_admin: [
        'dashboard',
        'supply-funds',
        'accounting-submission',
        'reimbursement-submission',
        'request-analysis',
        'accounting-analysis',
        'reimbursement-analysis',
        'users-management',
        'system-settings',
        'audit-logs',
        'database-management'
      ],
      administrador: [
        'dashboard',
        'supply-funds',
        'accounting-submission',
        'reimbursement-submission',
        'request-analysis',
        'accounting-analysis',
        'reimbursement-analysis',
        'users-management'
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

    if (user.role === 'super_admin') {
      return true; // Super Admin pode editar qualquer perfil
    }

    if (user.role === 'administrador') {
      return true; // Administrador pode editar qualquer perfil
    }

    if (user.role === 'suprido') {
      return !profileId || profileId === user.id; // Suprido só pode editar próprio perfil
    }

    return false;
  };

  // Funções auxiliares para verificação de tipo
  const getUserTypeLabel = (): string => {
    if (!user) return 'Visitante';
    
    switch (user.role) {
      case 'super_admin':
        return 'Super Administrador';
      case 'administrador':
        return 'Administrador';
      case 'suprido':
        return 'Suprido';
      default:
        return 'Usuário';
    }
  };

  const isSuperAdmin = (): boolean => user?.role === 'super_admin';
  const isAdmin = (): boolean => user?.role === 'administrador';
  const isSuprido = (): boolean => user?.role === 'suprido';

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
      canEditProfile,
      getUserTypeLabel,
      isSuperAdmin,
      isAdmin,
      isSuprido
    }}>
      {children}
    </AuthContext.Provider>
  );
};