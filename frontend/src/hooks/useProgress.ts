import { useEffect, useRef, useCallback } from 'react';
import { progressApi } from '../api/progress.api';
import { useProgressStore } from '../store/progressStore';

export function useProgress(lessonId: number, duration: number) {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentPositionRef = useRef(0);
  const { setLessonProgress, getLessonProgress } = useProgressStore();

  const saveProgress = useCallback(async () => {
    const position = currentPositionRef.current;
    if (position <= 0) return;
    try {
      const res = await progressApi.save(lessonId, position);
      setLessonProgress(lessonId, res.data.data);
    } catch {}
  }, [lessonId, setLessonProgress]);

  const updatePosition = useCallback((position: number) => {
    currentPositionRef.current = Math.floor(position);
  }, []);

  const startTracking = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      saveProgress();
    }, 30000);
  }, [saveProgress]);

  const stopTracking = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    saveProgress();
  }, [saveProgress]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const existing = getLessonProgress(lessonId);
  const lastPosition = existing?.lastPosition ?? 0;
  const completed = existing?.completed ?? false;

  return {
    updatePosition,
    startTracking,
    stopTracking,
    saveProgress,
    lastPosition,
    completed,
  };
}
