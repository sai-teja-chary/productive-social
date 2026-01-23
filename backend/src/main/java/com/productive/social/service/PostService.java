package com.productive.social.service;

import com.productive.social.dao.PostDAO;
import com.productive.social.dto.posts.PostCreateRequest;
import com.productive.social.dto.posts.PostResponse;
import com.productive.social.entity.*;
import com.productive.social.enums.ActivityType;
import com.productive.social.enums.MembershipStatus;
import com.productive.social.exceptions.NotFoundException;
import com.productive.social.exceptions.community.CommunityNotFoundException;
import com.productive.social.exceptions.posts.PostCreationException;
import com.productive.social.exceptions.posts.PostImageUploadException;
import com.productive.social.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;
@Slf4j
@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final PostImageRepository postImageRepository;
    private final PostLikeRepository postLikeRepository;
    private final CommunityRepository communityRepository;
    private final AuthService authService;
    private final PostDAO postDAO;
    private final ImageStorageService imageStorageService;
    private final StreakService streakService;
    private final UserCommunityRepository userCommunityRepository;

    // -------------------------
    // CREATE POST
    // -------------------------
    public PostResponse createPost(PostCreateRequest request, List<MultipartFile> images) {
        try {
            User user = authService.getCurrentUser();

            Community community = communityRepository.findById(request.getCommunityId())
                    .orElseThrow(() -> new CommunityNotFoundException("Community not found"));

            Post post = Post.builder()
                    .user(user)
                    .community(community)
                    .title(request.getTitle())
                    .content(request.getContent())
                    .build();

            post = postRepository.save(post);

            if (images != null && !images.isEmpty()) {
                try {
                    savePostImages(post, images);
                } catch (Exception e) {
                	log.error("Failed to upload images for postId={}", post.getId(), e);
                    throw new PostImageUploadException("Failed to upload images");
                }
            }
            
         // -------------------------
         // STREAK ACTIVITY
         // -------------------------
         streakService.recordActivity(
                 user,
                 community,
                 ActivityType.POST
         );

            log.info("Post created successfully. userId={}, postId={}", user.getId(), post.getId());
            return postDAO.getUserPosts(user.getId(), user, 0, 1).get(0);
        }
        catch (CommunityNotFoundException | PostImageUploadException e) {
            throw e; // handled by GlobalExceptionHandler
        }
        catch (Exception e) {
        	log.error("Unexpected error while creating post for user", e);
            throw new PostCreationException("Failed to create post");
        }
    }


    private void savePostImages(Post post, List<MultipartFile> images) throws IOException {
        for (MultipartFile file : images) {
            if (!file.isEmpty()) {
                String savedPath = imageStorageService.store(file);

                PostImage postImage = PostImage.builder()
                        .post(post)
                        .imageUrl(savedPath)
                        .build();

                postImageRepository.save(postImage);
            }
        }
    }

    // -------------------------
    // FEEDS
    // -------------------------
    public List<PostResponse> getGlobalFeed(int page, int pageSize) {

        User currentUser = authService.getCurrentUser();

        // 1️⃣ Get feed from DAO (streak = 0)
        List<PostResponse> feed =
                postDAO.getGlobalFeed(currentUser, page, pageSize);

        if (feed.isEmpty()) {
            return feed;
        }

        // 2️⃣ Collect all (authorId, communityId) pairs
        Set<Long> userIds = new HashSet<>();
        Set<Long> communityIds = new HashSet<>();

        for (PostResponse post : feed) {
            userIds.add(post.getUser().getId());
            communityIds.add(post.getCommunity().getId());
        }

        // 3️⃣ Load all memberships in ONE query
        List<UserCommunity> memberships =
                userCommunityRepository
                        .findByUserIdInAndCommunityIdInAndStatus(
                                userIds,
                                communityIds,
                                MembershipStatus.ACTIVE
                        );

        // 4️⃣ Build lookup map:
        // (userId + communityId) → UserCommunity
        Map<String, UserCommunity> membershipMap =
                memberships.stream()
                        .collect(Collectors.toMap(
                                uc -> uc.getUser().getId() + "_" +
                                      uc.getCommunity().getId(),
                                uc -> uc
                        ));

        // 5️⃣ Inject streak per post
        for (PostResponse post : feed) {

            Long authorId = post.getUser().getId();
            Long communityId = post.getCommunity().getId();

            String key = authorId + "_" + communityId;

            UserCommunity membership = membershipMap.get(key);

            int streak = 0;

            if (membership != null) {
                streak = streakService.calculateEffectiveStreak(membership);
            }

            post.getUser().setStreak(streak);
        }

        return feed;
    }



    public List<PostResponse> getCommunityFeed(
            Long communityId,
            int page,
            int pageSize
    ) {

        User currentUser = authService.getCurrentUser();

        // 1️⃣ Fetch feed from DAO (streak = 0)
        List<PostResponse> feed =
                postDAO.getCommunityFeed(
                        communityId,
                        currentUser,
                        page,
                        pageSize
                );

        if (feed.isEmpty()) {
            return feed;
        }

        // 2️⃣ Collect all authorIds
        Set<Long> authorIds = feed.stream()
                .map(p -> p.getUser().getId())
                .collect(Collectors.toSet());

        // 3️⃣ Fetch memberships for this community only
        List<UserCommunity> memberships =
                userCommunityRepository
                        .findByUserIdInAndCommunityIdAndStatus(
                                authorIds,
                                communityId,
                                MembershipStatus.ACTIVE
                        );

        // 4️⃣ Build lookup map
        Map<Long, UserCommunity> membershipMap =
                memberships.stream()
                        .collect(Collectors.toMap(
                                uc -> uc.getUser().getId(),
                                uc -> uc
                        ));

        // 5️⃣ Inject streak into each post
        for (PostResponse post : feed) {

            UserCommunity membership =
                    membershipMap.get(post.getUser().getId());

            int streak = 0;

            if (membership != null) {
                streak =
                        streakService.calculateEffectiveStreak(membership);
            }

            post.getUser().setStreak(streak);
        }

        return feed;
    }



    public List<PostResponse> getUserPosts(int page, int pageSize) {

        User currentUser = authService.getCurrentUser();

        // 1️⃣ Fetch posts (streak = 0 from DAO)
        List<PostResponse> feed =
                postDAO.getUserPosts(
                        currentUser.getId(),
                        currentUser,
                        page,
                        pageSize
                );

        if (feed.isEmpty()) {
            return feed;
        }

        // 2️⃣ Collect all communityIds from user's posts
        Set<Long> communityIds = feed.stream()
                .map(p -> p.getCommunity().getId())
                .collect(Collectors.toSet());

        // 3️⃣ Load memberships for current user
        List<UserCommunity> memberships =
                userCommunityRepository
                        .findByUserIdAndCommunityIdInAndStatus(
                                currentUser.getId(),
                                communityIds,
                                MembershipStatus.ACTIVE
                        );

        // 4️⃣ Build lookup map
        Map<Long, UserCommunity> membershipMap =
                memberships.stream()
                        .collect(Collectors.toMap(
                                uc -> uc.getCommunity().getId(),
                                uc -> uc
                        ));

        // 5️⃣ Inject streak per post
        for (PostResponse post : feed) {

            UserCommunity membership =
                    membershipMap.get(post.getCommunity().getId());

            int streak = 0;

            if (membership != null) {
                streak =
                        streakService.calculateEffectiveStreak(membership);
            }

            post.getUser().setStreak(streak);
        }

        return feed;
    }


    // -------------------------
    // LIKE / UNLIKE
    // -------------------------
    public void likePost(Long postId) {
        User user = authService.getCurrentUser();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("Post not found"));

        if (!postLikeRepository.existsByPostAndUser(post, user)) {
            PostLike like = PostLike.builder()
                    .post(post)
                    .user(user)
                    .build();

            postLikeRepository.save(like);
            log.info("Post liked. userId={}, postId={}", user.getId(), postId);
        }
    }

    @Transactional
    public void unlikePost(Long postId) {
        User user = authService.getCurrentUser();

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("Post not found"));

        postLikeRepository.deleteByPostAndUser(post, user);
        log.info("Post unliked. userId={}, postId={}", user.getId(), postId);
    }
}
