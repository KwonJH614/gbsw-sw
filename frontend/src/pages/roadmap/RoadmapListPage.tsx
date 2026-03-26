import { useState, useEffect } from 'react';
import { roadmapApi } from '../../api/roadmap.api';
import RoadmapCard from '../../components/roadmap/RoadmapCard';
import type { RoadmapListItem } from '../../types/roadmap.types';

export default function RoadmapListPage() {
  const [roadmaps, setRoadmaps] = useState<RoadmapListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    roadmapApi.getList()
      .then((res) => setRoadmaps(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="text-text-secondary">로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">학습 로드맵</h1>
      <p className="mb-8 text-text-secondary">
        입문부터 심화까지, 단계별 학습 경로를 따라가세요.
      </p>

      {roadmaps.length === 0 ? (
        <p className="text-center text-text-secondary">등록된 로드맵이 없습니다.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {roadmaps.map((roadmap) => (
            <RoadmapCard key={roadmap.id} roadmap={roadmap} />
          ))}
        </div>
      )}
    </div>
  );
}
