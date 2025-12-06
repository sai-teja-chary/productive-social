package com.productive.social.dto.task;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TaskResponse {
    private Long taskId;
    private String title;
    private String description;
    private Integer orderIndex;
    private boolean completed;
    private String completedAt; // string for clean JSON (ISO format)
}
