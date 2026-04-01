import client from './client';

export const reviewApi = {
  getList: (courseId: number) =>
    client.get(`/courses/${courseId}/reviews`),

  create: (courseId: number, data: { rating: number; content: string }) =>
    client.post(`/courses/${courseId}/reviews`, data),

  update: (reviewId: number, data: { rating: number; content: string }) =>
    client.patch(`/reviews/${reviewId}`, data),

  delete: (reviewId: number) =>
    client.delete(`/reviews/${reviewId}`),
};
