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
import org.springframework.security.core.userdetails.UserDetails;
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

        var accessToken = jwtService.generateToken(cantante);
        var refreshToken = jwtService.generateRefreshToken(cantante);
        
        return new AuthResponse(
            accessToken,
            refreshToken,
            cantante.getId(),
            cantante.getNome(),
            cantante.getEmail()
        );
    }

    public AuthResponse login(AuthRequest request) {
        var cantante = cantanteRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("Utente non trovato"));

        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        var accessToken = jwtService.generateToken(cantante);
        var refreshToken = jwtService.generateRefreshToken(cantante);
        
        return new AuthResponse(
            accessToken,
            refreshToken,
            cantante.getId(),
            cantante.getNome(),
            cantante.getEmail()
        );
    }

    public AuthResponse refreshToken(String refreshToken) {
        String username = jwtService.extractUsername(refreshToken);
        Cantante cantante = cantanteRepository.findById(username)
            .orElseThrow(() -> new RuntimeException("Utente non trovato"));

        if (jwtService.validateRefreshToken(refreshToken, cantante)) {
            var accessToken = jwtService.generateToken(cantante);
            var newRefreshToken = jwtService.generateRefreshToken(cantante);
            
            return new AuthResponse(
                accessToken,
                newRefreshToken,
                cantante.getId(),
                cantante.getNome(),
                cantante.getEmail()
            );
        }
        
        throw new RuntimeException("Token di refresh non valido");
    }
}