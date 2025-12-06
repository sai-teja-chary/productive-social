package com.productive.social.dto.task;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserTaskProgressResponse {
    private Long taskId;
    private boolean completed;
    private String completedAt;
}
