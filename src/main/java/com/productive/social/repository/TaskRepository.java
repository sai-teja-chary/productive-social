package com.productive.social.repository;

import com.productive.social.entity.Task;
import com.productive.social.entity.Community;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    List<Task> findByCommunityOrderByOrderIndexAsc(Community community);
}
