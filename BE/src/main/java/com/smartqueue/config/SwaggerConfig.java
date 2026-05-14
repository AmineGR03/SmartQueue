package com.smartqueue.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI smartQueueOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("SmartQueue API")
                        .description("REST API for queue tickets, appointments, and administration.")
                        .version("1.0"));
    }
}
