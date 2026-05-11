 import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { instructorApi } from '../../api/instructor.api';
import type { CreateLessonRequest, Lesson, ReorderRequest } from '../../types/lesson.types';

export default function LessonManagePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const id = Number(courseId);

  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<CreateLessonRequest>({ title: '', videoUrl: '', duration: 0 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{ title: string; videoUrl: string }>({
    title: '',
    videoUrl: '',
  });

  const dragIndex = useRef<number | null>(null);
  const reorderSignal = useRef(0);
  const [reorderTrigger, setReorderTrigger] = useState(0);
  const initialOrderRef = useRef<number[]>([]);

  const load = async () => {
    try {
      const res = await instructorApi.getLessons(id);
      setLessons(res.data.data);
      initialOrderRef.current = res.data.data.map((l) => l.id);
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error.message);
      } else {
        setError('레슨을 불러오지 못했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // 드래그 완료 후 상태가 변경되면 API 호출 (04-15 해결책)
  useEffect(() => {
    if (reorderTrigger === 0) return;
    const current = lessons.map((l) => l.id);
    const same =
      current.length === initialOrderRef.current.length &&
      current.every((v, i) => v === initialOrderRef.current[i]);
    if (same) return;

    const items: ReorderRequest[] = lessons.map((l, idx) => ({
      lessonId: l.id,
      orderIndex: idx + 1,
    }));
    instructorApi
      .reorderLessons(id, items)
      .then((res) => {
        setLessons(res.data.data);
        initialOrderRef.current = res.data.data.map((l) => l.id);
      })
      .catch(() => {
        alert('순서 저장에 실패했습니다. 새로고침합니다.');
        load();
      });
  }, [reorderTrigger, id, lessons]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.videoUrl.trim()) return;
    try {
      const res = await instructorApi.createLesson(id, form);
      setLessons((prev) => [...prev, res.data.data]);
      initialOrderRef.current = [...initialOrderRef.current, res.data.data.id];
      setForm({ title: '', videoUrl: '', duration: 0 });
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.error) {
        alert(err.response.data.error.message);
      }
    }
  };

  const startEdit = (lesson: Lesson) => {
    setEditingId(lesson.id);
    setEditForm({ title: lesson.title, videoUrl: lesson.videoUrl });
  };

  const saveEdit = async (lessonId: number) => {
    try {
      const res = await instructorApi.updateLesson(lessonId, editForm);
      setLessons((prev) => prev.map((l) => (l.id === lessonId ? res.data.data : l)));
      setEditingId(null);
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.error) {
        alert(err.response.data.error.message);
      }
    }
  };

  const handleDelete = async (lessonId: number) => {
    if (!confirm('레슨을 삭제하시겠습니까?')) return;
    try {
      await instructorApi.deleteLesson(lessonId);
      await load();
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.error) {
        alert(err.response.data.error.message);
      }
    }
  };

  const onDragStart = (idx: number) => {
    dragIndex.current = idx;
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (targetIdx: number) => {
    const src = dragIndex.current;
    if (src === null || src === targetIdx) return;
    const copy = [...lessons];
    const [moved] = copy.splice(src, 1);
    copy.splice(targetIdx, 0, moved);
    setLessons(copy);
    dragIndex.current = null;
    reorderSignal.current += 1;
    setReorderTrigger(reorderSignal.current);
  };

  if (loading) return <div className="p-8 text-center text-text-secondary">불러오는 중…</div>;
  if (error) return <div className="p-8 text-center text-error">{error}</div>;

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-text">레슨 관리</h1>

      <form onSubmit={handleCreate} className="mb-6 rounded-lg border border-border bg-surface p-4">
        <h2 className="mb-3 text-lg font-semibold text-text">레슨 추가</h2>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <input
            type="text"
            placeholder="제목"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="rounded border border-border bg-surface px-3 py-2 text-text"
            required
          />
          <input
            type="url"
            placeholder="영상 URL"
            value={form.videoUrl}
            onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
            className="rounded border border-border bg-surface px-3 py-2 text-text"
            required
          />
          <input
            type="number"
            placeholder="길이(초)"
            value={form.duration || ''}
            onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
            className="rounded border border-border bg-surface px-3 py-2 text-text"
            min={0}
            required
          />
        </div>
        <button
          type="submit"
          className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          추가
        </button>
      </form>

      <div className="space-y-2">
        {lessons.map((lesson, idx) => (
          <div
            key={lesson.id}
            draggable
            onDragStart={() => onDragStart(idx)}
            onDragOver={onDragOver}
            onDrop={() => onDrop(idx)}
            className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3"
          >
            <span className="cursor-move text-text-secondary" title="드래그로 순서 변경">
              ☰
            </span>
            <span className="w-8 text-sm text-text-secondary">#{idx + 1}</span>
            {editingId === lesson.id ? (
              <>
                <input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="flex-1 rounded border border-border bg-surface px-2 py-1 text-text"
                />
                <input
                  value={editForm.videoUrl}
                  onChange={(e) => setEditForm({ ...editForm, videoUrl: e.target.value })}
                  className="flex-1 rounded border border-border bg-surface px-2 py-1 text-text"
                />
                <button
                  onClick={() => saveEdit(lesson.id)}
                  className="rounded bg-primary px-3 py-1 text-sm text-white"
                >
                  저장
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="rounded border border-border px-3 py-1 text-sm text-text-secondary"
                >
                  취소
                </button>
              </>
            ) : (
              <>
                <div className="flex-1">
                  <div className="font-medium text-text">{lesson.title}</div>
                  <div className="text-xs text-text-secondary">{lesson.videoUrl}</div>
                </div>
                <button
                  onClick={() => startEdit(lesson)}
                  className="rounded border border-border px-3 py-1 text-sm text-text"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(lesson.id)}
                  className="rounded border border-error px-3 py-1 text-sm text-error"
                >
                  삭제
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
