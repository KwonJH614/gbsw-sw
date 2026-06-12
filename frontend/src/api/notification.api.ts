import apiClient from './client';

export interface NotificationSubscription {
  subscribed: boolean;
  channel: string;
  lastTestedAt: string | null;
}

export interface NotificationDeliveryLog {
  id: number;
  userId: number;
  nickname: string;
  notificationType: string;
  status: 'SUCCESS' | 'FAILED';
  failureReason: string | null;
  sentAt: string;
}

export interface PageResponse<T> {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface JobResult {
  targets: number;
  success: number;
  failed: number;
  skipped: number;
}

export const notificationApi = {
  getSubscription: () =>
    apiClient.get<{ data: NotificationSubscription }>('/notifications/subscription').then(r => r.data.data),
  subscribe: (webhookUrl: string) =>
    apiClient.put<{ data: NotificationSubscription }>('/notifications/subscription', { webhookUrl }).then(r => r.data.data),
  test: () => apiClient.post('/notifications/subscription/test'),
  unsubscribe: () => apiClient.delete('/notifications/subscription'),
  getLogs: (page = 0, status?: string) =>
    apiClient.get<{ data: PageResponse<NotificationDeliveryLog> }>('/admin/notification-logs', {
      params: { page, size: 20, status: status || undefined },
    }).then(r => r.data.data),
  runLearningReminder: () =>
    apiClient.post<{ data: JobResult }>('/admin/notification-jobs/learning-reminder').then(r => r.data.data),
};
