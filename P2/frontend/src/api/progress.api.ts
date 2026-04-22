import client from './client';

export const progressApi = {
  save: (lessonId: number, lastPosition: number) =>
    client.post('/progress', { lessonId, lastPosition }),

  getCourseProgress: (courseId: number) =>
    client.get(`/progress/courses/${courseId}`),
};
