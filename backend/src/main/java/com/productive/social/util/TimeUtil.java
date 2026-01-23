package com.productive.social.util;

import java.time.*;

public final class TimeUtil {

    private TimeUtil() {}

    // -------------------------
    // TIMEZONE SAFE ZONE
    // -------------------------

    public static ZoneId getUserZone(String timezone) {
        try {
            return ZoneId.of(timezone);
        } catch (Exception e) {
            return ZoneId.of("UTC");
        }
    }

    // -------------------------
    // USER CALENDAR DATE
    // -------------------------

    public static LocalDate todayForUser(String timezone) {
        return Instant.now()
                .atZone(getUserZone(timezone))
                .toLocalDate();
    }

    // -------------------------
    // USER LOCAL TIME
    // -------------------------

    public static ZonedDateTime nowForUser(String timezone) {
        return Instant.now()
                .atZone(getUserZone(timezone));
    }

    // -------------------------
    // PURE UTC TIME
    // -------------------------

    public static Instant nowUtc() {
        return Instant.now();
    }
}
