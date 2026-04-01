import { useState, useEffect } from 'react';
import StarRating from '../common/StarRating';
import type { ReviewItem } from '../../types/review.types';

interface ReviewFormProps {
  existingReview?: ReviewItem;
  submitting: boolean;
  onSubmit: (rating: number, content: string) => void;
  onCancel?: () => void;
}

export default function ReviewForm({
  existingReview,
  submitting,
  onSubmit,
  onCancel,
}: ReviewFormProps) {
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [content, setContent] = useState(existingReview?.content ?? '');

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating);
      setContent(existingReview.content);
    }
  }, [existingReview]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !content.trim()) return;
    onSubmit(rating, content.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-3 font-semibold">
        {existingReview ? '리뷰 수정' : '리뷰 작성'}
      </h3>

      <div className="mb-3">
        <label className="mb-1 block text-sm text-text-secondary">별점</label>
        <StarRating rating={rating} size="md" editable onChange={setRating} />
      </div>

      <div className="mb-3">
        <label className="mb-1 block text-sm text-text-secondary">내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={3}
          placeholder="강의에 대한 솔직한 후기를 작성해 주세요."
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting || rating === 0 || !content.trim()}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
        >
          {submitting ? '저장 중...' : existingReview ? '수정' : '등록'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-bg"
          >
            취소
          </button>
        )}
      </div>
    </form>
  );
}
