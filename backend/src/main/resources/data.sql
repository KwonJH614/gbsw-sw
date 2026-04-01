-- =============================================
-- HoopPath 시드 데이터
-- 비밀번호: password123 (BCrypt 해시)
-- =============================================

-- 1. users (강사 3명 + 학생 1명)
INSERT IGNORE INTO users (id, email, password, nickname, profile_image_url, role, created_at, updated_at) VALUES
(1, 'coach.kim@hooppath.com', '$2a$10$I4AXXL7cnR3uF9cg61.Ki.VwoIsF7/I.xii5ktOFiaD.QtfsgX/4K', '김코치', NULL, 'STUDENT', NOW(), NOW()),
(2, 'coach.lee@hooppath.com', '$2a$10$I4AXXL7cnR3uF9cg61.Ki.VwoIsF7/I.xii5ktOFiaD.QtfsgX/4K', '이코치', NULL, 'STUDENT', NOW(), NOW()),
(3, 'coach.park@hooppath.com', '$2a$10$I4AXXL7cnR3uF9cg61.Ki.VwoIsF7/I.xii5ktOFiaD.QtfsgX/4K', '박코치', NULL, 'STUDENT', NOW(), NOW()),
(4, 'test@test.com', '$2a$10$I4AXXL7cnR3uF9cg61.Ki.VwoIsF7/I.xii5ktOFiaD.QtfsgX/4K', '테스트학생', NULL, 'STUDENT', NOW(), NOW());

-- 2. instructors
INSERT IGNORE INTO instructors (id, user_id, bio, career, created_at) VALUES
(1, 1, '전직 프로농구 선수 출신 코치. 기초부터 탄탄하게 가르칩니다.', 'KBL 10년 경력 / 청소년 농구 캠프 운영', NOW()),
(2, 2, '대학 농구부 출신. 슈팅과 득점 스킬을 전문으로 지도합니다.', '대학 농구부 주장 / 슈팅 클리닉 강사 5년', NOW()),
(3, 3, '농구 전술 분석가. 실전 경기 운영과 팀 전략을 가르칩니다.', '농구 전술 분석가 7년 / 고교 농구팀 코치', NOW());

-- 3. roadmaps
INSERT IGNORE INTO roadmaps (id, title, description, level, thumbnail_url, created_at) VALUES
(1, '농구 입문', '농구를 처음 시작하는 사람을 위한 로드맵. 공 다루기부터 기본 슛까지 배웁니다.', 'BEGINNER', NULL, NOW()),
(2, '기초 스킬 마스터', '기본기를 넘어 실전에서 쓸 수 있는 핵심 스킬을 익힙니다.', 'INTERMEDIATE', NULL, NOW()),
(3, '실전 경기 전략', '경기 운영, 팀 전술, 수비 전략 등 실전 감각을 키웁니다.', 'ADVANCED', NULL, NOW());

-- 4. courses
INSERT IGNORE INTO courses (id, instructor_id, title, description, thumbnail_url, level, created_at) VALUES
(1, 1, '드리블 기초', '농구의 시작, 드리블! 기본 자세부터 크로스오버까지 배워봅시다.', NULL, 'BEGINNER', NOW()),
(2, 2, '슛 폼 완성', '정확한 슛 폼을 만들고 자유투, 미들레인지 슛을 연습합니다.', NULL, 'BEGINNER', NOW()),
(3, 1, '레이업 마스터', '왼손·오른손 레이업부터 유로스텝까지 득점력을 높여봅시다.', NULL, 'INTERMEDIATE', NOW()),
(4, 2, '패스의 정석', '체스트패스, 바운스패스, 노룩패스까지 팀 플레이의 핵심을 배웁니다.', NULL, 'INTERMEDIATE', NOW()),
(5, 3, '수비 기초', '1대1 수비, 헬프 디펜스, 리바운드 포지셔닝을 배웁니다.', NULL, 'INTERMEDIATE', NOW()),
(6, 3, '경기 운영 전략', '픽앤롤, 패스트브레이크, 존 디펜스 등 실전 전술을 익힙니다.', NULL, 'ADVANCED', NOW());

