package com.hooppath.domain.dashboard.service;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final JdbcTemplate jdbc;

    @Transactional(readOnly = true)
    public DashboardOverviewDto getOverview(Long userId) {
        return new DashboardOverviewDto(getStats(userId), getRecentCourses(userId), getRoadmapProgress(userId));
    }

    private StatsDto getStats(Long userId) {
        Map<String, Object> row = jdbc.queryForMap(
            "SELECT " +
            "  COALESCE(SUM(CASE WHEN course_progress.completedLessons >= course_progress.totalLessons " +
            "                    AND course_progress.totalLessons > 0 THEN 0 ELSE 1 END), 0) AS activeCourses, " +
            "  COALESCE(SUM(CASE WHEN course_progress.completedLessons >= course_progress.totalLessons " +
            "                    AND course_progress.totalLessons > 0 THEN 1 ELSE 0 END), 0) AS completedCourses, " +
            "  COALESCE((SELECT SUM(p.last_position) FROM progresses p WHERE p.user_id = ?) / 60, 0) AS totalWatchedMinutes, " +
            "  (SELECT COUNT(*) FROM reviews r WHERE r.user_id = ?) AS reviewsWritten " +
            "FROM ( " +
            "  SELECT e.course_id, COUNT(l.id) AS totalLessons, " +
            "         COUNT(CASE WHEN p.completed = true THEN 1 END) AS completedLessons " +
            "  FROM enrollments e " +
            "  JOIN lessons l ON l.course_id = e.course_id " +
            "  LEFT JOIN progresses p ON p.lesson_id = l.id AND p.user_id = e.user_id " +
            "  WHERE e.user_id = ? " +
            "  GROUP BY e.course_id " +
            ") course_progress",
            userId, userId, userId);
        return new StatsDto(
                ((Number) row.get("activeCourses")).intValue(),
                ((Number) row.get("completedCourses")).intValue(),
                ((Number) row.get("totalWatchedMinutes")).intValue(),
                ((Number) row.get("reviewsWritten")).intValue());
    }

    private List<RecentCourseDto> getRecentCourses(Long userId) {
        return jdbc.query(
            "SELECT c.id AS courseId, c.title, c.thumbnail_url AS thumbnailUrl, " +
            "       p.lesson_id AS lastLessonId, p.last_position AS watchedSeconds " +
            "FROM progresses p " +
            "JOIN lessons l ON l.id = p.lesson_id " +
            "JOIN courses c ON c.id = l.course_id " +
            "WHERE p.user_id = ? " +
            "ORDER BY p.updated_at DESC LIMIT 3",
            (rs, i) -> new RecentCourseDto(
                    rs.getLong("courseId"), rs.getString("title"),
                    rs.getString("thumbnailUrl"), rs.getLong("lastLessonId"), rs.getInt("watchedSeconds")),
            userId);
    }

    private List<RoadmapProgressDto> getRoadmapProgress(Long userId) {
        return jdbc.query(
            "SELECT r.id AS roadmapId, r.title, " +
            "       ROUND(100.0 * COUNT(CASE WHEN p.completed = true THEN 1 END) " +
            "             / NULLIF(COUNT(l.id), 0), 0) AS completionRate " +
            "FROM roadmaps r " +
            "JOIN roadmap_courses rc ON rc.roadmap_id = r.id " +
            "JOIN courses c ON c.id = rc.course_id " +
            "JOIN lessons l ON l.course_id = c.id " +
            "LEFT JOIN enrollments e ON e.course_id = c.id AND e.user_id = ? " +
            "LEFT JOIN progresses p ON p.lesson_id = l.id AND p.user_id = e.user_id " +
            "GROUP BY r.id, r.title ORDER BY r.id",
            (rs, i) -> new RoadmapProgressDto(
                    rs.getLong("roadmapId"), rs.getString("title"), rs.getInt("completionRate")),
            userId);
    }

    @Transactional(readOnly = true)
    public List<ActivityDto> getActivities(Long userId, int limit) {
        return jdbc.query(
            "SELECT * FROM (" +
            "  SELECT 'PROGRESS' AS type, CONCAT(l.title, ' 학습 중') AS message, p.updated_at AS occurredAt " +
            "  FROM progresses p JOIN lessons l ON l.id = p.lesson_id " +
            "  WHERE p.user_id = ? " +
            "  UNION ALL " +
            "  SELECT 'COMPLETED', CONCAT(l.title, ' 완료'), p.updated_at " +
            "  FROM progresses p JOIN lessons l ON l.id = p.lesson_id " +
            "  WHERE p.user_id = ? AND p.completed = true " +
            "  UNION ALL " +
            "  SELECT 'REVIEW', CONCAT(c.title, ' 리뷰 작성'), r.created_at " +
            "  FROM reviews r JOIN courses c ON c.id = r.course_id WHERE r.user_id = ? " +
            ") combined ORDER BY occurredAt DESC LIMIT ?",
            (rs, i) -> new ActivityDto(rs.getString("type"), rs.getString("message"), rs.getString("occurredAt")),
            userId, userId, userId, limit);
    }

    public record DashboardOverviewDto(StatsDto stats, List<RecentCourseDto> recentCourses, List<RoadmapProgressDto> roadmapProgress) {}
    public record StatsDto(int activeCourses, int completedCourses, int totalWatchedMinutes, int reviewsWritten) {}
    public record RecentCourseDto(Long courseId, String title, String thumbnailUrl, Long lastLessonId, int watchedSeconds) {}
    public record RoadmapProgressDto(Long roadmapId, String title, int completionRate) {}
    public record ActivityDto(String type, String message, String occurredAt) {}
}
