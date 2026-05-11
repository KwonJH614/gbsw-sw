import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { instructorApi } from '../../api/instructor.api';
import type { InstructorCourse, InstructorStats } from '../../types/instructor.types';
import InstructorCourseCard from '../../components/instructor/InstructorCourseCard';

export default function InstructorDashboardPage() {
  const [stats, setStats] = useState<InstructorStats | null>(null);
  const [courses, setCourses] = useState<InstructorCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [statsRes, coursesRes] = await Promise.all([
          instructorApi.getStats(),
          instructorApi.getMyCourses(),
        ]);
        if (cancelled) return;
        setStats(statsRes.data.data);
        setCourses(coursesRes.data.data);
      } catch (err) {
        if (cancelled) return;
        if (isAxiosError(err) && err.response?.data?.error) {
          setError(err.response.data.error.message);
        } else {
          setError('데이터를 불러오지 못했습니다.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (courseId: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;
    try {
      await instructorApi.deleteCourse(courseId);
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.error) {
        alert(err.response.data.error.message);
      } else {
        alert('삭제에 실패했습니다.');
      }
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-text-secondary">불러오는 중…</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-error">{error}</div>;
  }

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text">강사 대시보드</h1>
        <Link
          to="/instructor/courses/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          + 새 강의
        </Link>
      </div>

      {stats && (
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="text-sm text-text-secondary">내 강의 수</div>
            <div className="mt-1 text-2xl font-bold text-text">{stats.courseCount}</div>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="text-sm text-text-secondary">총 수강생 수</div>
            <div className="mt-1 text-2xl font-bold text-text">{stats.totalEnrollmentCount}</div>
          </div>
          <div className="rounded-lg border border-border bg-surface p-4">
            <div className="text-sm text-text-secondary">평균 별점</div>
            <div className="mt-1 text-2xl font-bold text-text">{stats.avgRating.toFixed(1)}</div>
          </div>
        </div>
      )}

      <h2 className="mb-3 text-lg font-semibold text-text">내 강의 목록</h2>
      {courses.length === 0 ? (
        <div className="rounded-lg border border-border bg-surface p-8 text-center text-text-secondary">
          아직 등록한 강의가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c) => (
            <InstructorCourseCard key={c.id} course={c} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
