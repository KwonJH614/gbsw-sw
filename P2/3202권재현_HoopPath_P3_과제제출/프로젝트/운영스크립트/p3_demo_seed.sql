-- HoopPath P3 presentation seed data for an existing production database.
-- Assumption: production already has one ADMIN, one INSTRUCTOR, and one STUDENT user.
-- This script is intentionally idempotent for the main presentation records.

START TRANSACTION;

SET @admin_id := (
    SELECT id FROM users WHERE role = 'ADMIN' ORDER BY id LIMIT 1
);
SET @instructor_user_id := (
    SELECT id FROM users WHERE role = 'INSTRUCTOR' ORDER BY id LIMIT 1
);
SET @student_id := (
    SELECT id FROM users WHERE role = 'STUDENT' ORDER BY id LIMIT 1
);

-- Fail early if the minimum demo accounts are not present.
INSERT INTO admin_audit_logs (admin_id, action, target_type, target_id, memo, created_at)
SELECT @admin_id, 'DEMO_SEED_CHECK', 'SYSTEM', 0, 'P3 demo seed prerequisites checked', NOW()
WHERE @admin_id IS NOT NULL
  AND @instructor_user_id IS NOT NULL
  AND @student_id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM admin_audit_logs
      WHERE action = 'DEMO_SEED_CHECK' AND memo = 'P3 demo seed prerequisites checked'
  );

-- Ensure the instructor role also has an instructor profile.
INSERT INTO instructors (user_id, bio, career, created_at)
SELECT
    @instructor_user_id,
    '농구 입문자와 학교 스포츠클럽 학생을 위한 단계별 온라인 코칭을 운영합니다.',
    '학교 스포츠클럽 농구 지도 4년 / 슈팅 클리닉 운영 / HoopPath 대표 강사',
    NOW()
WHERE @instructor_user_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM instructors WHERE user_id = @instructor_user_id);

SET @instructor_id := (
    SELECT id FROM instructors WHERE user_id = @instructor_user_id ORDER BY id LIMIT 1
);

-- Roadmaps: enough data for roadmap list/detail/progress demonstrations.
INSERT INTO roadmaps (title, description, level, thumbnail_url, created_at)
SELECT 'P3 발표용 농구 입문 로드맵',
       '처음 농구를 배우는 학생이 드리블, 슛, 수비까지 순서대로 따라갈 수 있는 발표용 로드맵입니다.',
       'BEGINNER',
       'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
       NOW()
WHERE NOT EXISTS (SELECT 1 FROM roadmaps WHERE title = 'P3 발표용 농구 입문 로드맵');

INSERT INTO roadmaps (title, description, level, thumbnail_url, created_at)
SELECT 'P3 발표용 경기 실전 로드맵',
       '수강 완료율, 복습 필요 강의, 실전 전술 강의를 함께 보여주기 위한 중급 로드맵입니다.',
       'INTERMEDIATE',
       'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1200&q=80',
       NOW()
WHERE NOT EXISTS (SELECT 1 FROM roadmaps WHERE title = 'P3 발표용 경기 실전 로드맵');

SET @roadmap_beginner_id := (
    SELECT id FROM roadmaps WHERE title = 'P3 발표용 농구 입문 로드맵' ORDER BY id LIMIT 1
);
SET @roadmap_intermediate_id := (
    SELECT id FROM roadmaps WHERE title = 'P3 발표용 경기 실전 로드맵' ORDER BY id LIMIT 1
);

-- Courses owned by the existing instructor.
INSERT INTO courses (instructor_id, title, description, thumbnail_url, level, is_visible, created_at, updated_at)
SELECT @instructor_id,
       'P3 드리블 첫걸음',
       '공 잡는 법, 낮은 자세, 제자리 드리블을 통해 농구의 기본 리듬을 익히는 강의입니다.',
       'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
       'BEGINNER',
       true,
       NOW(),
       NOW()
WHERE @instructor_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM courses WHERE title = 'P3 드리블 첫걸음');

