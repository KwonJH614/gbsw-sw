import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const { isAuthenticated, user } = useAuthStore();
  const { logout } = useAuth();

  return (
    <header className="bg-surface border-b border-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="text-xl font-bold text-primary">
          HoopPath
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link to="/roadmaps" className="text-text-secondary hover:text-text">
            로드맵
          </Link>
          <Link to="/courses" className="text-text-secondary hover:text-text">
            강의
          </Link>

          {isAuthenticated ? (
            <>
              <Link to="/my" className="text-text-secondary hover:text-text">
                {user?.nickname ?? '마이페이지'}
              </Link>
              <button
                onClick={logout}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary hover:bg-bg"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
              >
                로그인
              </Link>
              <Link
                to="/register"
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary hover:bg-bg"
              >
                회원가입
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
