import { useState } from 'react';

interface QuestionFormProps {
  initialTitle?: string;
  initialContent?: string;
  submitting: boolean;
  onSubmit: (title: string, content: string) => void;
  onCancel: () => void;
}

export default function QuestionForm({
  initialTitle = '',
  initialContent = '',
  submitting,
  onSubmit,
  onCancel,
}: QuestionFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSubmit(title.trim(), content.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-surface p-5">
      <h3 className="mb-3 font-semibold">
        {initialTitle ? '질문 수정' : '질문 작성'}
      </h3>

      <div className="mb-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="질문 제목"
          maxLength={200}
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="mb-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          placeholder="질문 내용을 작성해 주세요."
          className="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting || !title.trim() || !content.trim()}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
        >
          {submitting ? '저장 중...' : initialTitle ? '수정' : '등록'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-bg"
        >
          취소
        </button>
      </div>
    </form>
  );
}
