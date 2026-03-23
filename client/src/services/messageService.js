import api from './api';

export const getMessages = async (requestId) => {
  const { data } = await api.get(`/messages/${requestId}`);
  return data;
};

export const sendMessage = async (requestId, content) => {
  const { data } = await api.post('/messages', { requestId, content });
  return data;
};
