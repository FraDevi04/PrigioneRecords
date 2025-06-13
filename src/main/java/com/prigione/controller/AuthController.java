package com.prigione.controller;

import com.prigione.dto.AuthRequest;
import com.prigione.dto.AuthResponse;
import com.prigione.dto.RegisterRequest;
import com.prigione.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoint per autenticazione e registrazione utenti")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @Operation(
        summary = "Registra un nuovo utente",
        description = "Crea un nuovo account utente nel sistema. L'utente riceverà automaticamente il ruolo USER."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Registrazione completata con successo",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = AuthResponse.class))),
        @ApiResponse(responseCode = "400", description = "Dati di registrazione non validi"),
        @ApiResponse(responseCode = "409", description = "Email già esistente nel sistema")
    })
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    @Operation(
        summary = "Effettua il login",
        description = "Autentica un utente esistente e restituisce un token JWT per l'accesso alle API protette."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login effettuato con successo",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = AuthResponse.class))),
        @ApiResponse(responseCode = "401", description = "Credenziali non valide"),
        @ApiResponse(responseCode = "400", description = "Dati di login non validi")
    })
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    @Operation(
        summary = "Aggiorna il token di accesso",
        description = "Utilizza il token di refresh per ottenere un nuovo token di accesso."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Token aggiornato con successo",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = AuthResponse.class))),
        @ApiResponse(responseCode = "401", description = "Token di refresh non valido")
    })
    public ResponseEntity<AuthResponse> refreshToken(@RequestBody String refreshToken) {
        return ResponseEntity.ok(authService.refreshToken(refreshToken));
    }
}