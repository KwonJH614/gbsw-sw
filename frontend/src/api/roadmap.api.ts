import client from './client';
import type { ApiResponse } from '../types/auth.types';
import type { RoadmapListItem, RoadmapDetail } from '../types/roadmap.types';
import type { RoadmapProgress } from '../types/progress.types';

export const roadmapApi = {
  getList: () =>
    client.get<ApiResponse<RoadmapListItem[]>>('/roadmaps'),

  getDetail: (id: number) =>
    client.get<ApiResponse<RoadmapDetail>>(`/roadmaps/${id}`),

  getProgress: (id: number) =>
    client.get<ApiResponse<RoadmapProgress>>(`/roadmaps/${id}/progress`),
};
