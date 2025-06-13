package com.prigione.controller;

import com.prigione.dto.PrenotazioneRequest;
import com.prigione.model.Prenotazione;
import com.prigione.service.PrenotazioneService;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/prenotazioni")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
@RequiredArgsConstructor
@Tag(name = "Prenotazioni", description = "Gestione delle prenotazioni degli studi di registrazione")
public class PrenotazioneController {

    private final PrenotazioneService prenotazioneService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(
        summary = "Crea una nuova prenotazione",
        description = "Crea una nuova prenotazione per uno studio di registrazione. Richiede autenticazione.",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Prenotazione creata con successo",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = Prenotazione.class))),
        @ApiResponse(responseCode = "400", description = "Dati della prenotazione non validi"),
        @ApiResponse(responseCode = "401", description = "Utente non autenticato"),
        @ApiResponse(responseCode = "409", description = "Studio non disponibile per la data richiesta")
    })
    public ResponseEntity<Prenotazione> createPrenotazione(
            @Valid @RequestBody PrenotazioneRequest request) {
        return ResponseEntity.ok(prenotazioneService.createPrenotazione(request));
    }

    @GetMapping("/studio/{studioId}")
    @Operation(
        summary = "Ottieni prenotazioni per studio",
        description = "Restituisce tutte le prenotazioni associate a uno specifico studio di registrazione."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista prenotazioni recuperata con successo",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = List.class))),
        @ApiResponse(responseCode = "404", description = "Studio non trovato"),
        @ApiResponse(responseCode = "400", description = "ID studio non valido")
    })
    public ResponseEntity<List<Prenotazione>> getPrenotazioniByStudio(
            @Parameter(description = "ID dello studio di registrazione", required = true)
            @PathVariable String studioId) {
        return ResponseEntity.ok(prenotazioneService.getPrenotazioniByStudio(studioId));
    }

    @GetMapping("/mie")
    @PreAuthorize("isAuthenticated()")
    @Operation(
        summary = "Ottieni le mie prenotazioni",
        description = "Restituisce tutte le prenotazioni dell'utente autenticato.",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Liste prenotazioni personali recuperata con successo",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = List.class))),
        @ApiResponse(responseCode = "401", description = "Utente non autenticato")
    })
    public ResponseEntity<List<Prenotazione>> getMiePrenotazioni(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(prenotazioneService.getPrenotazioniByCantante(userDetails.getUsername()));
    }

    @GetMapping
    @Operation(
        summary = "Ottieni tutte le prenotazioni future",
        description = "Restituisce tutte le prenotazioni future nel sistema."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista prenotazioni future recuperata con successo",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = List.class))),
        @ApiResponse(responseCode = "500", description = "Errore interno del server")
    })
    public ResponseEntity<List<Prenotazione>> getPrenotazioniFuture() {
        return ResponseEntity.ok(prenotazioneService.getPrenotazioniFuture());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(
        summary = "Elimina prenotazione",
        description = "Cancella una prenotazione esistente. L'utente può cancellare solo le proprie prenotazioni.",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Prenotazione eliminata con successo"),
        @ApiResponse(responseCode = "401", description = "Utente non autenticato"),
        @ApiResponse(responseCode = "403", description = "Accesso negato - non puoi eliminare questa prenotazione"),
        @ApiResponse(responseCode = "404", description = "Prenotazione non trovata")
    })
    public ResponseEntity<Void> deletePrenotazione(
            @Parameter(description = "ID della prenotazione da eliminare", required = true)
            @PathVariable String id) {
        prenotazioneService.deletePrenotazione(id);
        return ResponseEntity.noContent().build();
    }
}