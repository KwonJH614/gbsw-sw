import { Link } from 'react-router-dom';
import type { InstructorCourse } from '../../types/instructor.types';

interface Props {
  course: InstructorCourse;
  onDelete: (courseId: number) => void;
}

export default function InstructorCourseCard({ course, onDelete }: Props) {
  return (
    <div className="rounded-lg border border-border bg-surface p-4 shadow-sm">
      {course.thumbnailUrl && (
        <img
          src={course.thumbnailUrl}
          alt={course.title}
          className="mb-3 h-32 w-full rounded object-cover"
        />
      )}
      <h3 className="mb-2 text-lg font-semibold text-text">{course.title}</h3>
      <div className="mb-3 flex gap-4 text-sm text-text-secondary">
        <span>수강생 {course.enrollmentCount}명</span>
        <span>★ {course.avgRating.toFixed(1)}</span>
        <span>레슨 {course.lessonCount}개</span>
      </div>
      <div className="flex gap-2">
        <Link
          to={`/instructor/courses/${course.id}/edit`}
          className="flex-1 rounded border border-border px-3 py-1.5 text-center text-sm text-text hover:bg-bg"
        >
          수정
        </Link>
        <Link
          to={`/instructor/courses/${course.id}/lessons`}
          className="flex-1 rounded bg-primary px-3 py-1.5 text-center text-sm text-white hover:bg-primary-dark"
        >
          레슨 관리
        </Link>
        <button
          onClick={() => onDelete(course.id)}
          className="rounded border border-error px-3 py-1.5 text-sm text-error hover:bg-error/10"
        >
          삭제
        </button>
      </div>
    </div>
  );
}
