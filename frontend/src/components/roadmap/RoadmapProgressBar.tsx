interface RoadmapProgressBarProps {
  completionRate: number;
  completedCourses: number;
  totalCourses: number;
}

export default function RoadmapProgressBar({
  completionRate,
  completedCourses,
  totalCourses,
}: RoadmapProgressBarProps) {
  const rate = Math.round(completionRate);

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-semibold">내 진도율</span>
        <span className="text-text-secondary">
          {completedCourses}/{totalCourses} 강의 완료 · {rate}%
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${rate}%` }}
        />
      </div>
    </div>
  );
}
