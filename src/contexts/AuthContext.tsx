
import React, { createContext, useContext, useState, useEffect } from 'react';

// Types
type UserRole = 'athlete' | 'parent';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  childrenIds?: string[]; // Only relevant for parent users
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@example.com',
    role: 'athlete',
    avatar: 'https://i.pravatar.cc/150?img=11',
  },
  {
    id: '2',
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    role: 'parent',
    avatar: 'https://i.pravatar.cc/150?img=5',
    childrenIds: ['1'],
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth in localStorage
    const storedUser = localStorage.getItem('barefoot_user');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('barefoot_user', JSON.stringify(foundUser));
    } else {
      throw new Error('Invalid credentials');
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('barefoot_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
