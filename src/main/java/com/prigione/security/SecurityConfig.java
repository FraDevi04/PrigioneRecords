package com.prigione.security;

import com.prigione.service.CustomUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;
    private final CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .authorizeHttpRequests(auth -> auth
                // Endpoint di autenticazione (sempre pubblici)
                .requestMatchers("/api/auth/**").permitAll()
                
                // Health check endpoints
                .requestMatchers("/actuator/health").permitAll()
                
                // Documentazione API (sempre pubblica)
                .requestMatchers(
                    "/api/swagger-ui/**", 
                    "/api/swagger-ui.html", 
                    "/api/api-docs/**",
                    "/swagger-ui/**", 
                    "/swagger-ui.html", 
                    "/api-docs/**",
                    "/swagger-resources/**",
                    "/webjars/**",
                    "/v3/api-docs/**"
                ).permitAll()
                
                // Endpoint pubblici per visualizzazione studi e recensioni
                .requestMatchers("/api/studi", "/api/studi/**").permitAll()
                .requestMatchers("GET", "/api/recensioni/studio/**").permitAll()
                .requestMatchers("GET", "/api/prenotazioni/studio/**").permitAll()
                
                // OPTIONS requests for CORS preflight
                .requestMatchers("OPTIONS", "/**").permitAll()
                
                // Tutti gli altri endpoint richiedono autenticazione
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}