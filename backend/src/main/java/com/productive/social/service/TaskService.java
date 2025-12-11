package com.productive.social.service;

import com.productive.social.dto.task.TaskResponse;
import com.productive.social.dto.task.UpdateTaskProgressRequest;
import com.productive.social.entity.*;
import com.productive.social.repository.*;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final UserTaskProgressRepository userTaskProgressRepository;
    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;
    private final UserCommunityRepository userCommunityRepository;
    private final AuthService authService;





    /** -----------------------------------------
     *  Fetch syllabus: tasks + completion state
     * ----------------------------------------- */
    public List<TaskResponse> getTasksForCommunity(Long communityId) {

        User user = authService.getCurrentUser();

        // ensure user is in the community
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new RuntimeException("Community not found"));

        boolean isMember = userCommunityRepository.findByUserAndCommunity(user, community).isPresent();

        if (!isMember) {
            throw new RuntimeException("Join the community to view its syllabus");
        }

        // Get ordered task list
        List<Task> tasks = taskRepository.findByCommunityOrderByOrderIndexAsc(community);

        // Get user progress for tasks
        List<UserTaskProgress> progressList = userTaskProgressRepository.findByUser(user);

        // Map tasks to response + detect progress
        return tasks.stream().map(task -> {

            Optional<UserTaskProgress> matchingProgress =
                    progressList.stream().filter(up -> up.getTask().getId().equals(task.getId())).findFirst();

            return TaskResponse.builder()
                    .taskId(task.getId())
                    .title(task.getTitle())
                    .description(task.getDescription())
                    .orderIndex(task.getOrderIndex())
                    .completed(matchingProgress.map(UserTaskProgress::getCompleted).orElse(false))
                    .completedAt(matchingProgress.map(up -> up.getCompletedAt() != null ? up.getCompletedAt().toString() : null).orElse(null))
                    .build();

        }).toList();
    }



    /** -----------------------------------------
     *  Update task progress (complete/uncomplete)
     * ----------------------------------------- */
    @Transactional
    public String updateTaskProgress(UpdateTaskProgressRequest request) {

        User user = authService.getCurrentUser();

        // Ensure task exists
        Task task = taskRepository.findById(request.getTaskId())
                .orElseThrow(() -> new RuntimeException("Task not found"));

        Optional<UserTaskProgress> progressOpt =
                userTaskProgressRepository.findByUserAndTask(user, task);

        if (request.isCompleted()) {

            // If marking as done and row doesn't exist → create it
            if (progressOpt.isEmpty()) {
                UserTaskProgress progress = UserTaskProgress.builder()
                        .user(user)
                        .task(task)
                        .completed(true)
                        .completedAt(LocalDateTime.now())
                        .build();

                userTaskProgressRepository.save(progress);

            } else {
                // update existing
                UserTaskProgress progress = progressOpt.get();
                progress.setCompleted(true);
                progress.setCompletedAt(LocalDateTime.now());
                userTaskProgressRepository.save(progress);
            }

            return "Task marked as completed";

        } else {

            // Unmarking logic
            if (progressOpt.isPresent()) {
                UserTaskProgress progress = progressOpt.get();
                progress.setCompleted(false);
                progress.setCompletedAt(null);
                userTaskProgressRepository.save(progress);
            }

            return "Task marked as incomplete";
        }
    }
}
