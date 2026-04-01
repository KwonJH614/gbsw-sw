import StarRating from '../common/StarRating';
import { useAuthStore } from '../../store/authStore';
import type { ReviewItem } from '../../types/review.types';

interface ReviewListProps {
  reviews: ReviewItem[];
  avgRating: number;
  reviewCount: number;
  onEdit?: (review: ReviewItem) => void;
  onDelete?: (reviewId: number) => void;
}

export default function ReviewList({
  reviews,
  avgRating,
  reviewCount,
  onEdit,
  onDelete,
}: ReviewListProps) {
  const user = useAuthStore((s) => s.user);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div>
      {/* 헤더 */}
      <div className="mb-4 flex items-center gap-3">
        <h2 className="text-lg font-bold">수강 후기</h2>
        <div className="flex items-center gap-1.5">
          <StarRating rating={avgRating} size="md" />
          <span className="text-sm font-medium">{avgRating.toFixed(1)}</span>
          <span className="text-sm text-text-secondary">({reviewCount}개)</span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <p className="rounded-xl border border-border bg-surface p-6 text-center text-sm text-text-secondary">
          아직 작성된 리뷰가 없습니다.
        </p>
      ) : (
        <ul className="space-y-3">
          {reviews.map((review) => {
            const isMine = user?.id === review.userId;

            return (
              <li
                key={review.id}
                className="rounded-xl border border-border bg-surface p-4"
              >
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">{review.nickname}</span>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-secondary">
                      {formatDate(review.createdAt)}
                    </span>
                    {isMine && (
                      <>
                        <button
                          onClick={() => onEdit?.(review)}
                          className="text-xs text-primary hover:underline"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => onDelete?.(review.id)}
                          className="text-xs text-error hover:underline"
                        >
                          삭제
                        </button>
                      </>
                    )}
                  </div>
                </div>
                <p className="text-sm text-text">{review.content}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