-- 5. roadmap_courses
INSERT IGNORE INTO roadmap_courses (id, roadmap_id, course_id, order_index) VALUES
(1, 1, 1, 1),
(2, 1, 2, 2),
(3, 2, 3, 1),
(4, 2, 4, 2),
(5, 2, 5, 3),
(6, 3, 5, 1),
(7, 3, 6, 2);

-- 6. lessons (유튜브 농구 영상 embed URL)
INSERT IGNORE INTO lessons (id, course_id, title, video_url, duration, order_index, created_at) VALUES
-- 드리블 기초 (course 1)
(1,  1, '농구공 잡는 법과 기본 자세',       'https://www.youtube.com/embed/PfKIaC2al_E', 420, 1, NOW()),
(2,  1, '제자리 드리블 연습',              'https://www.youtube.com/embed/PfKIaC2al_E', 360, 2, NOW()),
(3,  1, '크로스오버 드리블',              'https://www.youtube.com/embed/PfKIaC2al_E', 480, 3, NOW()),

-- 슛 폼 완성 (course 2)
(4,  2, '올바른 슛 폼 만들기',            'https://www.youtube.com/embed/PfKIaC2al_E', 390, 1, NOW()),
(5,  2, '자유투 연습 루틴',              'https://www.youtube.com/embed/PfKIaC2al_E', 450, 2, NOW()),
(6,  2, '미들레인지 점프슛',             'https://www.youtube.com/embed/PfKIaC2al_E', 510, 3, NOW()),

-- 레이업 마스터 (course 3)
(7,  3, '오른손 레이업 기본',             'https://www.youtube.com/embed/PfKIaC2al_E', 360, 1, NOW()),
(8,  3, '왼손 레이업 연습',              'https://www.youtube.com/embed/PfKIaC2al_E', 380, 2, NOW()),
(9,  3, '유로스텝 레이업',              'https://www.youtube.com/embed/PfKIaC2al_E', 420, 3, NOW()),

-- 패스의 정석 (course 4)
(10, 4, '체스트패스와 바운스패스',          'https://www.youtube.com/embed/PfKIaC2al_E', 330, 1, NOW()),
(11, 4, '오버헤드패스와 아웃렛패스',        'https://www.youtube.com/embed/PfKIaC2al_E', 350, 2, NOW()),
(12, 4, '노룩패스와 실전 패스 드릴',        'https://www.youtube.com/embed/PfKIaC2al_E', 400, 3, NOW()),

-- 수비 기초 (course 5)
(13, 5, '디펜스 스탠스와 슬라이드',         'https://www.youtube.com/embed/PfKIaC2al_E', 370, 1, NOW()),
(14, 5, '1대1 수비 원칙',               'https://www.youtube.com/embed/PfKIaC2al_E', 410, 2, NOW()),
(15, 5, '헬프 디펜스와 로테이션',          'https://www.youtube.com/embed/PfKIaC2al_E', 440, 3, NOW()),
(16, 5, '리바운드 포지셔닝',             'https://www.youtube.com/embed/PfKIaC2al_E', 350, 4, NOW()),

-- 경기 운영 전략 (course 6)
(17, 6, '픽앤롤 기본 원리',              'https://www.youtube.com/embed/PfKIaC2al_E', 480, 1, NOW()),
(18, 6, '패스트브레이크 전개',            'https://www.youtube.com/embed/PfKIaC2al_E', 450, 2, NOW()),
(19, 6, '존 디펜스 vs 맨투맨',           'https://www.youtube.com/embed/PfKIaC2al_E', 520, 3, NOW()),
(20, 6, '클러치 상황 운영법',             'https://www.youtube.com/embed/PfKIaC2al_E', 400, 4, NOW());
