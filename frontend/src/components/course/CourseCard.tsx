import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import StarRating from '../common/StarRating';
import type { CourseListItem } from '../../types/course.types';

interface CourseCardProps {
  course: CourseListItem;
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <Link
      to={`/courses/${course.id}`}
      className="group overflow-hidden rounded-2xl border border-border bg-surface transition hover:shadow-md"
    >
      {course.thumbnailUrl && (
        <div className="aspect-video overflow-hidden bg-bg">
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        </div>
      )}

      <div className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <Badge level={course.level} />
          <span className="text-xs text-text-secondary">
            {course.lessonCount}개 레슨
          </span>
        </div>

        <h3 className="mb-1 text-base font-bold leading-snug group-hover:text-primary">
          {course.title}
        </h3>

        <p className="text-xs text-text-secondary">{course.instructorName}</p>

        <div className="mt-2 flex items-center gap-1.5">
          <StarRating rating={course.avgRating} />
          <span className="text-xs text-text-secondary">
            {course.avgRating.toFixed(1)} ({course.reviewCount})
          </span>
        </div>
      </div>
    </Link>
  );
}
