import { useEffect, useState } from 'react';
import { listUsers, listAdminCourses, changeUserRole, suspendUser, setCourseVisibility, listAuditLogs } from '../../api/admin.api';
import type { AdminUser, AdminCourse, AuditLog } from '../../api/admin.api';
import { listApplications } from '../../api/instructor.application.api';

export function AdminDashboardPage() {
  const [counts, setCounts] = useState({ users: 0, courses: 0, pending: 0 });
  useEffect(() => {
    Promise.all([
      listUsers().then(u => u.length),
      listAdminCourses().then(c => c.length),
      listApplications('PENDING').then(a => a.length),
    ]).then(([users, courses, pending]) => setCounts({ users, courses, pending }));
  }, []);
  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">어드민 대시보드</h1>
      <div className="grid grid-cols-3 gap-5">
        {[
          { label: '전체 회원', value: counts.users, color: '#1456f0' },
          { label: '전체 강의', value: counts.courses, color: '#3b82f6' },
          { label: '강사 신청 대기', value: counts.pending, color: '#f59e0b' },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="text-sm text-gray-500 mb-2">{c.label}</p>
            <p className="text-4xl font-bold" style={{ color: c.color }}>{c.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function UserManagePage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const load = (query?: string) => { setLoading(true); listUsers(query).then(setUsers).finally(() => setLoading(false)); };
  useEffect(() => { load(); }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">회원 관리</h1>
      <div className="flex gap-3 mb-6">
        <input value={q} onChange={e => setQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && load(q)}
          placeholder="이메일 또는 닉네임 검색" className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm" />
        <button onClick={() => load(q)} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl">검색</button>
      </div>
      {loading ? <p className="text-center text-gray-400">불러오는 중...</p> : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs">
              <tr>{['ID', '이메일', '닉네임', '역할', '상태', '가입일', '관리'].map(h => <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400">{u.id}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3 font-medium">{u.nickname}</td>
                  <td className="px-4 py-3">
                    <select value={u.role}
                      onChange={e => changeUserRole(u.id, e.target.value).then(() => setUsers(p => p.map(x => x.id === u.id ? { ...x, role: e.target.value } : x)))}
                      className="border border-gray-200 rounded-lg px-2 py-1 text-xs">
                      {['STUDENT', 'INSTRUCTOR', 'ADMIN'].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${u.suspended ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700'}`}>
                      {u.suspended ? '정지' : '정상'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{u.createdAt?.slice(0, 10)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => suspendUser(u.id, !u.suspended).then(() => setUsers(p => p.map(x => x.id === u.id ? { ...x, suspended: !u.suspended } : x)))}
                      className={`text-xs px-3 py-1 rounded-lg border ${u.suspended ? 'border-green-400 text-green-600' : 'border-red-300 text-red-500'}`}>
                      {u.suspended ? '정지 해제' : '정지'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function AdminCoursePage() {
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { listAdminCourses().then(setCourses).finally(() => setLoading(false)); }, []);
  const toggle = (id: number, cur: boolean) =>
    setCourseVisibility(id, !cur).then(() => setCourses(p => p.map(c => c.id === id ? { ...c, isVisible: !cur } : c)));

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">강의 관리</h1>
      {loading ? <p className="text-center text-gray-400">불러오는 중...</p> : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs">
              <tr>{['ID', '제목', '강사', '레벨', '노출', '등록일', '관리'].map(h => <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {courses.map(c => (
                <tr key={c.id} className={`hover:bg-gray-50 ${!c.isVisible ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3 text-gray-400">{c.id}</td>
                  <td className="px-4 py-3 font-medium max-w-xs truncate">{c.title}</td>
                  <td className="px-4 py-3 text-gray-500">{c.instructorId}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">{c.level}</span></td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.isVisible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {c.isVisible ? '노출' : '숨김'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{c.createdAt?.slice(0, 10)}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggle(c.id, c.isVisible)}
                      className="text-xs px-3 py-1 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50">
                      {c.isVisible ? '숨기기' : '노출하기'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { listAuditLogs().then(setLogs).finally(() => setLoading(false)); }, []);

  const colors: Record<string, string> = {
    APPROVE_INSTRUCTOR: 'bg-green-100 text-green-700',
    REJECT_INSTRUCTOR:  'bg-red-100 text-red-600',
    CHANGE_ROLE:        'bg-blue-100 text-blue-700',
    SUSPEND_USER:       'bg-red-100 text-red-600',
    UNSUSPEND_USER:     'bg-green-100 text-green-700',
    HIDE_COURSE:        'bg-amber-100 text-amber-700',
    SHOW_COURSE:        'bg-green-100 text-green-700',
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">감사 로그</h1>
      {loading ? <p className="text-center text-gray-400">불러오는 중...</p> : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs">
              <tr>{['ID', '어드민', '행위', '대상', '메모', '시각'].map(h => <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-400">{log.id}</td>
                  <td className="px-4 py-3 text-gray-500">{log.adminId}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[log.action] ?? 'bg-gray-100 text-gray-600'}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{log.targetType} #{log.targetId}</td>
                  <td className="px-4 py-3 text-gray-400 max-w-xs truncate">{log.memo}</td>
                  <td className="px-4 py-3 text-gray-400">{log.createdAt?.slice(0, 16).replace('T', ' ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
