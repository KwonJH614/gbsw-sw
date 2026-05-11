import { NavLink, Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const NAV_ITEMS = [
  { to: '/instructor',             label: '대시보드',    icon: '📊', end: true },
  { to: '/instructor/courses/new', label: '새 강의 등록', icon: '➕' },
];

export default function InstructorLayout() {
  const { isAuthenticated, isInstructor, isLoading } = useAuthStore();
  if (isLoading) return null;
  if (!isAuthenticated || !isInstructor()) return <Navigate to="/403" replace />;

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 flex-shrink-0 border-r border-gray-200 bg-gray-50 pt-8">
        <p className="px-5 mb-4 text-xs font-semibold uppercase tracking-widest text-gray-400">Instructor</p>
        <nav className="flex flex-col gap-1 px-3">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto bg-white">
        <Outlet />
      </main>
    </div>
  );
}
