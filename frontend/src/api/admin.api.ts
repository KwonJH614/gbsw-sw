import apiClient from './client';

export interface AdminUser {
  id: number;
  email: string;
  nickname: string;
  role: string;
  suspended: boolean;
  createdAt: string;
}

export interface AdminCourse {
  id: number;
  title: string;
  instructorId: number;
  level: string;
  isVisible: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: number;
  adminId: number;
  action: string;
  targetType: string;
  targetId: number;
  memo: string;
  createdAt: string;
}

export interface AdminUserPage {
  content: AdminUser[];
  number: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export const listUsers = (q?: string, role?: string, suspended?: boolean, page = 0) =>
  apiClient.get<{ data: AdminUserPage }>('/admin/users', { params: { q, role, suspended, page, size: 20 } }).then(r => r.data.data);

export const changeUserRole = (id: number, role: string) =>
  apiClient.patch(`/admin/users/${id}/role`, { role });

export const suspendUser = (id: number, suspended: boolean) =>
  apiClient.patch(`/admin/users/${id}/suspend`, { suspended });

export const listAdminCourses = () =>
  apiClient.get<{ data: AdminCourse[] }>('/admin/courses').then(r => r.data.data);

export const setCourseVisibility = (id: number, visible: boolean) =>
  apiClient.patch(`/admin/courses/${id}/visibility`, { visible });

export const listAuditLogs = () =>
  apiClient.get<{ data: AuditLog[] }>('/admin/audit-logs').then(r => r.data.data);
