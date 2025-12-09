package com.productive.social.service;

import com.productive.social.dao.CommunityDAO;
import com.productive.social.dto.community.CommunityDetailResponse;
import com.productive.social.dto.community.CommunityResponse;
import com.productive.social.dto.community.JoinCommunityRequest;
import com.productive.social.dto.community.JoinCommunityResponse;
import com.productive.social.entity.Community;
import com.productive.social.entity.User;
import com.productive.social.entity.UserCommunity;
import com.productive.social.repository.CommunityRepository;
import com.productive.social.repository.UserCommunityRepository;
import com.productive.social.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CommunityService {

    private final CommunityRepository communityRepository;
    private final UserRepository userRepository;
    private final UserCommunityRepository userCommunityRepository;
    private final AuthService authService;
    private final CommunityDAO communityDAO;

    // Helper: Get currently logged-in user from JWT
    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }


    /** -----------------------------------------
     *  Get All Communities with Joined Status
     * ----------------------------------------- */
//    public List<CommunityResponse> getAllCommunitiesForUser() {
//        User user = getCurrentUser();
//
//        List<Community> communities = communityRepository.findAll();
//        List<UserCommunity> joined = userCommunityRepository.findByUser(user);
//
//        return communities.stream().map(c -> {
//            Optional<UserCommunity> link = joined.stream()
//                    .filter(uc -> uc.getCommunity().getId().equals(c.getId()))
//                    .findFirst();
//
//            return CommunityResponse.builder()
//                    .id(c.getId())
//                    .name(c.getName())
//                    .description(c.getDescription())
//                    .image(c.getImage())
//                    .joined(link.isPresent())
//                    .streak(link.map(UserCommunity::getStreak).orElse(null))
//                    .build();
//        }).toList();
//    }
    
    public List<CommunityResponse> getAllCommunitiesForUser() {

        Long userId = authService.getCurrentUser().getId();

        List<Community> communities = communityDAO.getAllCommunities();

        return communities.stream()
                .map(c -> {

                    boolean joined = userCommunityRepository.existsByUserIdAndCommunityId(userId, c.getId());

                    int memberCount = communityDAO.getMemberCount(c.getId());

                    return CommunityResponse.builder()
                            .id(c.getId())
                            .name(c.getName())
                            .description(c.getDescription())
                            .joined(joined)
                            .memberCount(memberCount)
                            .build();
                })
                .toList();
    }



    /** -----------------------------------------
     *  Join a Community
     * ----------------------------------------- */
    @Transactional
    public JoinCommunityResponse joinCommunity(JoinCommunityRequest request) {

        User user = getCurrentUser();
        Community community = communityRepository.findById(request.getCommunityId())
                .orElseThrow(() -> new RuntimeException("Community not found"));

        boolean alreadyJoined = userCommunityRepository
                .findByUserAndCommunity(user, community)
                .isPresent();

        if (alreadyJoined) {
            return new JoinCommunityResponse("Already joined this community");
        }

        UserCommunity mapping = UserCommunity.builder()
                .user(user)
                .community(community)
                .streak(0)
                .build();

        userCommunityRepository.save(mapping);
        return new JoinCommunityResponse("Successfully joined community");
    }



    /** -----------------------------------------
     *  Get Community Details
     * ----------------------------------------- */
    public CommunityDetailResponse getCommunityDetails(Long communityId) {

        User user = getCurrentUser();
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new RuntimeException("Community not found"));

        Optional<UserCommunity> membership =
                userCommunityRepository.findByUserAndCommunity(user, community);

        int memberCount = userCommunityRepository.findByUser(user).size(); // placeholder for now

        return CommunityDetailResponse.builder()
                .id(community.getId())
                .name(community.getName())
                .description(community.getDescription())
                .image(community.getImage())
                .joined(membership.isPresent())
                .streak(membership.map(UserCommunity::getStreak).orElse(null))
                .totalMembers(memberCount) // refine later
                .build();
    }



    /** -----------------------------------------
     *  Leave Community
     * ----------------------------------------- */
    @Transactional
    public String leaveCommunity(Long communityId) {

        User user = getCurrentUser();
        Community community = communityRepository.findById(communityId)
                .orElseThrow(() -> new RuntimeException("Community not found"));

        Optional<UserCommunity> record = userCommunityRepository.findByUserAndCommunity(user, community);

        if (record.isEmpty()) {
            return "You are not part of this community";
        }

        userCommunityRepository.delete(record.get());
        return "Successfully left community";
    }
}
