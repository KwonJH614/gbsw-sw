package com.hooppath.domain.course.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "lessons")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Lesson {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 500)
    private String videoUrl;

    @Column(nullable = false)
    private Integer duration;

    @Column(nullable = false)
    private Integer orderIndex;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    @Builder
    public Lesson(Course course, String title, String videoUrl, Integer duration, Integer orderIndex) {
        this.course = course;
        this.title = title;
        this.videoUrl = videoUrl;
        this.duration = duration;
        this.orderIndex = orderIndex;
    }

    public static Lesson create(Course course, String title, String videoUrl, Integer duration, Integer orderIndex) {
        return Lesson.builder()
                .course(course)
                .title(title)
                .videoUrl(videoUrl)
                .duration(duration)
                .orderIndex(orderIndex)
                .build();
    }

    public void update(String title, String videoUrl, Integer duration) {
        if (title != null) this.title = title;
        if (videoUrl != null) this.videoUrl = videoUrl;
        if (duration != null) this.duration = duration;
    }

    public void updateOrderIndex(int orderIndex) {
        this.orderIndex = orderIndex;
    }
}
