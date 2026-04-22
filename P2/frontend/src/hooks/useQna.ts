import { useState, useEffect, useCallback } from 'react';
import { qnaApi } from '../api/qna.api';
import type { QuestionItem } from '../types/qna.types';

export function useQna(courseId: number) {
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchQuestions = useCallback(async () => {
    try {
      const res = await qnaApi.getQuestions(courseId);
      setQuestions(res.data.data);
    } catch {} finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const createQuestion = async (title: string, content: string) => {
    setSubmitting(true);
    try {
      await qnaApi.createQuestion(courseId, { title, content });
      await fetchQuestions();
    } finally {
      setSubmitting(false);
    }
  };

  const updateQuestion = async (questionId: number, title: string, content: string) => {
    setSubmitting(true);
    try {
      await qnaApi.updateQuestion(questionId, { title, content });
      await fetchQuestions();
    } finally {
      setSubmitting(false);
    }
  };

  const deleteQuestion = async (questionId: number) => {
    setSubmitting(true);
    try {
      await qnaApi.deleteQuestion(questionId);
      await fetchQuestions();
    } finally {
      setSubmitting(false);
    }
  };

  const createAnswer = async (questionId: number, content: string) => {
    setSubmitting(true);
    try {
      await qnaApi.createAnswer(questionId, { content });
      await fetchQuestions();
    } finally {
      setSubmitting(false);
    }
  };

  const updateAnswer = async (answerId: number, content: string) => {
    setSubmitting(true);
    try {
      await qnaApi.updateAnswer(answerId, { content });
      await fetchQuestions();
    } finally {
      setSubmitting(false);
    }
  };

  const deleteAnswer = async (answerId: number) => {
    setSubmitting(true);
    try {
      await qnaApi.deleteAnswer(answerId);
      await fetchQuestions();
    } finally {
      setSubmitting(false);
    }
  };

  return {
    questions,
    loading,
    submitting,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    createAnswer,
    updateAnswer,
    deleteAnswer,
  };
}
