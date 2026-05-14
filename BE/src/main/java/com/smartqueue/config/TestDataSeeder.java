package com.smartqueue.config;

import com.smartqueue.entity.*;
import com.smartqueue.entity.enums.AppointmentStatus;
import com.smartqueue.entity.enums.NotificationType;
import com.smartqueue.entity.enums.RoleName;
import com.smartqueue.entity.enums.TicketStatus;
import com.smartqueue.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Loads deterministic demo data when {@code app.data.seed=true} (for local / integration tests).
 * Idempotent: skips if {@code admin@smartqueue.test} already exists.
 */
@Component
@Order(2)
@RequiredArgsConstructor
@Slf4j
@ConditionalOnProperty(name = "app.data.seed", havingValue = "true")
public class TestDataSeeder implements CommandLineRunner {

    public static final String SEED_ADMIN_EMAIL = "admin@smartqueue.test";
    public static final String SEED_AGENT_EMAIL = "agent@smartqueue.test";
    public static final String SEED_USER_EMAIL = "user@smartqueue.test";
    /** Shared password for all seeded accounts (change in real deployments). */
    public static final String SEED_PASSWORD = "Test1234!";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ServiceEntityRepository serviceEntityRepository;
    private final NotificationRepository notificationRepository;
    private final AppointmentRepository appointmentRepository;
    private final TicketRepository ticketRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.findByEmail(SEED_ADMIN_EMAIL).isPresent()) {
            log.info("Test data seed skipped ({} already exists).", SEED_ADMIN_EMAIL);
            return;
        }

        Role adminRole = roleRepository.findByName(RoleName.ADMIN)
                .orElseThrow(() -> new IllegalStateException("ADMIN role missing — run role initializer first"));
        Role agentRole = roleRepository.findByName(RoleName.AGENT)
                .orElseThrow(() -> new IllegalStateException("AGENT role missing"));
        Role userRole = roleRepository.findByName(RoleName.USER)
                .orElseThrow(() -> new IllegalStateException("USER role missing"));

        userRepository.save(User.builder()
                .firstName("Admin")
                .lastName("SmartQueue")
                .email(SEED_ADMIN_EMAIL)
                .password(passwordEncoder.encode(SEED_PASSWORD))
                .phone("+10000000001")
                .enabled(true)
                .role(adminRole)
                .build());

        userRepository.save(User.builder()
                .firstName("Agent")
                .lastName("Guichet")
                .email(SEED_AGENT_EMAIL)
                .password(passwordEncoder.encode(SEED_PASSWORD))
                .phone("+10000000002")
                .enabled(true)
                .role(agentRole)
                .build());

        User endUser = userRepository.save(User.builder()
                .firstName("Jean")
                .lastName("Usager")
                .email(SEED_USER_EMAIL)
                .password(passwordEncoder.encode(SEED_PASSWORD))
                .phone("+10000000003")
                .enabled(true)
                .role(userRole)
                .build());

        ServiceEntity svcPermis = serviceEntityRepository.save(ServiceEntity.builder()
                .name("Permis de conduire")
                .description("Dépôt et suivi de dossier permis")
                .averageDuration(25)
                .active(true)
                .build());

        ServiceEntity svcCni = serviceEntityRepository.save(ServiceEntity.builder()
                .name("Carte d'identité")
                .description("Première demande ou renouvellement")
                .averageDuration(20)
                .active(true)
                .build());

        notificationRepository.save(Notification.builder()
                .message("Bienvenue sur SmartQueue (données de test).")
                .type(NotificationType.SUCCESS)
                .read(false)
                .user(endUser)
                .build());

        notificationRepository.save(Notification.builder()
                .message("Pensez à vérifier la date de votre rendez-vous.")
                .type(NotificationType.INFO)
                .read(false)
                .user(endUser)
                .build());

        appointmentRepository.save(Appointment.builder()
                .appointmentDate(LocalDateTime.now().plusDays(2).withHour(10).withMinute(0).withSecond(0).withNano(0))
                .status(AppointmentStatus.CONFIRMED)
                .notes("Rendez-vous de test (seed)")
                .user(endUser)
                .service(svcPermis)
                .build());

        ticketRepository.save(Ticket.builder()
                .number("T-SEED-001")
                .status(TicketStatus.WAITING)
                .priority(false)
                .user(endUser)
                .service(svcCni)
                .build());

        log.info("""
                Test data seeded. Log in with (password for all: {}):
                  ADMIN: {}
                  AGENT: {}
                  USER:  {}
                """, SEED_PASSWORD, SEED_ADMIN_EMAIL, SEED_AGENT_EMAIL, SEED_USER_EMAIL);
    }
}
