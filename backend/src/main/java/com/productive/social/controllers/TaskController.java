package com.productive.social.controllers;

import com.productive.social.dto.task.TaskResponse;
import com.productive.social.dto.task.UpdateTaskProgressRequest;
import com.productive.social.service.TaskService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/communities/{communityId}/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    /** ------------------------------------------------
     * Get Syllabus (Task List for Community)
     * ------------------------------------------------ */
    @GetMapping
    public ResponseEntity<List<TaskResponse>> getTasks(@PathVariable Long communityId) {
        return ResponseEntity.ok(taskService.getTasksForCommunity(communityId));
    }


    /** ------------------------------------------------
     * Update Task Completion State
     * ------------------------------------------------ */
    @PostMapping("/update")
    public ResponseEntity<String> updateTaskProgress(
            @PathVariable Long communityId,
            @RequestBody UpdateTaskProgressRequest request) {

        // communityId isn't required by service now, but useful for future validation
        String result = taskService.updateTaskProgress(request);
        return ResponseEntity.ok(result);
    }
}
