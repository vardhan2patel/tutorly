import api from './api';

export const sendContactRequest = async (tutorId, message) => {
  const { data } = await api.post('/requests', { tutorId, message });
  return data;
};

export const getIncomingRequests = async () => {
  const { data } = await api.get('/requests/tutor');
  return data;
};

export const updateRequestStatus = async (requestId, status) => {
  const { data } = await api.put(`/requests/${requestId}/status`, { status });
  return data;
};
export const getMyRequests = async () => {
  const { data } = await api.get('/requests/me');
  return data;
};
