import { useState, useEffect, useCallback } from 'react';
import { reviewApi } from '../api/review.api';
import { useAuthStore } from '../store/authStore';
import type { ReviewListData, ReviewItem } from '../types/review.types';

export function useReview(courseId: number) {
  const [data, setData] = useState<ReviewListData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const user = useAuthStore((s) => s.user);

  const fetchReviews = useCallback(async () => {
    try {
      const res = await reviewApi.getList(courseId);
      setData(res.data.data);
    } catch {} finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const myReview: ReviewItem | undefined = data?.reviews.find(
    (r) => r.userId === user?.id
  );

  const create = async (rating: number, content: string) => {
    setSubmitting(true);
    try {
      await reviewApi.create(courseId, { rating, content });
      await fetchReviews();
    } finally {
      setSubmitting(false);
    }
  };

  const update = async (reviewId: number, rating: number, content: string) => {
    setSubmitting(true);
    try {
      await reviewApi.update(reviewId, { rating, content });
      await fetchReviews();
    } finally {
      setSubmitting(false);
    }
  };

  const remove = async (reviewId: number) => {
    setSubmitting(true);
    try {
      await reviewApi.delete(reviewId);
      await fetchReviews();
    } finally {
      setSubmitting(false);
    }
  };

  return {
    reviews: data?.reviews ?? [],
    avgRating: data?.avgRating ?? 0,
    reviewCount: data?.reviewCount ?? 0,
    myReview,
    loading,
    submitting,
    create,
    update,
    remove,
  };
}
