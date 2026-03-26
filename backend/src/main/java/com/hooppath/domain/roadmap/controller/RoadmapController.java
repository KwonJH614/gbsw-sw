package com.hooppath.domain.roadmap.controller;

import com.hooppath.domain.roadmap.dto.RoadmapDetailResponse;
import com.hooppath.domain.roadmap.dto.RoadmapListResponse;
import com.hooppath.domain.roadmap.service.RoadmapService;
import com.hooppath.global.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/roadmaps")
@RequiredArgsConstructor
public class RoadmapController {

    private final RoadmapService roadmapService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RoadmapListResponse>>> getList() {
        return ResponseEntity.ok(ApiResponse.ok(roadmapService.getList()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RoadmapDetailResponse>> getDetail(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(roadmapService.getDetail(id)));
    }
}
