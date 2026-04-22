import client from './client';
import type { ApiResponse } from '../types/auth.types';
import type { CourseListItem, CourseDetail } from '../types/course.types';

export const courseApi = {
  getList: () =>
    client.get<ApiResponse<CourseListItem[]>>('/courses'),

  getDetail: (id: number) =>
    client.get<ApiResponse<CourseDetail>>(`/courses/${id}`),

  search: (q: string) =>
    client.get<ApiResponse<CourseListItem[]>>('/courses/search', { params: { q } }),
};
