import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { isAxiosError } from 'axios';
import { instructorApi } from '../../api/instructor.api';
import type { CreateCourseRequest, Level } from '../../types/instructor.types';

const LEVELS: Level[] = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

export default function CourseFormPage() {
  const { courseId } = useParams<{ courseId?: string }>();
  const navigate = useNavigate();
  const isEdit = !!courseId;

  const [form, setForm] = useState<CreateCourseRequest>({
    title: '',
    description: '',
    thumbnailUrl: '',
    level: 'BEGINNER',
  });
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit || !courseId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await instructorApi.getMyCourses();
        if (cancelled) return;
        const found = res.data.data.find((c) => c.id === Number(courseId));
        if (found) {
          setForm({
            title: found.title,
            description: found.description ?? '',
            thumbnailUrl: found.thumbnailUrl ?? '',
            level: found.level,
          });
        } else {
          setError('강의를 찾을 수 없습니다.');
        }
      } catch {
        if (!cancelled) setError('강의를 불러오지 못했습니다.');
      } finally {
        if (!cancelled) setInitializing(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [courseId, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError('제목을 입력하세요.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (isEdit && courseId) {
        await instructorApi.updateCourse(Number(courseId), form);
      } else {
        await instructorApi.createCourse(form);
      }
      navigate('/instructor');
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error.message);
      } else {
        setError('저장에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return <div className="p-8 text-center text-text-secondary">불러오는 중…</div>;
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold text-text">
        {isEdit ? '강의 수정' : '새 강의 만들기'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-text">제목 *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-text"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text">설명</label>
          <textarea
            value={form.description ?? ''}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-text"
            rows={4}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text">썸네일 URL</label>
          <input
            type="url"
            value={form.thumbnailUrl ?? ''}
            onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-text"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-text">난이도 *</label>
          <select
            value={form.level}
            onChange={(e) => setForm({ ...form, level: e.target.value as Level })}
            className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-text"
            required
          >
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l === 'BEGINNER' ? '입문' : l === 'INTERMEDIATE' ? '기초' : '심화'}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="text-sm text-error">{error}</div>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark disabled:opacity-50"
          >
            {loading ? '저장 중…' : isEdit ? '수정' : '생성'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/instructor')}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary hover:bg-bg"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
