package com.productive.social.dao;

import com.productive.social.entity.UserCommunity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class StreakDAO {

    @PersistenceContext
    private EntityManager em;

    public Optional<UserCommunity> findMembership(Long userId, Long communityId) {

        return em.createQuery("""
                SELECT uc
                FROM UserCommunity uc
                WHERE uc.user.id = :userId
                  AND uc.community.id = :communityId
                """, UserCommunity.class)
                .setParameter("userId", userId)
                .setParameter("communityId", communityId)
                .getResultStream()
                .findFirst();
    }
}
