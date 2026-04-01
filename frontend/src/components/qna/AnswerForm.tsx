import { useState } from 'react';

interface AnswerFormProps {
  initialContent?: string;
  submitting: boolean;
  onSubmit: (content: string) => void;
  onCancel: () => void;
}

export default function AnswerForm({
  initialContent = '',
  submitting,
  onSubmit,
  onCancel,
}: AnswerFormProps) {
  const [content, setContent] = useState(initialContent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSubmit(content.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="mt-3 flex gap-2">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="답변을 입력하세요."
        className="flex-1 rounded-lg border border-border bg-bg px-3 py-2 text-sm outline-none focus:border-primary"
      />
      <button
        type="submit"
        disabled={submitting || !content.trim()}
        className="shrink-0 rounded-lg bg-primary px-3 py-2 text-sm text-white hover:bg-primary-dark disabled:opacity-50"
      >
        {initialContent ? '수정' : '등록'}
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="shrink-0 rounded-lg border border-border px-3 py-2 text-sm hover:bg-bg"
      >
        취소
      </button>
    </form>
  );
}
