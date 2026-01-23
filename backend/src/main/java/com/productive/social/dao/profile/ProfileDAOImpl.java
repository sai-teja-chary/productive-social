package com.productive.social.dao.profile;

import com.productive.social.dto.profile.UserProfileResponse;
import com.productive.social.dto.profile.UserProfileStatsResponse;
import com.productive.social.entity.User;
import com.productive.social.entity.UserCommunity;
import com.productive.social.service.StreakService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class ProfileDAOImpl implements ProfileDAO {

    @PersistenceContext
    private final EntityManager entityManager;

    private final StreakService streakService;

    @Override
    public UserProfileResponse getUserProfile(Long userId) {

        // -------------------------
        // 1️⃣ Load user
        // -------------------------
        User user = entityManager.find(User.class, userId);

        if (user == null) {
            return null;
        }

        // -------------------------
        // 2️⃣ Posts count
        // -------------------------
        Long postsCount = entityManager.createQuery(
                "SELECT COUNT(p.id) FROM Post p WHERE p.user.id = :userId",
                Long.class
        ).setParameter("userId", userId)
         .getSingleResult();

        // -------------------------
        // 3️⃣ Communities count
        // -------------------------
        Long communitiesCount = entityManager.createQuery(
                "SELECT COUNT(uc.id) FROM UserCommunity uc " +
                "WHERE uc.user.id = :userId AND uc.status = 'ACTIVE'",
                Long.class
        ).setParameter("userId", userId)
         .getSingleResult();

        // -------------------------
        // 4️⃣ Load all active memberships
        // -------------------------
        List<UserCommunity> memberships =
                entityManager.createQuery(
                        """
                        SELECT uc
                        FROM UserCommunity uc
                        WHERE uc.user.id = :userId
                          AND uc.status = 'ACTIVE'
                        """,
                        UserCommunity.class
                )
                .setParameter("userId", userId)
                .getResultList();

        int highestActiveStreak = 0;
        int longestStreakEver = 0;

        for (UserCommunity membership : memberships) {

            int effectiveStreak =
                    streakService.calculateEffectiveStreak(membership);

            highestActiveStreak =
                    Math.max(highestActiveStreak, effectiveStreak);

            longestStreakEver =
                    Math.max(membership.getLongestStreak(),
                            longestStreakEver
                            
                    );
        }

        // -------------------------
        // 5️⃣ Build stats
        // -------------------------
        UserProfileStatsResponse stats =
                UserProfileStatsResponse.builder()
                        .posts(postsCount)
                        .communities(communitiesCount)
                        .streak(highestActiveStreak)
                        .longestStreak(longestStreakEver)
                        .build();

        // -------------------------
        // 6️⃣ Build profile response
        // -------------------------
        return UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .email(user.getEmail())
                .profilePicture(user.getProfilePicture())
                .bio(user.getBio())
                .joinedAt(user.getCreatedAt())
                .stats(stats)
                .build();
    }
}
