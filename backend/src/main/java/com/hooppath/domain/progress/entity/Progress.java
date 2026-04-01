package com.hooppath.domain.progress.entity;

import com.hooppath.domain.course.entity.Lesson;
import com.hooppath.domain.user.entity.User;
import com.hooppath.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "progresses",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "lesson_id"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Progress extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id", nullable = false)
    private Lesson lesson;

    @Column(nullable = false)
    private int lastPosition;

    @Column(nullable = false)
    private boolean completed;

    @Builder
    public Progress(User user, Lesson lesson, int lastPosition, boolean completed) {
        this.user = user;
        this.lesson = lesson;
        this.lastPosition = lastPosition;
        this.completed = completed;
    }

    public void updateProgress(int lastPosition, boolean completed) {
        this.lastPosition = lastPosition;
        if (!this.completed && completed) {
            this.completed = true;
        }
    }
}
