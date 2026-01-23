package com.productive.social.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import com.productive.social.enums.MembershipStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
        name = "user_communities",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"user_id", "community_id"}
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCommunity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // -------------------------
    // RELATIONS
    // -------------------------

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "community_id")
    private Community community;

    // -------------------------
    // MEMBERSHIP
    // -------------------------

    @CreationTimestamp
    private LocalDateTime joinedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MembershipStatus status = MembershipStatus.ACTIVE;

    // -------------------------
    // STREAK DATA (CORE)
    // -------------------------

    /**
     * Current running streak
     */
    @Column(nullable = false)
    private Integer currentStreak = 0;

    /**
     * Highest streak ever achieved
     */
    @Column(nullable = true)
    private Integer longestStreak = 0;

    /**
     * Last day user performed an activity
     * Stored in USER LOCAL DATE (not UTC timestamp)
     */
    private LocalDate lastActivityDate;
}
