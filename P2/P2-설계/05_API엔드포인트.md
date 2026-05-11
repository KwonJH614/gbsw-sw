# API 엔드포인트 명세 (P2)

> HoopPath — 2단계 확장 REST API 설계
> 2026년 4월

---

## 공통 규칙 (P1과 동일)

| 항목 | 내용 |
|------|------|
| Base URL | http://localhost:8080/api/v1 |
| 인증 방식 | Authorization: Bearer {accessToken} |
| Content-Type | application/json |
| 성공 응답 | `{ "success": true, "data": { ... } }` |
| 실패 응답 | `{ "success": false, "error": { "code": "...", "message": "..." } }` |

### 권한 표기

| 표기 | 의미 |
|------|------|
| 🔓 | 비로그인 가능 |
| 🔒 | 로그인 필요 |
| 🎓 | STUDENT 권한 |
| 👨‍🏫 | INSTRUCTOR 권한 |
| 🛡️ | ADMIN 권한 |

> P1에서 정의된 엔드포인트는 이 문서에 **다시 적지 않는다**. 변경되는 경우만 기술.

### @AuthenticationPrincipal 사용 규칙

모든 P2 컨트롤러는 `@AuthenticationPrincipal CustomUserDetails userDetails` 로 받고
`userDetails.getId()`로 userId를 추출한다. `Long`으로 직접 받으면 null이 주입된다.

---

## 1. 인증 (/auth) — 변경

| 메서드 | 엔드포인트 | 권한 | 설명 |
|--------|-----------|------|------|
| POST | /auth/login | 🔓 | (변경) 응답에 `user.role` 포함 |
| GET | /users/me | 🔒 | 앱 초기화 시 호출 — DB 최신 role 반영 |

**login 응답**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "user": { "id": 1, "email": "a@a.com", "nickname": "foo", "role": "INSTRUCTOR" }
  }
}
```

---

## 2. 강사 신청 (/instructor-applications) — 신규

| 메서드 | 엔드포인트 | 권한 | 설명 | 상태 |
|--------|-----------|------|------|------|
| POST | /instructor-applications | 🔒🎓 | 강사 신청 | ✅ |
| GET | /instructor-applications/me | 🔒 | 내 신청 최신 1건 | ✅ |
| GET | /instructor-applications?status=PENDING | 🔒🛡️ | 신청 목록 (어드민) | ✅ |
| POST | /instructor-applications/{id}/approve | 🔒🛡️ | 승인 → role 변경 + Instructor 생성 | ✅ |
| POST | /instructor-applications/{id}/reject | 🔒🛡️ | 거절, body: `{ reason }` | ✅ |

---

## 3. 강의 (/courses) — 확장

| 메서드 | 엔드포인트 | 권한 | 설명 | 상태 |
|--------|-----------|------|------|------|
| GET | /courses | 🔓 | (변경) isVisible=true만 노출 | ✅ |
| POST | /courses | 🔒👨‍🏫 | 강의 생성 | ✅ |
| PATCH | /courses/{id} | 🔒👨‍🏫 | 내 강의 수정 | ✅ |
| DELETE | /courses/{id} | 🔒👨‍🏫 | 수강생 없을 때만 삭제, 있으면 409 | ✅ |
| GET | /courses/me | 🔒👨‍🏫 | 내 강의 목록 (수강생 수, 평균 별점) | ✅ |
| GET | /courses/{id}/students | 🔒👨‍🏫 | 내 강의 수강생 목록 | ✅ |

---

## 4. 레슨 (/courses/{courseId}/lessons, /lessons) — 확장

| 메서드 | 엔드포인트 | 권한 | 설명 | 상태 |
|--------|-----------|------|------|------|
| POST | /courses/{courseId}/lessons | 🔒👨‍🏫 | 레슨 생성 | ✅ |
| PATCH | /lessons/{id} | 🔒👨‍🏫 | 레슨 수정 | ✅ |
| DELETE | /lessons/{id} | 🔒👨‍🏫 | 레슨 삭제 (진도 있으면 confirm 후 force) | ✅ |
| PATCH | /courses/{courseId}/lessons/reorder | 🔒👨‍🏫 | 순서 일괄 변경 | ✅ |

---

## 5. 수강생 대시보드 (/dashboard) — 신규

| 메서드 | 엔드포인트 | 권한 | 설명 | 상태 |
|--------|-----------|------|------|------|
| GET | /dashboard/overview | 🔒🎓 | 지표 4종 + 최근 강의 + 로드맵 달성률 | ✅ |
| GET | /dashboard/activities?limit=10 | 🔒🎓 | 활동 피드 | ✅ |

**overview 응답**
```json
{
  "stats": {
    "activeCourses": 3,
    "completedCourses": 1,
    "totalWatchedMinutes": 420,
    "reviewsWritten": 2
  },
  "recentCourses": [
    { "courseId": 5, "title": "...", "thumbnailUrl": "...", "lastLessonId": 12, "watchedSeconds": 300 }
  ],
  "roadmapProgress": [
    { "roadmapId": 1, "title": "입문", "completionRate": 45 }
  ]
}
```

---

## 6. 어드민 (/admin) — 신규

### 6-1. 회원 관리

| 메서드 | 엔드포인트 | 권한 | 설명 | 상태 |
|--------|-----------|------|------|------|
| GET | /admin/users?q=&role=&suspended= | 🔒🛡️ | 회원 목록 | ✅ |
| PATCH | /admin/users/{id}/role | 🔒🛡️ | body: `{ "role": "INSTRUCTOR" }` | ✅ |
| PATCH | /admin/users/{id}/suspend | 🔒🛡️ | body: `{ "suspended": true }` | ✅ |

### 6-2. 강의 관리

| 메서드 | 엔드포인트 | 권한 | 설명 | 상태 |
|--------|-----------|------|------|------|
| GET | /admin/courses | 🔒🛡️ | 전체 강의 (isVisible 무시) | ✅ |
| PATCH | /admin/courses/{id}/visibility | 🔒🛡️ | body: `{ "visible": false }` | ✅ |

### 6-3. 감사 로그

| 메서드 | 엔드포인트 | 권한 | 설명 | 상태 |
|--------|-----------|------|------|------|
| GET | /admin/audit-logs | 🔒🛡️ | 어드민 행위 로그 최신순 | ✅ |

---

## 7. 공통 에러 코드 (P2 추가)

| HTTP | 코드 | 설명 | 발생 위치 |
|------|------|------|----------|
| 403 | ROLE_REQUIRED | 역할 부족 (`AccessDeniedException` → handler) | 모든 @PreAuthorize |
| 403 | NOT_OWNER | 본인 소유 리소스 아님 | CourseService, LessonService |
| 409 | APPLICATION_PENDING | 이미 PENDING 신청 존재 | InstructorApplicationService |
| 409 | DELETE_BLOCKED | 수강생 있어 강의 삭제 불가 | CourseService |
| 409 | SELF_DEMOTION | 본인 role 직접 변경 시도 | AdminUserService |
| 403 | ACCOUNT_SUSPENDED | 정지 계정 로그인 시도 | AuthService |
