import { useState } from 'react';
import { useApplicationManage } from '../../hooks/useInstructorApplication';

export default function AdminInstructorApprovalPage() {
  const { applications, loading, approve, reject } = useApplicationManage();
  const [rejectTarget, setRejectTarget] = useState<number | null>(null);
  const [reason, setReason] = useState('');

  if (loading) return <div className="p-8 text-center text-gray-500">불러오는 중...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">강사 신청 관리</h1>
      {applications.length === 0 ? (
        <div className="text-center py-16 text-gray-400">대기 중인 신청이 없습니다.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {applications.map(app => (
            <div key={app.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <p className="text-sm text-gray-500">신청 #{app.id} · {app.createdAt?.slice(0, 10)}</p>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">심사 중</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><p className="text-xs font-semibold text-gray-500 mb-1">강사 소개</p><p className="text-sm text-gray-700">{app.bio}</p></div>
                <div><p className="text-xs font-semibold text-gray-500 mb-1">경력</p><p className="text-sm text-gray-700">{app.career}</p></div>
              </div>
              <a href={app.sampleVideoUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline">샘플 영상 →</a>
              {rejectTarget === app.id ? (
                <div className="mt-4">
                  <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="거절 사유"
                    className="w-full border border-gray-300 rounded-xl p-3 text-sm h-20 resize-none mb-2" />
                  <div className="flex gap-2">
                    <button onClick={async () => { await reject(app.id, reason); setRejectTarget(null); setReason(''); }}
                      className="px-4 py-2 bg-red-500 text-white text-sm rounded-xl">거절 확정</button>
                    <button onClick={() => { setRejectTarget(null); setReason(''); }}
                      className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-xl">취소</button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-3 mt-4">
                  <button onClick={() => approve(app.id)} className="px-5 py-2 bg-blue-600 text-white text-sm font-semibold rounded-xl">승인</button>
                  <button onClick={() => setRejectTarget(app.id)} className="px-5 py-2 border border-red-300 text-red-500 text-sm font-semibold rounded-xl">거절</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
