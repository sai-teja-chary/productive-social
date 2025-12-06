package com.productive.social.dto.task;

import lombok.Data;

@Data
public class UpdateTaskProgressRequest {
    private Long taskId;
    private boolean completed;  // true = mark done, false = undo
}
