package com.productive.social.service;

import org.springframework.stereotype.Service;

import com.productive.social.dao.profile.ProfileDAO;
import com.productive.social.dto.profile.UserProfileResponse;
import com.productive.social.entity.User;
import com.productive.social.exceptions.InternalServerException;
import com.productive.social.exceptions.NotFoundException;
import com.productive.social.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileService {

    private final ProfileDAO profileDAO;
    private final AuthService authService;
    private final UserRepository userRepository;

    /**
     * -----------------------------------------
     * Get current logged-in user's profile
     * -----------------------------------------
     */
    public UserProfileResponse getMyProfile() {
        User currentUser = authService.getCurrentUser();

        try {
            log.info("Fetching profile (self). userId={}", currentUser.getId());

            UserProfileResponse response =
                    profileDAO.getUserProfile(currentUser.getId());

            if (response == null) {
                throw new NotFoundException("User not found");
            }

            log.info("Profile loaded successfully (self). userId={}", currentUser.getId());

            return response;

        } catch (NotFoundException e) {
            throw e;

        } catch (Exception e) {
            log.error("Profile load failed (self). userId={}", currentUser.getId(), e);
            throw new InternalServerException("Failed to load user profile");
        }
    }


    /**
     * -----------------------------------------
     * Get public user profile
     * -----------------------------------------
     */
    public UserProfileResponse getUserProfile(String userName) {
        try {
            log.info("Fetching profile (public). userName={}", userName);
            User user = userRepository.findByUsername(userName)
                    .orElseThrow(() ->
                            new NotFoundException("User not found"));

            Long userId = user.getId();

            UserProfileResponse response =
                    profileDAO.getUserProfile(userId);

            if (response == null) {
                log.warn("Public profile not found. userId={}", userId);
                throw new NotFoundException("User not found");
            }

            log.info("Profile loaded successfully (public). userId={}", userId);

            return response;

        } catch (NotFoundException e) {
            throw e;

        } catch (Exception e) {
            log.error(
                    "Profile load failed (public). userName={}",
                    userName,
                    e
            );
            throw new InternalServerException("Failed to load user profile");
        }
    }


   
}
