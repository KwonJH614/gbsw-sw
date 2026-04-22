export interface RoadmapListItem {
  id: number;
  title: string;
  description: string;
  level: string;
  thumbnailUrl: string;
  courseCount: number;
}

export interface RoadmapCourse {
  courseId: number;
  title: string;
  thumbnailUrl: string;
  level: string;
  instructorName: string;
  orderIndex: number;
  lessonCount: number;
}

export interface RoadmapDetail {
  id: number;
  title: string;
  description: string;
  level: string;
  thumbnailUrl: string;
  courses: RoadmapCourse[];
}
