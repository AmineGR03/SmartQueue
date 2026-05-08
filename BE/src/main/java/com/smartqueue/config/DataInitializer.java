package com.smartqueue.config;

import com.smartqueue.entity.Role;
import com.smartqueue.entity.enums.RoleName;
import com.smartqueue.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer
        implements CommandLineRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(String... args) {

        for (RoleName roleName : RoleName.values()) {

            roleRepository.findByName(roleName)
                    .orElseGet(() ->
                            roleRepository.save(
                                    Role.builder()
                                            .name(roleName)
                                            .build()
                            )
                    );
        }
    }
}