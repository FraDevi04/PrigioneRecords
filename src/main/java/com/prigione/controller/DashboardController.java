package com.prigione.controller;

import com.prigione.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Endpoint per ottenere dati statistici della dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(
        summary = "Ottieni dati della dashboard",
        description = "Restituisce i dati statistici e di riepilogo per la dashboard dell'utente autenticato.",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Dati dashboard recuperati con successo",
            content = @Content(mediaType = "application/json", 
                schema = @Schema(type = "object", 
                    example = "{\"totalStudi\": 5, \"totalPrenotazioni\": 23, \"totalRecensioni\": 15, \"prenotazioniAttive\": 3}"))),
        @ApiResponse(responseCode = "401", description = "Utente non autenticato"),
        @ApiResponse(responseCode = "500", description = "Errore interno del server")
    })
    public ResponseEntity<Map<String, Object>> getDashboardData() {
        return ResponseEntity.ok(dashboardService.getDashboardData());
    }
}