export interface ReviewItem {
  id: number;
  userId: number;
  nickname: string;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewListData {
  avgRating: number;
  reviewCount: number;
  reviews: ReviewItem[];
}

export interface ReviewRequest {
  rating: number;
  content: string;
}
