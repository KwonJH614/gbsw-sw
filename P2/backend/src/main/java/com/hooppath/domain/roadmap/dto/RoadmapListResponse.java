package com.hooppath.domain.roadmap.dto;

import com.hooppath.domain.roadmap.entity.Roadmap;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class RoadmapListResponse {
    private Long id;
    private String title;
    private String description;
    private String level;
    private String thumbnailUrl;
    private int courseCount;

    public static RoadmapListResponse of(Roadmap roadmap, int courseCount) {
        return new RoadmapListResponse(
                roadmap.getId(),
                roadmap.getTitle(),
                roadmap.getDescription(),
                roadmap.getLevel().name(),
                roadmap.getThumbnailUrl(),
                courseCount
        );
    }
}
