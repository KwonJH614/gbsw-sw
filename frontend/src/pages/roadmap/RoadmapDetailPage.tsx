import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { roadmapApi } from '../../api/roadmap.api';
import Badge from '../../components/common/Badge';
import RoadmapProgressBar from '../../components/roadmap/RoadmapProgressBar';
import { useAuthStore } from '../../store/authStore';
import type { RoadmapDetail } from '../../types/roadmap.types';
import type { RoadmapProgress, CourseProgressItem } from '../../types/progress.types';

export default function RoadmapDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [roadmap, setRoadmap] = useState<RoadmapDetail | null>(null);
  const [progress, setProgress] = useState<RoadmapProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!id) return;
    roadmapApi.getDetail(Number(id))
      .then((res) => setRoadmap(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id || !isAuthenticated) return;
    roadmapApi.getProgress(Number(id))
      .then((res) => setProgress(res.data.data))
      .catch(() => {});
  }, [id, isAuthenticated]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="text-text-secondary">로딩 중...</span>
      </div>
    );
  }

  if (!roadmap) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="text-text-secondary">로드맵을 찾을 수 없습니다.</span>
      </div>
    );
  }

  const getCourseProgress = (courseId: number): CourseProgressItem | undefined =>
    progress?.courses.find((c) => c.courseId === courseId);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2">
          <Badge level={roadmap.level} />
          <span className="text-sm text-text-secondary">
            강의 {roadmap.courses.length}개
          </span>
        </div>
        <h1 className="mb-2 text-3xl font-bold">{roadmap.title}</h1>
        <p className="text-text-secondary">{roadmap.description}</p>
      </div>

      {/* 진도율 바 */}
      {isAuthenticated && progress && (
        <div className="mb-6">
          <RoadmapProgressBar
            completionRate={progress.completionRate}
            completedCourses={progress.completedCourses}
            totalCourses={progress.totalCourses}
          />
        </div>
      )}

      <h2 className="mb-4 text-xl font-bold">강의 순서</h2>

      <ol className="space-y-3">
        {roadmap.courses
          .sort((a, b) => a.orderIndex - b.orderIndex)
          .map((course, idx) => {
            const cp = getCourseProgress(course.courseId);
            const isCompleted =
              cp && cp.totalLessons > 0 && cp.completedLessons === cp.totalLessons;

            return (
              <li key={course.courseId}>
                <Link
                  to={`/courses/${course.courseId}`}
                  className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition hover:shadow-sm hover:border-primary"
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                      isCompleted ? 'bg-success' : 'bg-primary'
                    }`}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </span>

                  {course.thumbnailUrl && (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="h-16 w-28 shrink-0 rounded-lg object-cover"
                    />
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <Badge level={course.level} />
                      <span className="text-xs text-text-secondary">
                        {course.lessonCount}개 레슨
                      </span>
                      {cp && cp.enrolled && (
                        <span className="text-xs text-success">
                          {Math.round(cp.completionRate)}% 완료
                        </span>
                      )}
                    </div>
                    <h3 className="truncate font-semibold">{course.title}</h3>
                    <p className="text-xs text-text-secondary">{course.instructorName}</p>
                  </div>
                </Link>
              </li>
            );
          })}
      </ol>
    </div>
  );
}
