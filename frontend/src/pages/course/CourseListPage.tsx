import { useState, useEffect, useCallback } from 'react';
import { courseApi } from '../../api/course.api';
import CourseCard from '../../components/course/CourseCard';
import SearchBar from '../../components/course/SearchBar';
import type { CourseListItem } from '../../types/course.types';

export default function CourseListPage() {
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    courseApi.getList()
      .then((res) => setCourses(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = useCallback((query: string) => {
    if (!query) {
      setSearching(true);
      courseApi.getList()
        .then((res) => setCourses(res.data.data))
        .catch(() => {})
        .finally(() => setSearching(false));
      return;
    }

    setSearching(true);
    courseApi.search(query)
      .then((res) => setCourses(res.data.data))
      .catch(() => {})
      .finally(() => setSearching(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <span className="text-text-secondary">로딩 중...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold">전체 강의</h1>
      <p className="mb-6 text-text-secondary">
        원하는 강의를 검색하고 학습을 시작하세요.
      </p>

      <div className="mb-8">
        <SearchBar onSearch={handleSearch} />
      </div>

      {searching && (
        <p className="mb-4 text-sm text-text-secondary">검색 중...</p>
      )}

      {courses.length === 0 ? (
        <p className="text-center text-text-secondary">강의가 없습니다.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
