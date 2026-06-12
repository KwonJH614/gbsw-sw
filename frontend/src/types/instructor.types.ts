export type ApplicationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface InstructorApplication {
  id: number;
  userId: number;
  bio: string;
  career: string;
  sampleVideoUrl: string;
  status: ApplicationStatus;
  rejectionReason?: string;
  createdAt: string;
}

export interface ApplyRequest {
  bio: string;
  career: string;
  sampleVideoUrl: string;
}

export type Level = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface InstructorCourse {
  id: number;
  title: string;
  description?: string;
  thumbnailUrl?: string;
  level: Level;
  enrollmentCount: number;
  avgRating: number;
  lessonCount: number;
}

export interface InstructorStats {
  courseCount: number;
  totalEnrollmentCount: number;
  avgRating: number;
}

export interface CreateCourseRequest {
  title: string;
  description?: string;
  thumbnailUrl?: string;
  level: Level;
}

export type UpdateCourseRequest = Partial<CreateCourseRequest>;
