import api from './api';

export const getNearbyTutors = async (lat, lng, filters = {}) => {
  const { subject, classLevel, maxDistance } = filters;
  let url = `/tutors/nearby?lat=${lat}&lng=${lng}`;
  
  if (subject) url += `&subject=${subject}`;
  if (classLevel) url += `&classLevel=${classLevel}`;
  if (maxDistance) url += `&maxDistance=${maxDistance}`;

  const { data } = await api.get(url);
  return data;
};

export const getTutorById = async (id) => {
  const { data } = await api.get(`/tutors/${id}`);
  return data;
};

export const updateTutorProfile = async (profileData) => {
  const { data } = await api.post('/tutors/profile', profileData);
  return data;
};

export const getMyTutorProfile = async () => {
  const { data } = await api.get('/tutors/profile/me');
  return data;
};