INSERT INTO courses (instructor_id, title, description, thumbnail_url, level, is_visible, created_at, updated_at)
SELECT @instructor_id,
       'P3 슛 폼 완성',
       '자유투 루틴과 미들레인지 슛을 중심으로 정확한 릴리즈와 밸런스를 연습합니다.',
       'https://images.unsplash.com/photo-1515523110800-9415d13b84a8?auto=format&fit=crop&w=1200&q=80',
       'BEGINNER',
       true,
       NOW(),
       NOW()
WHERE @instructor_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM courses WHERE title = 'P3 슛 폼 완성');

INSERT INTO courses (instructor_id, title, description, thumbnail_url, level, is_visible, created_at, updated_at)
SELECT @instructor_id,
       'P3 픽앤롤 실전 운영',
       '가드와 빅맨의 움직임, 수비 대응, 패스 타이밍을 실제 경기 흐름으로 익힙니다.',
       'https://images.unsplash.com/photo-1519861531473-9200262188bf?auto=format&fit=crop&w=1200&q=80',
       'INTERMEDIATE',
       true,
       NOW(),
       NOW()
WHERE @instructor_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM courses WHERE title = 'P3 픽앤롤 실전 운영');

SET @course_dribble_id := (SELECT id FROM courses WHERE title = 'P3 드리블 첫걸음' ORDER BY id LIMIT 1);
SET @course_shot_id := (SELECT id FROM courses WHERE title = 'P3 슛 폼 완성' ORDER BY id LIMIT 1);
SET @course_pickroll_id := (SELECT id FROM courses WHERE title = 'P3 픽앤롤 실전 운영' ORDER BY id LIMIT 1);

-- Lessons.
INSERT INTO lessons (course_id, title, video_url, duration, order_index, created_at)
SELECT @course_dribble_id, '공 잡는 법과 기본 자세', 'https://www.youtube.com/embed/PfKIaC2al_E', 420, 1, NOW()
WHERE @course_dribble_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @course_dribble_id AND title = '공 잡는 법과 기본 자세');

INSERT INTO lessons (course_id, title, video_url, duration, order_index, created_at)
SELECT @course_dribble_id, '제자리 드리블과 시선 처리', 'https://www.youtube.com/embed/PfKIaC2al_E', 480, 2, NOW()
WHERE @course_dribble_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @course_dribble_id AND title = '제자리 드리블과 시선 처리');

INSERT INTO lessons (course_id, title, video_url, duration, order_index, created_at)
SELECT @course_shot_id, '자유투 루틴 만들기', 'https://www.youtube.com/embed/PfKIaC2al_E', 510, 1, NOW()
WHERE @course_shot_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @course_shot_id AND title = '자유투 루틴 만들기');

INSERT INTO lessons (course_id, title, video_url, duration, order_index, created_at)
SELECT @course_shot_id, '미들레인지 점프슛', 'https://www.youtube.com/embed/PfKIaC2al_E', 540, 2, NOW()
WHERE @course_shot_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @course_shot_id AND title = '미들레인지 점프슛');

INSERT INTO lessons (course_id, title, video_url, duration, order_index, created_at)
SELECT @course_pickroll_id, '픽앤롤 기본 간격', 'https://www.youtube.com/embed/PfKIaC2al_E', 600, 1, NOW()
WHERE @course_pickroll_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @course_pickroll_id AND title = '픽앤롤 기본 간격');

INSERT INTO lessons (course_id, title, video_url, duration, order_index, created_at)
SELECT @course_pickroll_id, '수비 대응별 패스 선택', 'https://www.youtube.com/embed/PfKIaC2al_E', 660, 2, NOW()
WHERE @course_pickroll_id IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM lessons WHERE course_id = @course_pickroll_id AND title = '수비 대응별 패스 선택');

-- Roadmap-course mapping.
INSERT IGNORE INTO roadmap_courses (roadmap_id, course_id, order_index)
VALUES
(@roadmap_beginner_id, @course_dribble_id, 1),
(@roadmap_beginner_id, @course_shot_id, 2),
(@roadmap_intermediate_id, @course_pickroll_id, 1);

