# HoopPath P3 운영형 확장

## 구현 기능

- 사용자별 Discord Webhook 구독, 테스트 전송, 구독 해지
- 매일 오전 9시 7일 미학습 사용자 독려 배치
- 사용자당 하루 1회 중복 발송 방지
- 성공·실패 전송 이력과 관리자 조회 화면
- 관리자 수동 배치 실행과 실행 결과 요약
- Actuator health, info, metrics 운영 엔드포인트
- 관리자 사용자 검색 DB 조건 조회 및 페이지네이션
- Docker 개발·운영 환경의 알림 스케줄 설정

## 시연 순서

1. 일반 사용자로 로그인하고 마이페이지에서 Discord Webhook URL을 등록한다.
2. `테스트 전송`을 눌러 Discord 메시지 수신을 확인한다.
3. 관리자로 로그인하고 `알림 운영 로그`에서 테스트 성공 이력을 확인한다.
4. `학습 독려 배치 실행`을 눌러 대상·성공·실패·중복 제외 수를 확인한다.
5. `/actuator/health`로 공개 상태 확인을 시연하고, 관리자 토큰으로 `/actuator/metrics`를 조회한다.
6. 관리자 회원 관리 화면에서 검색과 페이지 이동을 시연한다.

## 주요 API

- `GET|PUT|DELETE /api/v1/notifications/subscription`
- `POST /api/v1/notifications/subscription/test`
- `GET /api/v1/admin/notification-logs`
- `POST /api/v1/admin/notification-jobs/learning-reminder`
- `GET /actuator/health`
- `GET /actuator/info`
- `GET /actuator/metrics`

## 운영 설정

- `NOTIFICATION_SCHEDULE_ENABLED`: 자동 스케줄 실행 여부
- `NOTIFICATION_SCHEDULE_CRON`: 기본값 `0 0 9 * * *`
- `NOTIFICATION_INACTIVE_DAYS`: 기본값 `7`

Webhook URL은 API 응답과 전송 로그에 노출하지 않는다. 실패 로그에는 외부 호출 예외 유형만 기록한다.
