import client from './client';

export const qnaApi = {
  // 질문
  getQuestions: (courseId: number) =>
    client.get(`/courses/${courseId}/questions`),

  createQuestion: (courseId: number, data: { title: string; content: string }) =>
    client.post(`/courses/${courseId}/questions`, data),

  updateQuestion: (questionId: number, data: { title: string; content: string }) =>
    client.patch(`/questions/${questionId}`, data),

  deleteQuestion: (questionId: number) =>
    client.delete(`/questions/${questionId}`),

  // 답변
  createAnswer: (questionId: number, data: { content: string }) =>
    client.post(`/questions/${questionId}/answers`, data),

  updateAnswer: (answerId: number, data: { content: string }) =>
    client.patch(`/answers/${answerId}`, data),

  deleteAnswer: (answerId: number) =>
    client.delete(`/answers/${answerId}`),
};
