package com.productive.social.dto.community;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CommunityResponse {
    private Long id;
    private String name;
    private String description;
    private String image;
    private boolean joined;
    private Integer streak; // null if not joined
}
