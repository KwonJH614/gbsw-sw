import { Link } from 'react-router-dom';
import Badge from '../common/Badge';
import type { RoadmapListItem } from '../../types/roadmap.types';

interface RoadmapCardProps {
  roadmap: RoadmapListItem;
}

export default function RoadmapCard({ roadmap }: RoadmapCardProps) {
  return (
    <Link
      to={`/roadmaps/${roadmap.id}`}
      className="group overflow-hidden rounded-2xl border border-border bg-surface transition hover:shadow-md"
    >
      {roadmap.thumbnailUrl && (
        <div className="aspect-video overflow-hidden bg-bg">
          <img
            src={roadmap.thumbnailUrl}
            alt={roadmap.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        </div>
      )}

      <div className="p-5">
        <div className="mb-2 flex items-center gap-2">
          <Badge level={roadmap.level} />
          <span className="text-xs text-text-secondary">
            강의 {roadmap.courseCount}개
          </span>
        </div>

        <h3 className="mb-1 text-lg font-bold leading-snug group-hover:text-primary">
          {roadmap.title}
        </h3>

        <p className="line-clamp-2 text-sm text-text-secondary">
          {roadmap.description}
        </p>
      </div>
    </Link>
  );
}
