package com.prigione.service;

import com.prigione.dto.AuthRequest;
import com.prigione.dto.AuthResponse;
import com.prigione.dto.RegisterRequest;
import com.prigione.model.Cantante;
import com.prigione.repository.CantanteRepository;
import com.prigione.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final CantanteRepository cantanteRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (cantanteRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email già registrata");
        }

        var cantante = new Cantante();
        cantante.setNome(request.getNome());
        cantante.setEmail(request.getEmail());
        cantante.setPassword(passwordEncoder.encode(request.getPassword()));

        cantante = cantanteRepository.save(cantante);

        var token = jwtService.generateToken(cantante);
        return new AuthResponse(token, cantante.getId(), cantante.getNome(), cantante.getEmail());
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        var cantante = cantanteRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Utente non trovato"));

        var token = jwtService.generateToken(cantante);
        return new AuthResponse(token, cantante.getId(), cantante.getNome(), cantante.getEmail());
    }
}