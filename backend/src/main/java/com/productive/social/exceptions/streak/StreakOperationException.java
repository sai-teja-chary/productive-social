package com.productive.social.exceptions.streak;

public class StreakOperationException
        extends RuntimeException {

    public StreakOperationException(String message) {
        super(message);
    }

    public StreakOperationException(String message, Throwable cause) {
        super(message, cause);
    }
}
