import { createContext, useContext, useState } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helper to parse JWT payload for user basic info
  const parseJwt = (tokenStr) => {
    try {
      const base64Url = tokenStr.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  };

  // Perform login
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(email, password);
      const jwtToken = data.token;
      const decodedUser = parseJwt(jwtToken);

      setToken(jwtToken);
      setUser(decodedUser);

      localStorage.setItem('token', jwtToken);
      if (decodedUser) {
        localStorage.setItem('user', JSON.stringify(decodedUser));
      }

      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || 'Login failed. Please check credentials.';
      setError(message);
      return { success: false, message };
    }
  };

  // Perform registration
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      await authService.register(userData);
      setLoading(false);
      return { success: true };
    } catch (err) {
      setLoading(false);
      const message = err.response?.data || err.response?.data?.message || 'Registration failed.';
      setError(typeof message === 'string' ? message : 'Registration failed.');
      return { success: false, message: typeof message === 'string' ? message : 'Registration failed.' };
    }
  };

  // Perform password update
  const updatePassword = async (currentPassword, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.updatePassword(currentPassword, newPassword);
      if (data?.token) {
        setToken(data.token);
        localStorage.setItem('token', data.token);
        const decodedUser = parseJwt(data.token);
        if (decodedUser) {
          setUser(decodedUser);
          localStorage.setItem('user', JSON.stringify(decodedUser));
        }
      }
      setLoading(false);
      return { success: true, message: data?.message || 'Password updated successfully.' };
    } catch (err) {
      setLoading(false);
      const message = err.response?.data?.message || err.response?.data || 'Failed to update password.';
      const errMsg = typeof message === 'string' ? message : 'Failed to update password.';
      setError(errMsg);
      return { success: false, message: errMsg };
    }
  };

  // Perform logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        error,
        isAuthenticated: !!token,
        login,
        register,
        updatePassword,
        logout,
        setError
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
