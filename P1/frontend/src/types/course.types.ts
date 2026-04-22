export interface CourseListItem {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  level: string;
  instructorName: string;
  lessonCount: number;
  avgRating: number;
  reviewCount: number;
}

export interface Instructor {
  id: number;
  nickname: string;
  bio: string;
  career: string;
}

export interface Lesson {
  id: number;
  title: string;
  videoUrl: string;
  duration: number;
  orderIndex: number;
}

export interface CourseDetail {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  level: string;
  instructor: Instructor;
  lessons: Lesson[];
  avgRating: number;
  reviewCount: number;
}
