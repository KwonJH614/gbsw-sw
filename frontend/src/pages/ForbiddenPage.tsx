import { useNavigate } from 'react-router-dom';

export default function ForbiddenPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-50">
      <div className="text-center">
        <p className="text-6xl font-bold text-blue-600 mb-2">403</p>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">접근 권한이 없습니다</h1>
        <p className="text-gray-500">이 페이지에 접근할 수 있는 권한이 없습니다.</p>
      </div>
      <div className="flex gap-3">
        <button onClick={() => navigate(-1)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100">이전 페이지</button>
        <button onClick={() => navigate('/')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">홈으로</button>
      </div>
    </div>
  );
}
