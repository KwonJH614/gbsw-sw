package com.hooppath.domain.user.entity;

import com.hooppath.global.common.BaseTimeEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class User extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true, length = 50)
    private String nickname;

    @Column(length = 500)
    private String profileImageUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role = Role.STUDENT;

    @Column(nullable = false)
    private boolean isSuspended = false;

    @Builder
    public User(String email, String password, String nickname) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.role = Role.STUDENT;
        this.isSuspended = false;
    }

    public void updateNickname(String nickname) {
        this.nickname = nickname;
    }

    public void changeRole(Role role) {
        this.role = role;
    }

    // ── P2 추가 ──────────────────────────────────────
    public void promoteToInstructor() {
        this.role = Role.INSTRUCTOR;
    }

    public void changeRole(String role) {
        this.role = Role.valueOf(role);
    }

    public void setSuspended(boolean suspended) {
        this.isSuspended = suspended;
    }
}
