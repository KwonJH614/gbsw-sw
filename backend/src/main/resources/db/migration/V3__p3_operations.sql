CREATE TABLE notification_subscriptions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    channel VARCHAR(20) NOT NULL,
    webhook_url VARCHAR(500) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    last_tested_at DATETIME NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_notification_subscription_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT uk_notification_subscription_user_channel UNIQUE (user_id, channel),
    INDEX idx_notification_subscription_active_channel (active, channel)
);

CREATE TABLE notification_delivery_logs (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    notification_type VARCHAR(40) NOT NULL,
    status VARCHAR(20) NOT NULL,
    failure_reason VARCHAR(500) NULL,
    sent_at DATETIME NOT NULL,
    CONSTRAINT fk_notification_delivery_user FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_notification_delivery_sent_at (sent_at),
    INDEX idx_notification_delivery_status_sent_at (status, sent_at),
    INDEX idx_notification_delivery_dedup (user_id, notification_type, sent_at)
);

CREATE INDEX idx_enrollments_user_created_at ON enrollments(user_id, created_at);
CREATE INDEX idx_progresses_user_updated_at ON progresses(user_id, updated_at);