-- Student enrollments for dashboard, roadmap progress, and reminder target.
INSERT IGNORE INTO enrollments (user_id, course_id, created_at, updated_at)
VALUES
(@student_id, @course_dribble_id, DATE_SUB(NOW(), INTERVAL 14 DAY), DATE_SUB(NOW(), INTERVAL 14 DAY)),
(@student_id, @course_shot_id, DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY)),
(@student_id, @course_pickroll_id, DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY));

SET @lesson_dribble_1 := (
    SELECT id FROM lessons WHERE course_id = @course_dribble_id AND title = '공 잡는 법과 기본 자세' LIMIT 1
);
SET @lesson_dribble_2 := (
    SELECT id FROM lessons WHERE course_id = @course_dribble_id AND title = '제자리 드리블과 시선 처리' LIMIT 1
);
SET @lesson_shot_1 := (
    SELECT id FROM lessons WHERE course_id = @course_shot_id AND title = '자유투 루틴 만들기' LIMIT 1
);

INSERT INTO progresses (user_id, lesson_id, last_position, completed, created_at, updated_at)
SELECT @student_id, @lesson_dribble_1, 420, true, DATE_SUB(NOW(), INTERVAL 12 DAY), DATE_SUB(NOW(), INTERVAL 12 DAY)
WHERE @student_id IS NOT NULL
  AND @lesson_dribble_1 IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM progresses WHERE user_id = @student_id AND lesson_id = @lesson_dribble_1);

INSERT INTO progresses (user_id, lesson_id, last_position, completed, created_at, updated_at)
SELECT @student_id, @lesson_dribble_2, 180, false, DATE_SUB(NOW(), INTERVAL 9 DAY), DATE_SUB(NOW(), INTERVAL 9 DAY)
WHERE @student_id IS NOT NULL
  AND @lesson_dribble_2 IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM progresses WHERE user_id = @student_id AND lesson_id = @lesson_dribble_2);

INSERT INTO progresses (user_id, lesson_id, last_position, completed, created_at, updated_at)
SELECT @student_id, @lesson_shot_1, 260, false, DATE_SUB(NOW(), INTERVAL 8 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)
WHERE @student_id IS NOT NULL
  AND @lesson_shot_1 IS NOT NULL
  AND NOT EXISTS (SELECT 1 FROM progresses WHERE user_id = @student_id AND lesson_id = @lesson_shot_1);

-- Reviews and Q&A for course detail pages.
INSERT IGNORE INTO reviews (user_id, course_id, rating, content, created_at, updated_at)
VALUES
(@student_id, @course_dribble_id, 5, '기본 자세를 천천히 잡아줘서 발표 시연용으로 학습 흐름이 잘 보입니다.', DATE_SUB(NOW(), INTERVAL 7 DAY), DATE_SUB(NOW(), INTERVAL 7 DAY)),
(@student_id, @course_shot_id, 4, '자유투 루틴을 따라 하면서 슛 폼 체크 포인트를 바로 이해할 수 있었습니다.', DATE_SUB(NOW(), INTERVAL 6 DAY), DATE_SUB(NOW(), INTERVAL 6 DAY));

INSERT INTO questions (user_id, course_id, title, content, created_at, updated_at)
SELECT @student_id,
       @course_shot_id,
       '슛 릴리즈가 자꾸 흔들릴 때는 어떻게 연습하면 좋나요?',
       '손목 스냅을 의식하면 팔꿈치가 바깥으로 벌어지는 느낌이 듭니다. 혼자 연습할 때 확인할 수 있는 기준이 궁금합니다.',
       DATE_SUB(NOW(), INTERVAL 5 DAY),
       DATE_SUB(NOW(), INTERVAL 5 DAY)
WHERE @student_id IS NOT NULL
  AND @course_shot_id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM questions
      WHERE user_id = @student_id
        AND course_id = @course_shot_id
        AND title = '슛 릴리즈가 자꾸 흔들릴 때는 어떻게 연습하면 좋나요?'
  );

