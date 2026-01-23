package com.productive.social.repository;

import com.productive.social.entity.UserCommunity;
import com.productive.social.enums.CommunityStatus;
import com.productive.social.enums.MembershipStatus;
import com.productive.social.entity.Community;
import com.productive.social.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface UserCommunityRepository extends JpaRepository<UserCommunity, Long> {

    List<UserCommunity> findByUser(User user);
    
    List<UserCommunity> findByUserId(Long userId);


    Optional<UserCommunity> findByUserAndCommunity(User user, Community community);
    
    boolean existsByUserIdAndCommunityId(Long userId, Long communityId);

	Long countByUserId(Long userId);

	List<UserCommunity> findByUserIdInAndStatus(Set<Long> authorIds, MembershipStatus active);

	List<UserCommunity> findByUserIdInAndCommunityIdInAndStatus(Set<Long> userIds, Set<Long> communityIds,
			MembershipStatus active);

	List<UserCommunity> findByUserIdInAndCommunityIdAndStatus(Set<Long> authorIds, Long communityId,
			MembershipStatus active);

	List<UserCommunity> findByUserIdAndCommunityIdInAndStatus(Long id, Set<Long> communityIds, MembershipStatus active);

	List<UserCommunity> findByUser_IdAndStatus(Long userId, MembershipStatus status);
}
