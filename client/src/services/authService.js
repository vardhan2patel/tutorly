import api from './api';

export const login = async (email, password) => {
  const { data } = await api.post('/users/auth', { email, password });
  return data;
};

export const register = async (userData) => {
  const { data } = await api.post('/users', userData);
  return data;
};

export const logout = async () => {
  const { data } = await api.post('/users/logout');
  return data;
};

export const getProfile = async () => {
  const { data } = await api.get('/users/profile');
  return data;
};
