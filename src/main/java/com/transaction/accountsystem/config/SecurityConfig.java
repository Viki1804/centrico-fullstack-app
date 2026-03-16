package com.transaction.accountsystem.config;

import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {


    @Bean
    public BCryptPasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth

                    // allow swagger
                    .requestMatchers(
                            "/swagger-ui/**",
                            "/v3/api-docs/**",
                            "/swagger-ui.html"
                    ).permitAll()

                    // allow customer + account APIs
                    .requestMatchers("/api/customers/**").permitAll()
                    .requestMatchers("/api/accounts/**").permitAll()

                    // protect transaction APIs
                    .requestMatchers("/api/transactions/**").authenticated()

                    // everything else open
                    .anyRequest().permitAll()
            )

            .httpBasic();

        return http.build();
    }
}