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
