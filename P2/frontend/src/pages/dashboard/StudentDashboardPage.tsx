import { useDashboard } from '../../hooks/useDashboard';
import { StatCard, RecentCourseCard, RoadmapProgressList, ActivityFeedItem } from '../../components/dashboard/DashboardComponents';

export default function StudentDashboardPage() {
  const { overview, activities, loading, refresh } = useDashboard();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const stats = overview?.stats;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">학습 대시보드</h1>
          <p className="text-gray-500 text-sm mt-1">나의 학습 현황을 한눈에</p>
        </div>
        <button onClick={refresh} className="text-sm text-blue-600 hover:underline">새로고침</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="수강 중" value={stats?.activeCourses ?? 0} sub="개 강의" />
        <StatCard label="완료한 강의" value={stats?.completedCourses ?? 0} color="#16a34a" />
        <StatCard label="총 학습 시간" value={`${stats?.totalWatchedMinutes ?? 0}분`} color="#f59e0b" />
        <StatCard label="작성한 리뷰" value={stats?.reviewsWritten ?? 0} color="#8b5cf6" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-base font-semibold text-gray-800 mb-3">최근 본 강의</h2>
          {overview?.recentCourses.length ? (
            <div className="flex flex-col gap-3">
              {overview.recentCourses.map(c => <RecentCourseCard key={c.courseId} {...c} />)}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-8 text-center text-gray-400 text-sm">아직 학습한 강의가 없습니다</div>
          )}

          <h2 className="text-base font-semibold text-gray-800 mt-8 mb-3">로드맵 달성률</h2>
          {overview?.roadmapProgress.length ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <RoadmapProgressList items={overview.roadmapProgress} />
            </div>
          ) : (
            <div className="bg-gray-50 rounded-2xl p-6 text-center text-gray-400 text-sm">수강 중인 로드맵이 없습니다</div>
          )}
        </div>

        <div>
          <h2 className="text-base font-semibold text-gray-800 mb-3">이번 주 활동</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            {activities.length ? (
              <div className="divide-y divide-gray-50">
                {activities.map((a, i) => <ActivityFeedItem key={i} {...a} />)}
              </div>
            ) : (
              <p className="text-center text-gray-400 text-sm py-8">활동 내역이 없습니다</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