SET @question_shot_id := (
    SELECT id FROM questions
    WHERE user_id = @student_id
      AND course_id = @course_shot_id
      AND title = '슛 릴리즈가 자꾸 흔들릴 때는 어떻게 연습하면 좋나요?'
    ORDER BY id LIMIT 1
);

INSERT INTO answers (question_id, user_id, content, created_at, updated_at)
SELECT @question_shot_id,
       @instructor_user_id,
       '먼저 공을 들기 전 팔꿈치가 림을 향하는지 확인하고, 가까운 거리에서 한 손 슛 20개를 성공 기준으로 반복해 보세요.',
       DATE_SUB(NOW(), INTERVAL 4 DAY),
       DATE_SUB(NOW(), INTERVAL 4 DAY)
WHERE @question_shot_id IS NOT NULL
  AND @instructor_user_id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM answers
      WHERE question_id = @question_shot_id
        AND user_id = @instructor_user_id
        AND content LIKE '먼저 공을 들기 전 팔꿈치가 림을 향하는지%'
  );

-- P3 notification demo data. Replace webhook_url through the UI before real sending.
INSERT INTO notification_subscriptions
    (user_id, channel, webhook_url, active, last_tested_at, created_at, updated_at)
VALUES
    (@student_id, 'DISCORD', 'https://discord.com/api/webhooks/replace-me/p3-demo', true,
     DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY))
ON DUPLICATE KEY UPDATE
    active = VALUES(active),
    updated_at = VALUES(updated_at);

INSERT INTO notification_delivery_logs (user_id, notification_type, status, failure_reason, sent_at)
SELECT @student_id, 'WEBHOOK_TEST', 'SUCCESS', NULL, DATE_SUB(NOW(), INTERVAL 3 DAY)
WHERE @student_id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM notification_delivery_logs
      WHERE user_id = @student_id AND notification_type = 'WEBHOOK_TEST'
  );

INSERT INTO notification_delivery_logs (user_id, notification_type, status, failure_reason, sent_at)
SELECT @student_id, 'LEARNING_REMINDER', 'FAILED', 'P3_DEMO_INVALID_WEBHOOK', DATE_SUB(NOW(), INTERVAL 2 DAY)
WHERE @student_id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM notification_delivery_logs
      WHERE user_id = @student_id AND notification_type = 'LEARNING_REMINDER'
  );

-- Admin screens: user management and audit-log style records.
INSERT INTO instructor_applications
    (user_id, bio, career, sample_video_url, status, rejection_reason, reviewed_by, created_at, reviewed_at)
SELECT @student_id,
       '학생 스포츠클럽에서 가드 포지션을 맡고 있으며, 초급자를 위한 드리블 튜터링을 해보고 싶습니다.',
       '교내 스포츠클럽 2년 / 점심시간 자유투 챌린지 운영',
       'https://www.youtube.com/embed/PfKIaC2al_E',
       'PENDING',
       NULL,
       NULL,
       DATE_SUB(NOW(), INTERVAL 1 DAY),
       NULL
WHERE @student_id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM instructor_applications
      WHERE user_id = @student_id AND status = 'PENDING'
  );

INSERT INTO admin_audit_logs (admin_id, action, target_type, target_id, memo, created_at)
SELECT @admin_id, 'COURSE_VISIBILITY_UPDATE', 'COURSE', @course_pickroll_id,
       'P3 발표 데이터: 강의 공개 상태 확인', DATE_SUB(NOW(), INTERVAL 2 DAY)
WHERE @admin_id IS NOT NULL
  AND @course_pickroll_id IS NOT NULL
  AND NOT EXISTS (
      SELECT 1 FROM admin_audit_logs
      WHERE action = 'COURSE_VISIBILITY_UPDATE'
        AND target_type = 'COURSE'
        AND target_id = @course_pickroll_id
        AND memo = 'P3 발표 데이터: 강의 공개 상태 확인'
  );

COMMIT;

-- Quick checks after running:
-- SELECT role, COUNT(*) FROM users GROUP BY role;
-- SELECT title FROM courses WHERE title LIKE 'P3 %';
-- SELECT notification_type, status, sent_at FROM notification_delivery_logs ORDER BY sent_at DESC;
