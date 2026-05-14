package com.smartqueue.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

public final class DateUtil {

    private static final DateTimeFormatter ISO_LOCAL = DateTimeFormatter.ISO_LOCAL_DATE_TIME;

    private DateUtil() {
    }

    public static LocalDateTime parseIsoLocalDateTime(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        try {
            return LocalDateTime.parse(value, ISO_LOCAL);
        } catch (DateTimeParseException ex) {
            throw new IllegalArgumentException("Invalid date-time: " + value, ex);
        }
    }
}
