import { create } from 'zustand';
import type { LessonProgress } from '../types/progress.types';

interface ProgressState {
  lessonProgressMap: Record<number, LessonProgress>;
  setLessonProgress: (lessonId: number, progress: LessonProgress) => void;
  getLessonProgress: (lessonId: number) => LessonProgress | undefined;
  setCourseProgresses: (progresses: LessonProgress[]) => void;
  clear: () => void;
}

export const useProgressStore = create<ProgressState>((set, get) => ({
  lessonProgressMap: {},

  setLessonProgress: (lessonId, progress) =>
    set((state) => ({
      lessonProgressMap: { ...state.lessonProgressMap, [lessonId]: progress },
    })),

  getLessonProgress: (lessonId) => get().lessonProgressMap[lessonId],

  setCourseProgresses: (progresses) =>
    set((state) => {
      const map = { ...state.lessonProgressMap };
      progresses.forEach((p) => {
        map[p.lessonId] = p;
      });
      return { lessonProgressMap: map };
    }),

  clear: () => set({ lessonProgressMap: {} }),
}));
