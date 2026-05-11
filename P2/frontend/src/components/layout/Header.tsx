import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const { isAuthenticated, user, isLoading, isInstructor, isAdmin } = useAuthStore();
  const { logout } = useAuth();

  if (isLoading) {
    return (
      <header className="bg-surface border-b border-border">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to="/" className="text-xl font-bold text-primary">
            HoopPath
          </Link>
        </div>
      </header>
    );
  }

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

          {/* 강사 메뉴 */}
          {isAuthenticated && isInstructor() && !isAdmin() && (
            <Link to="/instructor" className="text-text-secondary hover:text-text">
              내 강의 관리
            </Link>
          )}

          {/* 어드민 메뉴 */}
          {isAuthenticated && isAdmin() && (
            <>
              <Link to="/admin" className="text-text-secondary hover:text-text">
                어드민
              </Link>
              <Link to="/admin/applications" className="text-text-secondary hover:text-text">
                강사 신청
              </Link>
            </>
          )}

          {isAuthenticated ? (
            <>
              {/* 수강생 대시보드 */}
              {!isAdmin() && !isInstructor() && (
                <Link to="/dashboard" className="text-text-secondary hover:text-text">
                  대시보드
                </Link>
              )}

              {/* 강사 신청 (STUDENT만) */}
              {user?.role === 'STUDENT' && (
                <Link to="/instructor/apply" className="text-text-secondary hover:text-text">
                  강사 신청
                </Link>
              )}

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
