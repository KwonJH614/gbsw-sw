package com.hooppath.domain.roadmap.repository;

import com.hooppath.domain.roadmap.entity.RoadmapCourse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoadmapCourseRepository extends JpaRepository<RoadmapCourse, Long> {
    List<RoadmapCourse> findByRoadmapIdOrderByOrderIndexAsc(Long roadmapId);
}
