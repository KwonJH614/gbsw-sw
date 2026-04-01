import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentApi } from '../../api/enrollment.api';
import { useAuthStore } from '../../store/authStore';
import Badge from '../../components/common/Badge';
import type { EnrollmentItem } from '../../types/enrollment.types';

export default function MyPage() {
  const [enrollments, setEnrollments] = useState<EnrollmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((s) => s.user);

  const fetchEnrollments = async () => {
    try {
      const res = await enrollmentApi.getMyEnrollments();
      setEnrollments(res.data.data);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleCancel = async (enrollmentId: number) => {
    if (!confirm('수강을 취소하시겠습니까?')) return;
    try {
      await enrollmentApi.cancel(enrollmentId);
      setEnrollments((prev) => prev.filter((e) => e.id !== enrollmentId));
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string } } } };
      alert(error.response?.data?.error?.message ?? '수강 취소에 실패했습니다.');
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">마이페이지</h1>
      {user && (
        <p className="mb-8 text-text-secondary">
          {user.nickname} ({user.email})
        </p>
      )}

      <h2 className="mb-4 text-xl font-bold">
        내 수강 목록
        {enrollments.length > 0 && (
          <span className="ml-2 text-sm font-normal text-text-secondary">
            {enrollments.length}개 강의
          </span>
        )}
      </h2>

      {loading ? (
        <div className="flex min-h-[20vh] items-center justify-center">
          <span className="text-text-secondary">로딩 중...</span>
        </div>
      ) : enrollments.length === 0 ? (
        <div className="rounded-xl border border-border bg-surface p-8 text-center">
          <p className="mb-3 text-text-secondary">수강 중인 강의가 없습니다.</p>
          <Link
            to="/courses"
            className="inline-block rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary-dark"
          >
            강의 둘러보기
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {enrollments.map((e) => {
            const rate = Math.round(e.completionRate);
            const isComplete = rate === 100;

            return (
              <li
                key={e.id}
                className="rounded-xl border border-border bg-surface p-4"
              >
                <div className="flex items-center gap-4">
                  {e.courseThumbnailUrl && (
                    <Link to={`/courses/${e.courseId}`}>
                      <img
                        src={e.courseThumbnailUrl}
                        alt={e.courseTitle}
                        className="h-20 w-32 shrink-0 rounded-lg object-cover"
                      />
                    </Link>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <Badge level={e.level} />
                      <span className="text-xs text-text-secondary">
                        {e.lessonCount}개 레슨
                      </span>
                    </div>
                    <Link
                      to={`/courses/${e.courseId}`}
                      className="block truncate font-semibold hover:text-primary"
                    >
                      {e.courseTitle}
                    </Link>
                    <p className="text-xs text-text-secondary">{e.instructorName}</p>

                    {/* 진도율 바 */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isComplete ? 'bg-success' : 'bg-primary'
                          }`}
                          style={{ width: `${rate}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-text-secondary">
                        {rate}%
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleCancel(e.id)}
                    className="shrink-0 rounded-lg border border-error/30 px-3 py-1.5 text-xs text-error hover:bg-error/5"
                  >
                    취소
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
