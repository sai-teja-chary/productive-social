package com.productive.social.exceptions.streak;

public class InvalidCommunityMembershipException
        extends RuntimeException {

    public InvalidCommunityMembershipException(String message) {
        super(message);
    }
}
