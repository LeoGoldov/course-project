// frontend/src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));

  // Настройка axios при изменении токена
  useEffect(() => {
    if (accessToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      console.log('Token set in axios headers');  // Для отладки
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [accessToken]);

  // Загрузка профиля
  useEffect(() => {
    const loadProfile = async () => {
      if (!accessToken) {
        setLoading(false);
        return;
      }

      try {
        console.log('Loading profile with token:', accessToken.substring(0, 20) + '...');
        const response = await axios.get('/api/auth/profile/');
        console.log('Profile loaded:', response.data);
        setUser(response.data);
      } catch (error) {
        console.error('Profile load error:', error.response?.status, error.response?.data);
        // Если 401 — токен невалидный
        if (error.response?.status === 401) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          setAccessToken(null);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [accessToken]);

  const login = async (username, password) => {
    try {
      const response = await axios.post('/api/auth/login/', { username, password });
      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      setAccessToken(access);

      // Загружаем профиль после логина
      const profileResponse = await axios.get('/api/auth/profile/');
      setUser(profileResponse.data);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error.response?.data);
      return { success: false, error: error.response?.data?.detail || 'Ошибка входа' };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register/', userData);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Register error:', error.response?.data);
      return { success: false, error: error.response?.data || 'Ошибка регистрации' };
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAccessToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
  };

  const refreshToken = async () => {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) return null;
    try {
      const response = await axios.post('/api/auth/token/refresh/', { refresh });
      const { access } = response.data;
      localStorage.setItem('accessToken', access);
      setAccessToken(access);
      return access;
    } catch (error) {
      console.error('Refresh error:', error);
      logout();
      return null;
    }
  };

  // Перехватчик для обновления токена
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const newToken = await refreshToken();
          if (newToken) {
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            return axios(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};