package com.hooppath.domain.instructor.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.time.LocalDateTime;

@Entity
@Table(name = "instructor_applications")
@EntityListeners(AuditingEntityListener.class)
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class InstructorApplication {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false) private Long userId;
    @Column(nullable = false, columnDefinition = "TEXT") private String bio;
    @Column(nullable = false, columnDefinition = "TEXT") private String career;
    @Column(nullable = false, length = 500) private String sampleVideoUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ApplicationStatus status = ApplicationStatus.PENDING;

    @Column(length = 500) private String rejectionReason;
    private Long reviewedBy;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime reviewedAt;

    public enum ApplicationStatus { PENDING, APPROVED, REJECTED }

    @Builder
    public InstructorApplication(Long userId, String bio, String career, String sampleVideoUrl) {
        this.userId = userId;
        this.bio = bio;
        this.career = career;
        this.sampleVideoUrl = sampleVideoUrl;
        this.status = ApplicationStatus.PENDING;
    }

    public void approve(Long adminId) {
        this.status = ApplicationStatus.APPROVED;
        this.reviewedBy = adminId;
        this.reviewedAt = LocalDateTime.now();
    }

    public void reject(Long adminId, String reason) {
        this.status = ApplicationStatus.REJECTED;
        this.reviewedBy = adminId;
        this.rejectionReason = reason;
        this.reviewedAt = LocalDateTime.now();
    }
}
