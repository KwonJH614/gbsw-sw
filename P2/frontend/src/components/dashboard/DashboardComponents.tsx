export function StatCard({ label, value, sub, color = '#1456f0' }: { label: string; value: string | number; sub?: string; color?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-bold" style={{ color }}>{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

export function RecentCourseCard({ title, thumbnailUrl, lastLessonId, watchedSeconds }: { title: string; thumbnailUrl: string; lastLessonId: number; watchedSeconds: number }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex gap-4 p-4">
      {thumbnailUrl && <img src={thumbnailUrl} alt={title} className="w-20 h-14 object-cover rounded-xl flex-shrink-0" />}
      <div className="flex flex-col justify-between flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-800 truncate">{title}</p>
        <p className="text-xs text-gray-400">{Math.floor(watchedSeconds / 60)}분 학습 중</p>
        <a href={`/lessons/${lastLessonId}`} className="text-xs font-semibold text-blue-600 hover:underline mt-1">이어보기 →</a>
      </div>
    </div>
  );
}

export function RoadmapProgressList({ items }: { items: { roadmapId: number; title: string; completionRate: number }[] }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map(item => (
        <div key={item.roadmapId}>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">{item.title}</span>
            <span className="text-sm text-gray-500">{item.completionRate}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${item.completionRate}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

const TYPE_CFG = {
  PROGRESS:  { icon: '▶', color: 'text-blue-500',  bg: 'bg-blue-50'  },
  COMPLETED: { icon: '✓', color: 'text-green-600', bg: 'bg-green-50' },
  REVIEW:    { icon: '★', color: 'text-amber-500', bg: 'bg-amber-50' },
};

export function ActivityFeedItem({ type, message, occurredAt }: { type: string; message: string; occurredAt: string }) {
  const cfg = TYPE_CFG[type as keyof typeof TYPE_CFG] ?? TYPE_CFG.PROGRESS;
  const diff = Date.now() - new Date(occurredAt).getTime();
  const m = Math.floor(diff / 60000);
  const rel = m < 1 ? '방금 전' : m < 60 ? `${m}분 전` : m < 1440 ? `${Math.floor(m / 60)}시간 전` : `${Math.floor(m / 1440)}일 전`;
  return (
    <div className="flex items-center gap-3 py-2">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${cfg.bg}`}>
        <span className={`text-xs font-bold ${cfg.color}`}>{cfg.icon}</span>
      </div>
      <p className="text-sm text-gray-700 flex-1">{message}</p>
      <span className="text-xs text-gray-400">{rel}</span>
    </div>
  );
}
