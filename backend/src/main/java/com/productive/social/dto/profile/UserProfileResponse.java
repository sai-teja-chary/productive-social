package com.productive.social.dto.profile;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileResponse {

    private Long id;
    private String username;
    private String name;
    private String email;

    private String profilePicture;
    private String bio;

    private LocalDateTime joinedAt;

    private UserProfileStatsResponse stats;
    

}
