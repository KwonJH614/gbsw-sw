import apiClient from './client';
import type { InstructorApplication, ApplyRequest } from '../types/instructor.types';

export const applyInstructor = (data: ApplyRequest) =>
  apiClient.post<{ data: InstructorApplication }>('/instructor-applications', data).then(r => r.data.data);

export const getMyApplication = () =>
  apiClient.get<{ data: InstructorApplication | null }>('/instructor-applications/me').then(r => r.data.data);

export const listApplications = (status?: string) =>
  apiClient.get<{ data: InstructorApplication[] }>('/instructor-applications', {
    params: status ? { status } : {},
  }).then(r => r.data.data);

export const approveApplication = (id: number) =>
  apiClient.post(`/instructor-applications/${id}/approve`);

export const rejectApplication = (id: number, reason: string) =>
  apiClient.post(`/instructor-applications/${id}/reject`, { reason });
