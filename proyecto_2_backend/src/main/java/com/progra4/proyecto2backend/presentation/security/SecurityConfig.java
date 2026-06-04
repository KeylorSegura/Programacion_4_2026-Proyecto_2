package com.progra4.proyecto2backend.presentation.security;

import com.progra4.proyecto2backend.data.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import java.util.Arrays;

@Configuration
@AllArgsConstructor
public class SecurityConfig {
    private final JwtConfig jwtConfig;
    private final UsuarioRepository usuarioRepository;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(request -> {
                    CorsConfiguration configuration = new CorsConfiguration();
                    configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
                    configuration.setAllowedMethods(Arrays.asList("GET","POST", "PUT", "DELETE","OPTIONS"));
                    configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
                    return configuration;
                }))
                .sessionManagement(sessionManagement -> sessionManagement
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorizeRequests -> authorizeRequests
                        .requestMatchers("/api/publico/**").permitAll()
                        .requestMatchers("/api/empresa/**").hasAnyAuthority("SCOPE_Empresa")
                        .requestMatchers("/api/oferente/**").hasAnyAuthority("SCOPE_Oferente")
                        .requestMatchers("/api/admin/**").hasAnyAuthority("SCOPE_Administrador")
           .requestMatchers("/**").permitAll()
                        .anyRequest().authenticated())
                .oauth2ResourceServer(configurer -> configurer.jwt(Customizer.withDefaults()))
                .build();
    }

    @Bean
    public JwtDecoder jwtDecoder() {
        return NimbusJwtDecoder.withSecretKey(jwtConfig.getSecretKey()).build();
    }
}
