# ERD (P2)

> HoopPath — 2단계 확장 데이터베이스 설계
> 2026년 4월

---

## 1. P2 변경 요약

| 테이블 | 변경 유형 | 내용 | 상태 |
|--------|-----------|------|------|
| users | ALTER | `is_suspended` 컬럼 추가 | ✅ |
| courses | ALTER | `is_visible` 컬럼 추가 | ✅ |
| instructor_applications | 신규 | 강사 신청 테이블 | ✅ |
| admin_audit_logs | 신규 | 어드민 행위 감사 로그 | ✅ |

P1의 `instructors`, `enrollments`, `progress`, `reviews`, `roadmaps`, `roadmap_courses` 는 스키마 변경 없음.

---

## 2. 엔티티 관계 (P2 추가분)

| 관계 | 설명 |
|------|------|
| users → instructor_applications (1:N) | 한 회원이 여러 번 신청/거절/재신청 가능 |
| users → admin_audit_logs (1:N) | 어드민이 수행한 행위 기록 |

기존 P1 관계는 P1 ERD 참조.

---

## 3. 변경 테이블 상세

### users (수정)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | BIGINT | PK | (기존) |
| email | VARCHAR(255) | NOT NULL, UNIQUE | (기존) |
| password | VARCHAR(255) | NOT NULL | (기존) |
| nickname | VARCHAR(50) | NOT NULL, UNIQUE | (기존) |
| profile_image_url | VARCHAR(500) | NULLABLE | (기존) |
| role | VARCHAR(20) | NOT NULL, DEFAULT 'STUDENT' | STUDENT / INSTRUCTOR / ADMIN |
| **is_suspended** | **BOOLEAN** | **NOT NULL, DEFAULT false** | **★ P2 추가 — 정지 여부** |
| created_at | DATETIME | NOT NULL | (기존) |
| updated_at | DATETIME | NOT NULL | (기존) |

> User.java 에 추가된 메서드: `promoteToInstructor()` / `changeRole(String)` / `setSuspended(boolean)` / `isSuspended()`

---

### courses (수정)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | BIGINT | PK | (기존) |
| instructor_id | BIGINT | FK → instructors.id | (기존) |
| title | VARCHAR(200) | NOT NULL | (기존) |
| description | TEXT | NULLABLE | (기존) |
| thumbnail_url | VARCHAR(500) | NULLABLE | (기존) |
| level | VARCHAR(20) | NOT NULL | (기존) |
| **is_visible** | **BOOLEAN** | **NOT NULL, DEFAULT true** | **★ P2 추가 — 노출 여부** |
| created_at | DATETIME | NOT NULL | (기존) |

> Course.java 에 추가된 메서드: `setVisible(boolean)` / `isVisible()`

---

## 4. 신규 테이블

### instructor_applications (강사 신청)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 신청 ID |
| user_id | BIGINT | FK → users.id, NOT NULL | 신청자 |
| bio | TEXT | NOT NULL | 강사 소개 |
| career | TEXT | NOT NULL | 경력 |
| sample_video_url | VARCHAR(500) | NOT NULL | 샘플 영상 URL |
| status | VARCHAR(20) | NOT NULL, DEFAULT 'PENDING' | PENDING / APPROVED / REJECTED |
| rejection_reason | VARCHAR(500) | NULLABLE | REJECTED 시 사유 |
| reviewed_by | BIGINT | FK → users.id, NULLABLE | 처리한 어드민 |
| created_at | DATETIME | NOT NULL | 신청 시각 |
| reviewed_at | DATETIME | NULLABLE | 처리 시각 |

> PENDING 중복 방지: `existsByUserIdAndStatus(userId, PENDING)` 서비스 체크 → 409 APPLICATION_PENDING

---

### admin_audit_logs (어드민 감사 로그)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| id | BIGINT | PK, AUTO_INCREMENT | 로그 ID |
| admin_id | BIGINT | FK → users.id, NOT NULL | 수행 어드민 |
| action | VARCHAR(50) | NOT NULL | CHANGE_ROLE / SUSPEND_USER / UNSUSPEND_USER / APPROVE_INSTRUCTOR / REJECT_INSTRUCTOR / SHOW_COURSE / HIDE_COURSE |
| target_type | VARCHAR(30) | NOT NULL | USER / COURSE / APPLICATION |
| target_id | BIGINT | NOT NULL | 대상 ID |
| memo | VARCHAR(500) | NULLABLE | 자유 메모 |
| created_at | DATETIME | NOT NULL | 수행 시각 |

> `AdminAuditLogService.record()`는 `REQUIRES_NEW` 트랜잭션으로 메인 실패 시에도 로그 보존

---

## 5. 마이그레이션 스크립트

파일: `backend/src/main/resources/db/migration/V2__p2_schema.sql`

```sql
ALTER TABLE users
    ADD COLUMN is_suspended BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE courses
    ADD COLUMN is_visible BOOLEAN  NOT NULL DEFAULT true,
    ADD COLUMN updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP;

UPDATE courses SET updated_at = created_at WHERE updated_at IS NULL;

CREATE TABLE instructor_applications (
    id               BIGINT       PRIMARY KEY AUTO_INCREMENT,
    user_id          BIGINT       NOT NULL,
    bio              TEXT         NOT NULL,
    career           TEXT         NOT NULL,
    sample_video_url VARCHAR(500) NOT NULL,
    status           VARCHAR(20)  NOT NULL DEFAULT 'PENDING',
    rejection_reason VARCHAR(500) NULL,
    reviewed_by      BIGINT       NULL,
    created_at       DATETIME     NOT NULL,
    reviewed_at      DATETIME     NULL,
    CONSTRAINT fk_app_user     FOREIGN KEY (user_id)     REFERENCES users(id),
    CONSTRAINT fk_app_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id),
    INDEX idx_app_user_status (user_id, status),
    INDEX idx_app_status (status)
);

CREATE TABLE admin_audit_logs (
    id          BIGINT      PRIMARY KEY AUTO_INCREMENT,
    admin_id    BIGINT      NOT NULL,
    action      VARCHAR(50) NOT NULL,
    target_type VARCHAR(30) NOT NULL,
    target_id   BIGINT      NOT NULL,
    memo        VARCHAR(500) NULL,
    created_at  DATETIME    NOT NULL,
    CONSTRAINT fk_audit_admin FOREIGN KEY (admin_id) REFERENCES users(id),
    INDEX idx_audit_admin_time (admin_id, created_at)
);

-- 초기 어드민 계정 (비밀번호는 bcrypt로 직접 생성 후 삽입)
INSERT INTO users (email, password, nickname, role, is_suspended, created_at, updated_at)
VALUES ('admin@hooppath.local', '<bcrypt>', 'admin', 'ADMIN', false, NOW(), NOW());
```
