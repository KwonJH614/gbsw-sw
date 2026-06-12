export interface Lesson {
  id: number;
  title: string;
  videoUrl: string;
  duration: number;
  orderIndex: number;
}

export interface CreateLessonRequest {
  title: string;
  videoUrl: string;
  duration: number;
}

export interface UpdateLessonRequest {
  title?: string;
  videoUrl?: string;
  duration?: number;
}

export interface ReorderRequest {
  lessonId: number;
  orderIndex: number;
}
