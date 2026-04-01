import { useState } from 'react';
import { useQna } from '../../hooks/useQna';
import { useAuthStore } from '../../store/authStore';
import QuestionForm from './QuestionForm';
import AnswerForm from './AnswerForm';
import type { QuestionItem, AnswerItem } from '../../types/qna.types';

interface QnaSectionProps {
  courseId: number;
  enrolled: boolean;
}

export default function QnaSection({ courseId, enrolled }: QnaSectionProps) {
  const {
    questions,
    loading,
    submitting,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    createAnswer,
    updateAnswer,
    deleteAnswer,
  } = useQna(courseId);

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionItem | null>(null);
  const [answeringQuestionId, setAnsweringQuestionId] = useState<number | null>(null);
  const [editingAnswer, setEditingAnswer] = useState<AnswerItem | null>(null);
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(null);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleCreateQuestion = async (title: string, content: string) => {
    await createQuestion(title, content);
    setShowQuestionForm(false);
  };

  const handleUpdateQuestion = async (title: string, content: string) => {
    if (!editingQuestion) return;
    await updateQuestion(editingQuestion.id, title, content);
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = async (questionId: number) => {
    if (!confirm('질문을 삭제하시겠습니까? 답변도 함께 삭제됩니다.')) return;
    await deleteQuestion(questionId);
  };

  const handleCreateAnswer = async (questionId: number, content: string) => {
    await createAnswer(questionId, content);
    setAnsweringQuestionId(null);
    setExpandedQuestionId(questionId);
  };

  const handleUpdateAnswer = async (content: string) => {
    if (!editingAnswer) return;
    await updateAnswer(editingAnswer.id, content);
    setEditingAnswer(null);
  };

  const handleDeleteAnswer = async (answerId: number) => {
    if (!confirm('답변을 삭제하시겠습니까?')) return;
    await deleteAnswer(answerId);
  };

  if (loading) {
    return (
      <div className="py-4 text-center text-sm text-text-secondary">로딩 중...</div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">
          질의응답
          <span className="ml-1 text-sm font-normal text-text-secondary">
            ({questions.length})
          </span>
        </h2>
        {isAuthenticated && enrolled && !showQuestionForm && !editingQuestion && (
          <button
            onClick={() => setShowQuestionForm(true)}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            질문하기
          </button>
        )}
      </div>

      {/* 질문 작성 폼 */}
      {showQuestionForm && (
        <div className="mb-4">
          <QuestionForm
            submitting={submitting}
            onSubmit={handleCreateQuestion}
            onCancel={() => setShowQuestionForm(false)}
          />
        </div>
      )}

      {/* 질문 수정 폼 */}
      {editingQuestion && (
        <div className="mb-4">
          <QuestionForm
            initialTitle={editingQuestion.title}
            initialContent={editingQuestion.content}
            submitting={submitting}
            onSubmit={handleUpdateQuestion}
            onCancel={() => setEditingQuestion(null)}
          />
        </div>
      )}

      {/* 질문 목록 */}
      {questions.length === 0 ? (
        <p className="rounded-xl border border-border bg-surface p-6 text-center text-sm text-text-secondary">
          아직 등록된 질문이 없습니다.
        </p>
      ) : (
        <ul className="space-y-3">
          {questions.map((q) => {
            const isMine = user?.id === q.userId;
            const isExpanded = expandedQuestionId === q.id;

            return (
              <li key={q.id} className="rounded-xl border border-border bg-surface">
                {/* 질문 헤더 */}
                <div
                  className="cursor-pointer px-5 py-4"
                  onClick={() =>
                    setExpandedQuestionId(isExpanded ? null : q.id)
                  }
                >
                  <div className="mb-1 flex items-center justify-between">
                    <h3 className="font-semibold">{q.title}</h3>
                    <div className="flex items-center gap-2">
                      {q.answerCount > 0 && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          답변 {q.answerCount}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <span>{q.nickname}</span>
                    <span>{formatDate(q.createdAt)}</span>
                  </div>
                </div>

                {/* 펼쳐진 내용 */}
                {isExpanded && (
                  <div className="border-t border-border px-5 py-4">
                    <p className="mb-3 text-sm whitespace-pre-wrap">{q.content}</p>

                    {isMine && (
                      <div className="mb-3 flex gap-2">
                        <button
                          onClick={() => {
                            setEditingQuestion(q);
                            setShowQuestionForm(false);
                          }}
                          className="text-xs text-primary hover:underline"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="text-xs text-error hover:underline"
                        >
                          삭제
                        </button>
                      </div>
                    )}

                    {/* 답변 목록 */}
                    {q.answers.length > 0 && (
                      <div className="mt-3 space-y-2 border-t border-border pt-3">
                        {q.answers.map((a) => {
                          const isMyAnswer = user?.id === a.userId;

                          if (editingAnswer?.id === a.id) {
                            return (
                              <AnswerForm
                                key={a.id}
                                initialContent={a.content}
                                submitting={submitting}
                                onSubmit={handleUpdateAnswer}
                                onCancel={() => setEditingAnswer(null)}
                              />
                            );
                          }

                          return (
                            <div key={a.id} className="rounded-lg bg-bg px-4 py-3">
                              <div className="mb-1 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-text-secondary">
                                  <span className="font-medium text-text">{a.nickname}</span>
                                  <span>{formatDate(a.createdAt)}</span>
                                </div>
                                {isMyAnswer && (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => setEditingAnswer(a)}
                                      className="text-xs text-primary hover:underline"
                                    >
                                      수정
                                    </button>
                                    <button
                                      onClick={() => handleDeleteAnswer(a.id)}
                                      className="text-xs text-error hover:underline"
                                    >
                                      삭제
                                    </button>
                                  </div>
                                )}
                              </div>
                              <p className="text-sm whitespace-pre-wrap">{a.content}</p>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* 답변 작성 */}
                    {isAuthenticated && enrolled && answeringQuestionId !== q.id && (
                      <button
                        onClick={() => setAnsweringQuestionId(q.id)}
                        className="mt-3 text-sm text-primary hover:underline"
                      >
                        답변 작성
                      </button>
                    )}

                    {answeringQuestionId === q.id && (
                      <AnswerForm
                        submitting={submitting}
                        onSubmit={(content) => handleCreateAnswer(q.id, content)}
                        onCancel={() => setAnsweringQuestionId(null)}
                      />
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
