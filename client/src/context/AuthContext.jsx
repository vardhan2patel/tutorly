import React, { createContext, useContext, useState, useEffect } from 'react';
import { login, register, logout, getProfile } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
          setUser(JSON.parse(userInfo));
          // Verify cookie is still valid
          const profile = await getProfile();
          setUser(profile);
          localStorage.setItem('userInfo', JSON.stringify(profile));
        }
      } catch (error) {
        console.error('Session expired or invalid token');
        setUser(null);
        localStorage.removeItem('userInfo');
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const loginUser = async (email, password) => {
    const data = await login(email, password);
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  const registerUser = async (userData) => {
    const data = await register(userData);
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
  };

  const logoutUser = async () => {
    await logout();
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, registerUser, logoutUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
