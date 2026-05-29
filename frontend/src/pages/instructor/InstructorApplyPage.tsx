import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyApplication } from '../../hooks/useInstructorApplication';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../store/authStore';

export default function InstructorApplyPage() {
  const { application, loading, apply } = useMyApplication();
  const [form, setForm] = useState({ bio: '', career: '', sampleVideoUrl: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try { await apply(form); }
    catch (err: any) { setError(err.response?.data?.error?.message || '오류가 발생했습니다.'); }
    finally { setSubmitting(false); }
  };

  const handleEnterConsole = async () => {
    try {
      const res = await authApi.getMe();
      setUser(res.data.data);
      navigate('/instructor');
    } catch {
      navigate('/instructor');
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">불러오는 중...</div>;

  if (application?.status === 'PENDING') return (
    <div className="max-w-xl mx-auto mt-16 p-8 bg-white rounded-2xl shadow text-center">
      <div className="text-4xl mb-4">⏳</div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">심사 중입니다</h2>
      <p className="text-gray-500">관리자 검토 후 결과를 알려드립니다.</p>
    </div>
  );

  if (application?.status === 'APPROVED') return (
    <div className="max-w-xl mx-auto mt-16 p-8 bg-green-50 rounded-2xl shadow text-center">
      <div className="text-4xl mb-4">✅</div>
      <h2 className="text-xl font-bold text-green-700 mb-2">강사 승인 완료</h2>
      <p className="text-gray-600 mb-6">강사 콘솔을 이용할 수 있습니다.</p>
      <button
        onClick={handleEnterConsole}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700"
      >
        강사 콘솔로 이동
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">강사 신청</h1>
      <p className="text-gray-500 mb-8">관리자 검토 후 승인 시 강의를 등록할 수 있습니다.</p>
      {application?.status === 'REJECTED' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm font-semibold text-red-600">이전 신청이 거절되었습니다</p>
          {application.rejectionReason && <p className="text-sm text-red-500 mt-1">사유: {application.rejectionReason}</p>}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">강사 소개</label>
          <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
            className="w-full border border-gray-300 rounded-xl p-3 text-sm resize-none h-28" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">경력 / 자격</label>
          <textarea value={form.career} onChange={e => setForm(p => ({ ...p, career: e.target.value }))}
            className="w-full border border-gray-300 rounded-xl p-3 text-sm resize-none h-24" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">샘플 영상 URL</label>
          <input type="url" value={form.sampleVideoUrl} onChange={e => setForm(p => ({ ...p, sampleVideoUrl: e.target.value }))}
            className="w-full border border-gray-300 rounded-xl p-3 text-sm" required />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button type="submit" disabled={submitting}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50">
          {submitting ? '신청 중...' : '강사 신청하기'}
        </button>
      </form>
    </div>
  );
}
