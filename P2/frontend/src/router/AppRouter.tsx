import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import PrivateRoute from './PrivateRoute';
import InstructorLayout from '../components/layout/InstructorLayout';
import AdminLayout from '../components/layout/AdminLayout';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import RoadmapListPage from '../pages/roadmap/RoadmapListPage';
import RoadmapDetailPage from '../pages/roadmap/RoadmapDetailPage';
import CourseListPage from '../pages/course/CourseListPage';
import CourseDetailPage from '../pages/course/CourseDetailPage';
import LessonPlayerPage from '../pages/course/LessonPlayerPage';
import MyPage from '../pages/mypage/MyPage';
import InstructorDashboardPage from '../pages/instructor/InstructorDashboardPage';
import CourseFormPage from '../pages/instructor/CourseFormPage';
import LessonManagePage from '../pages/instructor/LessonManagePage';
import ForbiddenPage from '../pages/ForbiddenPage';
import InstructorApplyPage from '../pages/instructor/InstructorApplyPage';
import StudentDashboardPage from '../pages/dashboard/StudentDashboardPage';
import AdminInstructorApprovalPage from '../pages/admin/AdminInstructorApprovalPage';
import { AdminDashboardPage, UserManagePage, AdminCoursePage, AuditLogPage } from '../pages/admin/AdminPages';

const router = createBrowserRouter([
  // 일반 레이아웃 (헤더+푸터)
  {
    element: <Layout />,
    children: [
      { path: '/', element: <RoadmapListPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/roadmaps', element: <RoadmapListPage /> },
      { path: '/roadmaps/:id', element: <RoadmapDetailPage /> },
      { path: '/courses', element: <CourseListPage /> },
      { path: '/courses/:id', element: <CourseDetailPage /> },
      { path: '/403', element: <ForbiddenPage /> },
      {
        element: <PrivateRoute />,
        children: [
          { path: '/courses/:id/lessons/:lessonId', element: <LessonPlayerPage /> },
          { path: '/my', element: <MyPage /> },
          { path: '/dashboard', element: <StudentDashboardPage /> },
          { path: '/instructor/apply', element: <InstructorApplyPage /> },
        ],
      },
    ],
  },

  // 강사 레이아웃 (사이드바)
  {
    element: <InstructorLayout />,
    children: [
      { path: '/instructor',                           element: <InstructorDashboardPage /> },
      { path: '/instructor/courses/new',               element: <CourseFormPage /> },
      { path: '/instructor/courses/:courseId/edit',    element: <CourseFormPage /> },
      { path: '/instructor/courses/:courseId/lessons', element: <LessonManagePage /> },
    ],
  },

  // 어드민 레이아웃 (사이드바)
  {
    element: <AdminLayout />,
    children: [
      { path: '/admin',              element: <AdminDashboardPage /> },
      { path: '/admin/users',        element: <UserManagePage /> },
      { path: '/admin/courses',      element: <AdminCoursePage /> },
      { path: '/admin/applications', element: <AdminInstructorApprovalPage /> },
      { path: '/admin/audit-logs',   element: <AuditLogPage /> },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
