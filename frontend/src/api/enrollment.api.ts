import client from './client';

export const enrollmentApi = {
  enroll: (courseId: number) =>
    client.post('/enrollments', { courseId }),

  getMyEnrollments: () =>
    client.get('/enrollments/me'),

  cancel: (enrollmentId: number) =>
    client.delete(`/enrollments/${enrollmentId}`),

  checkEnrollment: (courseId: number) =>
    client.get('/enrollments/check', { params: { courseId } }),
};
