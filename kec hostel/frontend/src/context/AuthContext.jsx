import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('kec_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('kec_auth_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If token exists, verify session with backend
    if (token) {
      axiosClient
        .get('/auth/me')
        .then((res) => {
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('kec_auth_user', JSON.stringify(res.user));
          }
        })
        .catch(() => {
          logout();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [token]);

  /**
   * Login function supporting student login (roll_number, room_number, password)
   * and administrative login (identifier, password, role)
   */
  const login = async (credentials) => {
    try {
      let payload = credentials;
      // Handle legacy positional arguments if passed
      if (typeof credentials === 'string') {
        const identifier = arguments[0];
        const password = arguments[1];
        const role = arguments[2];
        payload = { identifier, password, role };
      }

      const res = await axiosClient.post('/auth/login', payload);
      if (res.success && res.token) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('kec_auth_token', res.token);
        localStorage.setItem('kec_auth_user', JSON.stringify(res.user));
        return { success: true, message: res.message, user: res.user };
      }
      return { success: false, message: res.message || 'Login failed' };
    } catch (err) {
      return {
        success: false,
        message: err.message || 'Invalid roll number, room number or password.'
      };
    }
  };

  /**
   * Register new student in SQLite database
   */
  const register = async (formData) => {
    try {
      const res = await axiosClient.post('/auth/register', formData);
      if (res.success) {
        return { success: true, message: res.message, user: res.user };
      }
      return { success: false, message: res.message || 'Registration failed' };
    } catch (err) {
      return {
        success: false,
        message: err.message || 'Registration failed. Please verify your details.'
      };
    }
  };

  /**
   * Logout function
   */
  const logout = async () => {
    try {
      await axiosClient.post('/auth/logout');
    } catch (err) {
      // Ignore network errors on logout
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('kec_auth_token');
    localStorage.removeItem('kec_auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
