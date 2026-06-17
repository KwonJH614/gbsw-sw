# P3 발표용 운영 데이터 주입 가이드

## 목적

운영 서버에 `ADMIN`, `INSTRUCTOR`, `STUDENT` 계정이 각각 1개만 있는 상태에서 P3 발표에 필요한 최소 데이터를 채운다.

생성되는 데이터:

- 발표용 로드맵 2개
- 발표용 강의 3개와 강의별 레슨
- 기존 학생 계정의 수강, 진도, 리뷰, Q&A
- 기존 학생 계정의 Discord 알림 구독 placeholder와 알림 로그
- 관리자 화면에서 볼 수 있는 강사 신청과 감사 로그

## 실행 전 확인

운영 DB에서 아래 결과가 각각 1 이상인지 확인한다.

```sql
SELECT role, COUNT(*) FROM users GROUP BY role;
SELECT u.id, u.email, u.nickname, u.role FROM users u ORDER BY u.role, u.id;
```

## 실행

운영 DB에 접속한 뒤 아래 SQL 파일을 실행한다.

```text
운영스크립트/p3_demo_seed.sql
```

Docker Compose에서 MySQL 컨테이너를 쓰는 경우 예시:

```bash
docker compose exec -T db mysql -u root -p hooppath < 운영스크립트/p3_demo_seed.sql
```

DB 이름, 계정, 컨테이너 이름은 운영 서버 설정에 맞춘다.

## 실행 후 확인

```sql
SELECT title, level, is_visible FROM courses WHERE title LIKE 'P3 %';
SELECT title, level FROM roadmaps WHERE title LIKE 'P3 발표용%';
SELECT notification_type, status, failure_reason, sent_at
FROM notification_delivery_logs
ORDER BY sent_at DESC;
```

## 발표 전 주의

- `notification_subscriptions.webhook_url`에는 placeholder가 들어간다. 실제 Discord 전송을 시연하려면 학생 계정으로 로그인해서 마이페이지에서 실제 Webhook URL로 다시 등록한다.
- 학습 독려 배치 대상이 보이도록 진도 데이터의 `updated_at`은 8일 이상 지난 값으로 들어간다.
- 스크립트는 같은 발표 데이터가 중복 생성되지 않도록 작성되어 있어 재실행해도 주요 데이터가 반복 추가되지 않는다.
