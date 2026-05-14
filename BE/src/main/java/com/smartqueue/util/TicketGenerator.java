package com.smartqueue.util;

import java.util.concurrent.ThreadLocalRandom;

public final class TicketGenerator {

    private TicketGenerator() {
    }

    /**
     * Generates a unique ticket number for display and tracking.
     */
    public static String nextNumber() {
        return "T-" + System.currentTimeMillis() + "-" + ThreadLocalRandom.current().nextInt(1000, 9999);
    }
}
