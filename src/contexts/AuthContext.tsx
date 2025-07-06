import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signup: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // In a real app, validate token with backend
          const mockUser: User = {
            id: '1',
            full_name: 'John Doe',
            email: 'john@example.com',
            user_type: 'business',
            company_name: 'Tech Solutions Inc.',
            created_at: new Date(),
            updated_at: new Date(),
          };
          setAuthState({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe = false) => {
    try {
      // Mock login - in real app, call your authentication API
      const mockUser: User = {
        id: '1',
        full_name: 'John Doe',
        email: email,
        user_type: 'business',
        company_name: 'Tech Solutions Inc.',
        created_at: new Date(),
        updated_at: new Date(),
      };

      localStorage.setItem('auth_token', 'mock_token_123');
      if (rememberMe) {
        localStorage.setItem('remember_me', 'true');
      }

      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      throw new Error('Login failed');
    }
  };

  const signup = async (userData: any) => {
    try {
      // Mock signup - in real app, call your registration API
      const newUser: User = {
        id: Date.now().toString(),
        full_name: userData.fullName,
        email: userData.email,
        user_type: userData.userType,
        company_name: userData.companyName,
        gst_number: userData.gstNumber,
        billing_address: userData.billingAddress,
        created_at: new Date(),
        updated_at: new Date(),
      };

      localStorage.setItem('auth_token', 'mock_token_123');
      
      setAuthState({
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      throw new Error('Signup failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('remember_me');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      if (authState.user) {
        const updatedUser = { ...authState.user, ...userData, updated_at: new Date() };
        setAuthState(prev => ({
          ...prev,
          user: updatedUser,
        }));
      }
    } catch (error) {
      throw new Error('Profile update failed');
    }
  };

  return (
    <AuthContext.Provider value={{
      ...authState,
      login,
      signup,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};