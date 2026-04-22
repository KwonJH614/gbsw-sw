import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courseApi } from '../../api/course.api';
import { progressApi } from '../../api/progress.api';
import { enrollmentApi } from '../../api/enrollment.api';
import VideoPlayer from '../../components/course/VideoPlayer';
import { useProgress } from '../../hooks/useProgress';
import { useProgressStore } from '../../store/progressStore';
import type { CourseDetail, Lesson } from '../../types/course.types';

export default function LessonPlayerPage() {
  const { id, lessonId } = useParams<{ id: string; lessonId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [initialPosition, setInitialPosition] = useState(0);
  const { setCourseProgresses, lessonProgressMap } = useProgressStore();

  const courseIdNum = Number(id);
  const lessonIdNum = Number(lessonId);

  const { updatePosition, startTracking, stopTracking, saveProgress } =
    useProgress(lessonIdNum, lesson?.duration ?? 0);

  useEffect(() => {
    if (!id || !lessonId) return;

    const load = async () => {
      try {
        const [courseRes, enrollRes] = await Promise.all([
          courseApi.getDetail(courseIdNum),
          enrollmentApi.checkEnrollment(courseIdNum),
        ]);

        const courseData = courseRes.data.data;
        setCourse(courseData);
        setEnrolled(enrollRes.data.data);

        if (!enrollRes.data.data) {
          setLoading(false);
          return;
        }

        const found = courseData.lessons.find((l) => l.id === lessonIdNum);
        setLesson(found ?? null);

        try {
          const progressRes = await progressApi.getCourseProgress(courseIdNum);
          const progresses = progressRes.data.data.lessons;
          setCourseProgresses(progresses);

          const lessonProg = progresses.find(
            (p: { lessonId: number }) => p.lessonId === lessonIdNum
          );
          if (lessonProg) {
            setInitialPosition(lessonProg.lastPosition);
          }
        } catch {}
      } catch {
        navigate('/courses');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, lessonId]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="text-text-secondary">로딩 중...</span>
      </div>
    );
  }

  if (!enrolled) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4">
        <p className="text-lg font-semibold">수강 신청이 필요합니다.</p>
        <Link
          to={`/courses/${id}`}
          className="rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary-dark"
        >
          강의 상세로 이동
        </Link>
      </div>
    );
  }

  if (!lesson || !course) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="text-text-secondary">레슨을 찾을 수 없습니다.</span>
      </div>
    );
  }

  const sortedLessons = [...course.lessons].sort(
    (a, b) => a.orderIndex - b.orderIndex
  );
  const currentIdx = sortedLessons.findIndex((l) => l.id === lessonIdNum);
  const prevLesson = currentIdx > 0 ? sortedLessons[currentIdx - 1] : null;
  const nextLesson =
    currentIdx < sortedLessons.length - 1
      ? sortedLessons[currentIdx + 1]
      : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* 비디오 플레이어 */}
      <VideoPlayer
        videoUrl={lesson.videoUrl}
        startPosition={initialPosition}
        onTimeUpdate={(time) => updatePosition(time)}
        onPlay={startTracking}
        onPause={stopTracking}
        onEnded={() => {
          stopTracking();
          saveProgress();
        }}
      />

      {/* 레슨 정보 */}
      <div className="mt-6">
        <p className="text-sm text-text-secondary">
          <Link to={`/courses/${course.id}`} className="hover:text-primary">
            {course.title}
          </Link>
          {' > '}레슨 {lesson.orderIndex}
        </p>
        <h1 className="mt-1 text-2xl font-bold">{lesson.title}</h1>
        {lesson.duration && (
          <p className="mt-1 text-sm text-text-secondary">
            {lesson.duration}분
          </p>
        )}
      </div>

      {/* 이전/다음 버튼 */}
      <div className="mt-6 flex justify-between">
        {prevLesson ? (
          <Link
            to={`/courses/${course.id}/lessons/${prevLesson.id}`}
            className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-bg"
          >
            이전: {prevLesson.title}
          </Link>
        ) : (
          <div />
        )}
        {nextLesson ? (
          <Link
            to={`/courses/${course.id}/lessons/${nextLesson.id}`}
            className="rounded-lg bg-primary px-4 py-2 text-sm text-white hover:bg-primary-dark"
          >
            다음: {nextLesson.title}
          </Link>
        ) : (
          <div />
        )}
      </div>

      {/* 레슨 목록 사이드바 */}
      <section className="mt-8">
        <h2 className="mb-3 text-lg font-bold">레슨 목록</h2>
        <ul className="divide-y divide-border rounded-xl border border-border bg-surface">
          {sortedLessons.map((l) => {
            const progress = lessonProgressMap[l.id];
            const isCompleted = progress?.completed ?? false;
            const isCurrent = l.id === lessonIdNum;

            return (
              <li key={l.id}>
                <Link
                  to={`/courses/${course.id}/lessons/${l.id}`}
                  className={`flex items-center justify-between px-4 py-3 transition hover:bg-bg ${
                    isCurrent ? 'bg-primary/5 border-l-2 border-l-primary' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isCompleted
                          ? 'bg-success text-white'
                          : 'bg-primary/10 text-primary'
                      }`}
                    >
                      {isCompleted ? '✓' : l.orderIndex}
                    </span>
                    <span className="text-sm">{l.title}</span>
                  </div>
                  {l.duration != null && (
                    <span className="text-xs text-text-secondary">
                      {l.duration}분
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
