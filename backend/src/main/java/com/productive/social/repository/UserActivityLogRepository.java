package com.productive.social.repository;

import com.productive.social.entity.UserActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserActivityLogRepository
        extends JpaRepository<UserActivityLog, Long> {
}
