import api from './api';

export const createReview = async (tutorId, rating, comment) => {
  const { data } = await api.post('/reviews', { tutorId, rating, comment });
  return data;
};

export const getTutorReviews = async (tutorId) => {
  const { data } = await api.get(`/reviews/tutor/${tutorId}`);
  return data;
};
