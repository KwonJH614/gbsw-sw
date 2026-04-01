import { useState, useEffect, useCallback } from 'react';
import { enrollmentApi } from '../api/enrollment.api';
import { useAuthStore } from '../store/authStore';

export function useEnrollment(courseId: number) {
  const [enrolled, setEnrolled] = useState(false);
  const [enrollmentId, setEnrollmentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const checkEnrollment = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await enrollmentApi.checkEnrollment(courseId);
      setEnrolled(res.data.data);
    } catch {
      setEnrolled(false);
    }
  }, [courseId, isAuthenticated]);

  const fetchMyEnrollments = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const res = await enrollmentApi.getMyEnrollments();
      const found = res.data.data.find(
        (e: { courseId: number; id: number }) => e.courseId === courseId
      );
      if (found) {
        setEnrolled(true);
        setEnrollmentId(found.id);
      }
    } catch {}
  }, [courseId, isAuthenticated]);

  useEffect(() => {
    checkEnrollment();
    fetchMyEnrollments();
  }, [checkEnrollment, fetchMyEnrollments]);

  const enroll = async () => {
    setLoading(true);
    try {
      const res = await enrollmentApi.enroll(courseId);
      setEnrolled(true);
      setEnrollmentId(res.data.data.id);
    } finally {
      setLoading(false);
    }
  };

  const cancel = async () => {
    if (!enrollmentId) return;
    setLoading(true);
    try {
      await enrollmentApi.cancel(enrollmentId);
      setEnrolled(false);
      setEnrollmentId(null);
    } finally {
      setLoading(false);
    }
  };

  return { enrolled, loading, enroll, cancel };
}
