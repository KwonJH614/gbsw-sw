import { useState, useEffect, useCallback } from 'react';
import { getDashboardOverview, getDashboardActivities, type DashboardOverview, type Activity } from '../api/dashboard.api';

const CACHE_TTL = 5 * 60 * 1000;
let cache: { data: DashboardOverview; ts: number } | null = null;

export function useDashboard() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const fetch = useCallback(async (force = false) => {
    setLoading(true);
    try {
      const now = Date.now();
      let ov: DashboardOverview;
      if (!force && cache && now - cache.ts < CACHE_TTL) { ov = cache.data; }
      else { ov = await getDashboardOverview(); cache = { data: ov, ts: now }; }
      setOverview(ov);
      setActivities(await getDashboardActivities(10));
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetch(); }, [fetch]);
  return { overview, activities, loading, refresh: () => fetch(true) };
}