import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for saved auth data
    const savedUser = localStorage.getItem('portfolio_user');
    const savedToken = localStorage.getItem('portfolio_token');
    
    if (savedUser && savedToken) {
      try {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
        api.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
      } catch {
        localStorage.removeItem('portfolio_user');
        localStorage.removeItem('portfolio_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token, ...userData } = response.data;
    
    setUser(userData);
    localStorage.setItem('portfolio_user', JSON.stringify(userData));
    localStorage.setItem('portfolio_token', token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('portfolio_user');
    localStorage.removeItem('portfolio_token');
    delete api.defaults.headers.common['Authorization'];
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
