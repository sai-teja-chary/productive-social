package com.productive.social.entity;

import com.productive.social.enums.ActivityType;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(
    name = "user_activity_log",
    indexes = {
        @Index(
            name = "idx_user_date",
            columnList = "user_id, activity_date"
        ),
        @Index(
            name = "idx_user_community_date",
            columnList = "user_id, community_id, activity_date"
        )
    }
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // -------------------------
    // RELATIONS
    // -------------------------

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "community_id", nullable = false)
    private Community community;

    // -------------------------
    // ACTIVITY DATA
    // -------------------------

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ActivityType activityType;

    /**
     * ✅ User-local calendar date
     * Used ONLY for streak calculation.
     *
     * Example:
     *   2026-01-20
     */
    @Column(name = "activity_date", nullable = false)
    private LocalDate activityDate;

    /**
     * ✅ Absolute UTC timestamp
     * Used for:
     * - audits
     * - analytics
     * - ordering
     * - debugging
     *
     * Never converted directly for streak logic.
     */
    @Column(name = "created_at_utc", nullable = false, updatable = false)
    private Instant createdAtUtc;
}
