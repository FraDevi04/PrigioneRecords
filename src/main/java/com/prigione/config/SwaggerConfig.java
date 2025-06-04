package com.prigione.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Prigione Records API")
                        .description("API per la gestione di studi di registrazione - Sistema completo per prenotazioni, recensioni e gestione studi")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("Prigione Records Team")
                                .email("support@prigionerecords.com")
                                .url("https://github.com/FraDevi04/PrigioneRecords"))
                        .license(new License()
                                .name("MIT License")
                                .url("https://opensource.org/licenses/MIT")))
                .servers(List.of(
                        new Server()
                                .url("http://localhost:8080")
                                .description("Ambiente di sviluppo"),
                        new Server()
                                .url("https://api.prigionerecords.com")
                                .description("Ambiente di produzione")))
                .components(new Components()
                        .addSecuritySchemes("Bearer Authentication", 
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")
                                        .description("Inserisci il token JWT. Esempio: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'")))
                .addSecurityItem(new SecurityRequirement()
                        .addList("Bearer Authentication"));
    }
} 