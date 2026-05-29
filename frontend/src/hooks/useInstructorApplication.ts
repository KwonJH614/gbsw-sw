import { useState, useEffect } from 'react';
import { applyInstructor, getMyApplication, listApplications, approveApplication, rejectApplication } from '../api/instructor.application.api';
import type { InstructorApplication, ApplyRequest } from '../types/instructor.types';

export function useMyApplication() {
  const [application, setApplication] = useState<InstructorApplication | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getMyApplication().then(setApplication).finally(() => setLoading(false)); }, []);
  const apply = async (data: ApplyRequest) => { const r = await applyInstructor(data); setApplication(r); return r; };
  return { application, loading, apply };
}

export function useApplicationManage() {
  const [applications, setApplications] = useState<InstructorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const fetch = (status?: string) => { setLoading(true); listApplications(status).then(setApplications).finally(() => setLoading(false)); };
  useEffect(() => { fetch('PENDING'); }, []);
  const approve = async (id: number) => { await approveApplication(id); setApplications(p => p.filter(a => a.id !== id)); };
  const reject = async (id: number, reason: string) => { await rejectApplication(id, reason); setApplications(p => p.filter(a => a.id !== id)); };
  return { applications, loading, fetch, approve, reject };
}