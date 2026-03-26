package com.hooppath.domain.roadmap.dto;

import com.hooppath.domain.roadmap.entity.Roadmap;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class RoadmapDetailResponse {
    private Long id;
    private String title;
    private String description;
    private String level;
    private String thumbnailUrl;
    private List<RoadmapCourseResponse> courses;

    public static RoadmapDetailResponse of(Roadmap roadmap, List<RoadmapCourseResponse> courses) {
        return new RoadmapDetailResponse(
                roadmap.getId(),
                roadmap.getTitle(),
                roadmap.getDescription(),
                roadmap.getLevel().name(),
                roadmap.getThumbnailUrl(),
                courses
        );
    }
}
