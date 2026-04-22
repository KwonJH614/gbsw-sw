import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import PrivateRoute from './PrivateRoute';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import RoadmapListPage from '../pages/roadmap/RoadmapListPage';
import RoadmapDetailPage from '../pages/roadmap/RoadmapDetailPage';
import CourseListPage from '../pages/course/CourseListPage';
import CourseDetailPage from '../pages/course/CourseDetailPage';
import LessonPlayerPage from '../pages/course/LessonPlayerPage';
import MyPage from '../pages/mypage/MyPage';

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      // Public routes
      { path: '/', element: <RoadmapListPage /> },
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
      { path: '/roadmaps', element: <RoadmapListPage /> },
      { path: '/roadmaps/:id', element: <RoadmapDetailPage /> },
      { path: '/courses', element: <CourseListPage /> },
      { path: '/courses/:id', element: <CourseDetailPage /> },

      // Protected routes
      {
        element: <PrivateRoute />,
        children: [
          { path: '/courses/:id/lessons/:lessonId', element: <LessonPlayerPage /> },
          { path: '/my', element: <MyPage /> },
        ],
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
