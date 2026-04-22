export interface LessonProgress {
  lessonId: number;
  lessonTitle: string;
  orderIndex: number;
  lastPosition: number;
  duration: number;
  completed: boolean;
}

export interface CourseProgress {
  courseId: number;
  totalLessons: number;
  completedLessons: number;
  completionRate: number;
  lessons: LessonProgress[];
}

export interface RoadmapProgress {
  roadmapId: number;
  totalCourses: number;
  completedCourses: number;
  completionRate: number;
  courses: CourseProgressItem[];
}

export interface CourseProgressItem {
  courseId: number;
  title: string;
  totalLessons: number;
  completedLessons: number;
  completionRate: number;
  enrolled: boolean;
}
