import apiClient from './client';

export interface DashboardOverview {
  stats: {
    activeCourses: number;
    completedCourses: number;
    totalWatchedMinutes: number;
    reviewsWritten: number;
  };
  recentCourses: {
    courseId: number;
    title: string;
    thumbnailUrl: string;
    lastLessonId: number;
    watchedSeconds: number;
  }[];
  roadmapProgress: {
    roadmapId: number;
    title: string;
    completionRate: number;
  }[];
}

export interface Activity {
  type: 'PROGRESS' | 'COMPLETED' | 'REVIEW';
  message: string;
  occurredAt: string;
}

export const getDashboardOverview = () =>
  apiClient.get<{ data: DashboardOverview }>('/dashboard/overview').then(r => r.data.data);

export const getDashboardActivities = (limit = 10) =>
  apiClient.get<{ data: Activity[] }>('/dashboard/activities', { params: { limit } }).then(r => r.data.data);
