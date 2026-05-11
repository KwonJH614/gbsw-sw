# API 엔드포인트 명세 (P2)

> HoopPath — 2단계 확장 REST API 설계
> 2026년 4월

---

## 공통 규칙 (P1과 동일)

| 항목           | 내용                                                                   |
| ------------ | -------------------------------------------------------------------- |
| Base URL     | http://localhost:8080/api/v1                                         |
| 인증 방식        | Authorization: Bearer {accessToken}                                  |
| Content-Type | application/json                                                     |
| 성공 응답        | `{ "success": true, "data": { ... } }`                               |
| 실패 응답        | `{ "success": false, "error": { "code": "...", "message": "..." } }` |

### 권한 표기

| 표기 | 의미 |
|------|------|
| 🔓 | 비로그인 가능 |
| 🔒 | 로그인 필요 |
| 🎓 | STUDENT 권한 |
| 👨‍🏫 | INSTRUCTOR 권한 |
| 🛡️ | ADMIN 권한 |

> P1에서 정의된 엔드포인트는 이 문서에 **다시 적지 않는다**. 변경되는 경우만 "(변경)" 표시와 함께 기술.

---

## 1. 인증 (/auth) — 변경

| 메서드 | 엔드포인트 | 권한 | 설명 |
|--------|-----------|------|------|
| POST | /auth/login | 🔓 | (변경) 응답에 `role` 포함, JWT claims에 `role` 포함 |

**응답 변경 예시**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "user": {
      "id": 1,
      "email": "a@a.com",
      "nickname": "foo",
      "role": "INSTRUCTOR"
    }
  }
}
```

---

## 2. 강사 신청 (/instructor-applications) — 신규

| 메서드 | 엔드포인트 | 권한 | 설명 |
|--------|-----------|------|------|
| POST | /instructor-applications | 🔒 🎓 | 강사 신청 (PENDING 생성) |
| GET | /instructor-applications/me | 🔒 | 내 신청 상태 조회 (최신 1건) |
| GET | /instructor-applications | 🔒 🛡️ | (어드민) 신청 목록 조회, `?status=PENDING` 필터 |
| POST | /instructor-applications/{id}/approve | 🔒 🛡️ | (어드민) 승인 → user.role 변경 + instructors 생성 |
| POST | /instructor-applications/{id}/reject | 🔒 🛡️ | (어드민) 거절, body에 `reason` |

---

## 3. 강의 (/courses) — 확장

| 메서드 | 엔드포인트 | 권한 | 설명 |
|--------|-----------|------|------|
| GET | /courses | 🔓 | (변경) `is_visible=true` 만 노출 (어드민은 모두) |
| POST | /courses | 🔒 👨‍🏫 | 강의 생성 |
| PATCH | /courses/{id} | 🔒 👨‍🏫 | 내 강의만 수정 (타인 강의 시 403) |
| DELETE | /courses/{id} | 🔒 👨‍🏫 | 수강생 없을 때만 삭제 (있으면 409 DELETE_BLOCKED) |
| GET | /courses/me | 🔒 👨‍🏫 | 내가 만든 강의 목록 (수강생 수, 평균 별점 포함) |
| GET | /courses/{id}/students | 🔒 👨‍🏫 | 내 강의 수강생 목록 (진도율 포함) |

---

## 4. 레슨 (/courses/{courseId}/lessons, /lessons) — 신규

| 메서드 | 엔드포인트 | 권한 | 설명 |
|--------|-----------|------|------|
| POST | /courses/{courseId}/lessons | 🔒 👨‍🏫 | 레슨 생성 (본인 강의만) |
| PATCH | /lessons/{id} | 🔒 👨‍🏫 | 레슨 수정 (본인 강의의 레슨만) |
| DELETE | /lessons/{id} | 🔒 👨‍🏫 | 레슨 삭제 (진도 있으면 경고 후 `?force=true` 로만 강제) |
| PATCH | /courses/{courseId}/lessons/reorder | 🔒 👨‍🏫 | 순서 일괄 변경, body: `[{ id, orderIndex }, ...]` |

---

## 5. 수강생 대시보드 (/dashboard) — 신규

| 메서드 | 엔드포인트 | 권한 | 설명 |
|--------|-----------|------|------|
| GET | /dashboard/overview | 🔒 🎓 | 누적 지표 4종 + 최근 본 강의 3개 + 로드맵 달성률 목록 |
| GET | /dashboard/activities | 🔒 🎓 | 최근 활동 피드 (`?limit=10`, 시청/완료/리뷰 이벤트) |

**overview 응답 예시**
```json
{
  "stats": {
    "activeCourses": 3,
    "completedCourses": 1,
    "totalWatchedMinutes": 420,
    "reviewsWritten": 2
  },
  "recentCourses": [
    { "courseId": 5, "title": "...", "lastLessonId": 12, "watchedSeconds": 300 }
  ],
  "roadmapProgress": [
    { "roadmapId": 1, "title": "입문", "completionRate": 45 }
  ]
}
```

---

## 6. 어드민 (/admin) — 신규

### 6-1. 회원 관리

| 메서드 | 엔드포인트 | 권한 | 설명 |
|--------|-----------|------|------|
| GET | /admin/users | 🔒 🛡️ | 회원 목록 (`?q=&role=&suspended=`) |
| PATCH | /admin/users/{id}/role | 🔒 🛡️ | body: `{ "role": "INSTRUCTOR" }` |
| PATCH | /admin/users/{id}/suspend | 🔒 🛡️ | body: `{ "suspended": true }` |

### 6-2. 강의 관리

| 메서드 | 엔드포인트 | 권한 | 설명 |
|--------|-----------|------|------|
| GET | /admin/courses | 🔒 🛡️ | 전체 강의 (is_visible 무시) |
| PATCH | /admin/courses/{id}/visibility | 🔒 🛡️ | body: `{ "visible": false }` |

### 6-3. 감사 로그 (권장)

| 메서드 | 엔드포인트 | 권한 | 설명 |
|--------|-----------|------|------|
| GET | /admin/audit-logs | 🔒 🛡️ | 어드민 행위 로그 최신순 |

---

## 7. 공통 에러 코드 (P2 추가)

| HTTP | 코드 | 설명 |
|------|------|------|
| 403 | ROLE_REQUIRED | 역할 부족 (예: INSTRUCTOR 필요) |
| 403 | NOT_OWNER | 본인 소유 리소스가 아님 (강의/레슨 수정 시도) |
| 409 | APPLICATION_PENDING | 이미 PENDING 상태 신청 존재 |
| 409 | DELETE_BLOCKED | 수강생이 있어 강의 삭제 불가 |
| 409 | SELF_DEMOTION | 본인 role을 스스로 강등 시도 |
| 403 | ACCOUNT_SUSPENDED | 정지된 계정의 로그인 시도 |
