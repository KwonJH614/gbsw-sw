import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { courseApi } from '../../api/course.api';
import { progressApi } from '../../api/progress.api';
import Badge from '../../components/common/Badge';
import StarRating from '../../components/common/StarRating';
import ReviewList from '../../components/review/ReviewList';
import ReviewForm from '../../components/review/ReviewForm';
import QnaSection from '../../components/qna/QnaSection';
import { useEnrollment } from '../../hooks/useEnrollment';
import { useReview } from '../../hooks/useReview';
import { useAuthStore } from '../../store/authStore';
import { useProgressStore } from '../../store/progressStore';
import type { CourseDetail } from '../../types/course.types';
import type { LessonProgress } from '../../types/progress.types';
import type { ReviewItem } from '../../types/review.types';

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<ReviewItem | undefined>(undefined);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const courseId = Number(id);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { enrolled, loading: enrollLoading, enroll, cancel } = useEnrollment(courseId);
  const { lessonProgressMap, setCourseProgresses } = useProgressStore();
  const {
    reviews,
    avgRating,
    reviewCount,
    myReview,
    submitting,
    create: createReview,
    update: updateReview,
    remove: removeReview,
  } = useReview(courseId);

  useEffect(() => {
    if (!id) return;
    courseApi.getDetail(courseId)
      .then((res) => setCourse(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!enrolled || !id) return;
    const fetchProgress = () => {
      progressApi.getCourseProgress(courseId)
        .then((res) => setCourseProgresses(res.data.data.lessons))
        .catch(() => {});
    };
    fetchProgress();

    // 페이지로 돌아올 때마다 진도 갱신
    const handleFocus = () => fetchProgress();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [enrolled, id]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="text-text-secondary">로딩 중...</span>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="text-text-secondary">강의를 찾을 수 없습니다.</span>
      </div>
    );
  }

  const totalDuration = course.lessons.reduce((sum, l) => sum + (l.duration ?? 0), 0);
  const hours = Math.floor(totalDuration / 60);
  const minutes = totalDuration % 60;

  const completedLessons = course.lessons.filter(
    (l) => lessonProgressMap[l.id]?.completed
  ).length;
  const completionRate =
    course.lessons.length > 0
      ? Math.round((completedLessons / course.lessons.length) * 100)
      : 0;
  const isCourseCompleted =
    course.lessons.length > 0 && completedLessons === course.lessons.length;

  const canWriteReview = isAuthenticated && enrolled && isCourseCompleted && !myReview;

  const handleReviewSubmit = async (rating: number, content: string) => {
    if (editingReview) {
      await updateReview(editingReview.id, rating, content);
      setEditingReview(undefined);
    } else {
      await createReview(rating, content);
    }
    setShowReviewForm(false);
  };

  const handleReviewEdit = (review: ReviewItem) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleReviewDelete = async (reviewId: number) => {
    if (confirm('리뷰를 삭제하시겠습니까?')) {
      await removeReview(reviewId);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* 강의 헤더 */}
      <div className="mb-8 flex flex-col gap-6 md:flex-row">
        {course.thumbnailUrl && (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full rounded-2xl object-cover md:h-56 md:w-80"
          />
        )}

        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <Badge level={course.level} />
          </div>
          <h1 className="mb-2 text-2xl font-bold">{course.title}</h1>
          <p className="mb-4 text-text-secondary">{course.description}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-text-secondary">
            <span>{course.instructor.nickname}</span>
            <span>{course.lessons.length}개 레슨</span>
            {totalDuration > 0 && (
              <span>
                총 {hours > 0 ? `${hours}시간 ` : ''}{minutes}분
              </span>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <StarRating rating={avgRating} size="md" />
            <span className="text-sm font-medium">
              {avgRating.toFixed(1)}
            </span>
            <span className="text-sm text-text-secondary">
              ({reviewCount}개 리뷰)
            </span>
          </div>

          {/* 수강 신청 버튼 */}
          <div className="mt-4">
            {!isAuthenticated ? (
              <Link
                to="/login"
                className="inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                로그인 후 수강 신청
              </Link>
            ) : enrolled ? (
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-success/10 px-4 py-2.5 text-sm font-semibold text-success">
                  수강 중 · {completionRate}% 완료
                </span>
                <button
                  onClick={cancel}
                  disabled={enrollLoading}
                  className="rounded-lg border border-error/30 px-4 py-2.5 text-sm text-error hover:bg-error/5 disabled:opacity-50"
                >
                  수강 취소
                </button>
              </div>
            ) : (
              <button
                onClick={enroll}
                disabled={enrollLoading}
                className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
              >
                {enrollLoading ? '처리 중...' : '수강 신청'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 강사 정보 */}
      <section className="mb-8 rounded-xl border border-border bg-surface p-5">
        <h2 className="mb-2 text-lg font-bold">강사</h2>
        <p className="font-medium">{course.instructor.nickname}</p>
        {course.instructor.bio && (
          <p className="mt-1 text-sm text-text-secondary">{course.instructor.bio}</p>
        )}
        {course.instructor.career && (
          <p className="mt-1 text-sm text-text-secondary">{course.instructor.career}</p>
        )}
      </section>

      {/* 레슨 목록 */}
      <section className="mb-8">
        <h2 className="mb-4 text-lg font-bold">
          레슨 목록 ({course.lessons.length})
          {enrolled && completedLessons > 0 && (
            <span className="ml-2 text-sm font-normal text-text-secondary">
              {completedLessons}/{course.lessons.length} 완료
            </span>
          )}
        </h2>

        <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
          {course.lessons
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((lesson) => {
              const progress: LessonProgress | undefined = lessonProgressMap[lesson.id];
              const isCompleted = progress?.completed ?? false;

              return (
                <li key={lesson.id}>
                  <Link
                    to={`/courses/${course.id}/lessons/${lesson.id}`}
                    className="flex items-center justify-between px-5 py-4 transition hover:bg-bg"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                          isCompleted
                            ? 'bg-success text-white'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {isCompleted ? '✓' : lesson.orderIndex}
                      </span>
                      <span className="text-sm font-medium">{lesson.title}</span>
                    </div>
                    {lesson.duration != null && (
                      <span className="text-xs text-text-secondary">
                        {lesson.duration}분
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
        </ul>
      </section>

      {/* 리뷰 섹션 */}
      <section>
        {/* 리뷰 작성 버튼/폼 */}
        {canWriteReview && !showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="mb-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            리뷰 작성하기
          </button>
        )}

        {showReviewForm && (
          <div className="mb-6">
            <ReviewForm
              existingReview={editingReview}
              submitting={submitting}
              onSubmit={handleReviewSubmit}
              onCancel={() => {
                setShowReviewForm(false);
                setEditingReview(undefined);
              }}
            />
          </div>
        )}

        <ReviewList
          reviews={reviews}
          avgRating={avgRating}
          reviewCount={reviewCount}
          onEdit={handleReviewEdit}
          onDelete={handleReviewDelete}
        />
      </section>

      {/* 질의응답 섹션 */}
      <section className="mt-8">
        <QnaSection courseId={courseId} enrolled={enrolled} />
      </section>
    </div>
  );
}
