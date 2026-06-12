import { useCallback, useEffect, useState } from 'react';
import { notificationApi, type JobResult, type NotificationDeliveryLog } from '../../api/notification.api';

export default function NotificationLogPage() {
  const [logs, setLogs] = useState<NotificationDeliveryLog[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<JobResult | null>(null);

  const load = useCallback(() => {
    notificationApi.getLogs(page, status).then(data => {
      setLogs(data.content);
      setTotalPages(data.totalPages);
    });
  }, [page, status]);

  useEffect(load, [load]);

  const runJob = async () => {
    setRunning(true);
    try {
      setResult(await notificationApi.runLearningReminder());
      load();
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-2xl font-bold">알림 운영 로그</h1><p className="mt-1 text-sm text-gray-500">Discord 알림 성공·실패와 배치 실행 결과를 확인합니다.</p></div>
        <button disabled={running} onClick={runJob} className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50">{running ? '실행 중...' : '학습 독려 배치 실행'}</button>
      </div>
      {result && <div className="mb-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">대상 {result.targets}명 / 성공 {result.success}명 / 실패 {result.failed}명 / 중복 제외 {result.skipped}명</div>}
      <select value={status} onChange={event => { setStatus(event.target.value); setPage(0); }} className="mb-4 rounded-lg border border-gray-300 px-3 py-2 text-sm">
        <option value="">전체 상태</option><option value="SUCCESS">성공</option><option value="FAILED">실패</option>
      </select>
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs text-gray-500"><tr>{['사용자', '유형', '상태', '실패 사유', '발송 시각'].map(header => <th key={header} className="px-4 py-3">{header}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-100">{logs.map(log => (
            <tr key={log.id}>
              <td className="px-4 py-3">{log.nickname} (#{log.userId})</td><td className="px-4 py-3">{log.notificationType}</td>
              <td className="px-4 py-3"><span className={`rounded-full px-2 py-1 text-xs font-semibold ${log.status === 'SUCCESS' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{log.status}</span></td>
              <td className="max-w-xs truncate px-4 py-3 text-gray-500">{log.failureReason ?? '-'}</td><td className="px-4 py-3 text-gray-500">{log.sentAt.replace('T', ' ').slice(0, 16)}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-center gap-3">
        <button disabled={page === 0} onClick={() => setPage(value => value - 1)} className="rounded-lg border px-3 py-1 disabled:opacity-40">이전</button>
        <span className="py-1 text-sm">{totalPages === 0 ? 0 : page + 1} / {totalPages}</span>
        <button disabled={page + 1 >= totalPages} onClick={() => setPage(value => value + 1)} className="rounded-lg border px-3 py-1 disabled:opacity-40">다음</button>
      </div>
    </div>
  );
}
