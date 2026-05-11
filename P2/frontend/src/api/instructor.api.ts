import client from './client';
import type {
  CreateCourseRequest,
  InstructorCourse,
  InstructorStats,
  UpdateCourseRequest,
} from '../types/instructor.types';
import type {
  CreateLessonRequest,
  Lesson,
  ReorderRequest,
  UpdateLessonRequest,
} from '../types/lesson.types';
import type { ApiResponse } from '../types/auth.types';

export const instructorApi = {
  getMyCourses: () =>
    client.get<ApiResponse<InstructorCourse[]>>('/instructor/courses'),

  getStats: () =>
    client.get<ApiResponse<InstructorStats>>('/instructor/stats'),

  createCourse: (data: CreateCourseRequest) =>
    client.post<ApiResponse<InstructorCourse>>('/instructor/courses', data),

  updateCourse: (courseId: number, data: UpdateCourseRequest) =>
    client.patch<ApiResponse<InstructorCourse>>(`/instructor/courses/${courseId}`, data),

  deleteCourse: (courseId: number) =>
    client.delete<ApiResponse<null>>(`/instructor/courses/${courseId}`),

  getLessons: (courseId: number) =>
    client.get<ApiResponse<Lesson[]>>(`/instructor/courses/${courseId}/lessons`),

  createLesson: (courseId: number, data: CreateLessonRequest) =>
    client.post<ApiResponse<Lesson>>(`/instructor/courses/${courseId}/lessons`, data),

  updateLesson: (lessonId: number, data: UpdateLessonRequest) =>
    client.patch<ApiResponse<Lesson>>(`/instructor/lessons/${lessonId}`, data),

  deleteLesson: (lessonId: number) =>
    client.delete<ApiResponse<null>>(`/instructor/lessons/${lessonId}`),

  reorderLessons: (courseId: number, items: ReorderRequest[]) =>
    client.patch<ApiResponse<Lesson[]>>(`/instructor/courses/${courseId}/lessons/reorder`, items),
};
