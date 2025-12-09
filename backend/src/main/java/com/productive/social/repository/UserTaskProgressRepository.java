package com.productive.social.repository;

import com.productive.social.entity.Task;
import com.productive.social.entity.User;
import com.productive.social.entity.UserTaskProgress;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserTaskProgressRepository extends JpaRepository<UserTaskProgress, Long> {

    Optional<UserTaskProgress> findByUserAndTask(User user, Task task);

    List<UserTaskProgress> findByUser(User user);

    List<UserTaskProgress> findByTask(Task task);
}
