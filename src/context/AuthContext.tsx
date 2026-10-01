import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../lib/types';
import { DaloaService } from '../lib/supabase';
import { useToast } from './ToastContext';

interface AuthContextType {
  currentUser: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isVendor: boolean;
  signIn: (email: string, password?: string) => Promise<boolean>;
  signUp: (data: { email: string; password?: string; full_name: string; phone: string; role?: 'user' | 'vendor' }) => Promise<boolean>;
  signOut: () => Promise<void>;
  quickLoginAsAdmin: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const loadUser = async () => {
    try {
      const user = await DaloaService.getCurrentUser();
      setCurrentUser(user);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const signIn = async (email: string, password?: string): Promise<boolean> => {
    setLoading(true);
    const { user, error } = await DaloaService.signIn(email, password);
    setLoading(false);
    if (error || !user) {
      showToast(error || 'Connexion échouée.', 'error');
      return false;
    }
    setCurrentUser(user);
    showToast(`Bienvenue, ${user.full_name} !`, 'success');
    return true;
  };

  const signUp = async (data: {
    email: string;
    password?: string;
    full_name: string;
    phone: string;
    role?: 'user' | 'vendor';
  }): Promise<boolean> => {
    setLoading(true);
    const { user, error } = await DaloaService.signUp(data);
    setLoading(false);
    if (error || !user) {
      showToast(error || 'Erreur lors de l\'inscription.', 'error');
      return false;
    }
    setCurrentUser(user);
    showToast(`Compte créé avec succès ! Bienvenue sur Daloa Market.`, 'success');
    return true;
  };

  const signOut = async () => {
    await DaloaService.signOut();
    setCurrentUser(null);
    showToast('Vous avez été déconnecté.', 'info');
  };

  const quickLoginAsAdmin = async () => {
    await signIn('admin@daloamarket.ci', 'Admin123!');
  };

  const isAdmin = currentUser?.email.toLowerCase() === 'admin@daloamarket.ci' || currentUser?.role === 'admin';
  const isVendor = currentUser?.role === 'vendor' || isAdmin;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        isAdmin,
        isVendor,
        signIn,
        signUp,
        signOut,
        quickLoginAsAdmin,
        refreshUser: loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
