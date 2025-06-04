package com.prigione.controller;

import com.prigione.dto.StudioRequest;
import com.prigione.model.StudioRegistrazione;
import com.prigione.service.StudioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/studi")
@RequiredArgsConstructor
@Tag(name = "Studi di Registrazione", description = "Gestione degli studi di registrazione")
public class StudioController {

    private final StudioService studioService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
        summary = "Crea un nuovo studio di registrazione",
        description = "Crea un nuovo studio di registrazione. Richiede privilegi di amministratore.",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Studio creato con successo",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = StudioRegistrazione.class))),
        @ApiResponse(responseCode = "400", description = "Dati dello studio non validi"),
        @ApiResponse(responseCode = "401", description = "Utente non autenticato"),
        @ApiResponse(responseCode = "403", description = "Accesso negato - richiesti privilegi di amministratore")
    })
    public ResponseEntity<StudioRegistrazione> createStudio(@Valid @RequestBody StudioRequest request) {
        return ResponseEntity.ok(studioService.createStudio(request));
    }

    @GetMapping
    @Operation(
        summary = "Ottieni tutti gli studi di registrazione",
        description = "Restituisce la lista di tutti gli studi di registrazione disponibili nel sistema."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista studi recuperata con successo",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = List.class))),
        @ApiResponse(responseCode = "500", description = "Errore interno del server")
    })
    public ResponseEntity<List<StudioRegistrazione>> getAllStudi() {
        return ResponseEntity.ok(studioService.getAllStudi());
    }

    @GetMapping("/{id}")
    @Operation(
        summary = "Ottieni studio per ID",
        description = "Restituisce i dettagli di uno studio di registrazione specifico."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Studio trovato",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = StudioRegistrazione.class))),
        @ApiResponse(responseCode = "404", description = "Studio non trovato"),
        @ApiResponse(responseCode = "400", description = "ID non valido")
    })
    public ResponseEntity<StudioRegistrazione> getStudioById(
            @Parameter(description = "ID dello studio di registrazione", required = true)
            @PathVariable String id) {
        return ResponseEntity.ok(studioService.getStudioById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
        summary = "Aggiorna studio di registrazione",
        description = "Aggiorna i dati di uno studio di registrazione esistente. Richiede privilegi di amministratore.",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Studio aggiornato con successo",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = StudioRegistrazione.class))),
        @ApiResponse(responseCode = "400", description = "Dati dello studio non validi"),
        @ApiResponse(responseCode = "401", description = "Utente non autenticato"),
        @ApiResponse(responseCode = "403", description = "Accesso negato - richiesti privilegi di amministratore"),
        @ApiResponse(responseCode = "404", description = "Studio non trovato")
    })
    public ResponseEntity<StudioRegistrazione> updateStudio(
            @Parameter(description = "ID dello studio da aggiornare", required = true)
            @PathVariable String id,
            @Valid @RequestBody StudioRequest request) {
        return ResponseEntity.ok(studioService.updateStudio(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(
        summary = "Elimina studio di registrazione",
        description = "Elimina definitivamente uno studio di registrazione dal sistema. Richiede privilegi di amministratore.",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Studio eliminato con successo"),
        @ApiResponse(responseCode = "401", description = "Utente non autenticato"),
        @ApiResponse(responseCode = "403", description = "Accesso negato - richiesti privilegi di amministratore"),
        @ApiResponse(responseCode = "404", description = "Studio non trovato")
    })
    public ResponseEntity<Void> deleteStudio(
            @Parameter(description = "ID dello studio da eliminare", required = true)
            @PathVariable String id) {
        studioService.deleteStudio(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/disponibilita")
    @Operation(
        summary = "Verifica disponibilità studio",
        description = "Controlla se uno studio di registrazione è disponibile in una data specifica."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Stato disponibilità recuperato",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = Boolean.class))),
        @ApiResponse(responseCode = "400", description = "Parametri non validi"),
        @ApiResponse(responseCode = "404", description = "Studio non trovato")
    })
    public ResponseEntity<Boolean> checkDisponibilita(
            @Parameter(description = "ID dello studio di registrazione", required = true)
            @PathVariable String id,
            @Parameter(description = "Data da verificare (formato: YYYY-MM-DD)", required = true, example = "2024-01-15")
            @RequestParam String data) {
        return ResponseEntity.ok(studioService.isStudioDisponibile(id, java.time.LocalDate.parse(data)));
    }
}