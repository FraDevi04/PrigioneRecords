package com.prigione.controller;

import com.prigione.dto.RecensioneRequest;
import com.prigione.model.Recensione;
import com.prigione.service.RecensioneService;
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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/recensioni")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
@RequiredArgsConstructor
@Tag(name = "Recensioni", description = "Gestione delle recensioni degli studi di registrazione")
public class RecensioneController {

    private final RecensioneService recensioneService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(
        summary = "Crea una nuova recensione",
        description = "Permette di creare una recensione per uno studio di registrazione. Richiede autenticazione.",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Recensione creata con successo",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = Recensione.class))),
        @ApiResponse(responseCode = "400", description = "Dati della recensione non validi"),
        @ApiResponse(responseCode = "401", description = "Utente non autenticato"),
        @ApiResponse(responseCode = "409", description = "Recensione già esistente per questo studio da parte dell'utente")
    })
    public ResponseEntity<Recensione> createRecensione(
            @Valid @RequestBody RecensioneRequest request) {
        return ResponseEntity.ok(recensioneService.createRecensione(request));
    }

    @GetMapping("/studio/{studioId}")
    @Operation(
        summary = "Ottieni recensioni per studio",
        description = "Restituisce tutte le recensioni associate a uno specifico studio di registrazione."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista recensioni recuperata con successo",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = List.class))),
        @ApiResponse(responseCode = "404", description = "Studio non trovato"),
        @ApiResponse(responseCode = "400", description = "ID studio non valido")
    })
    public ResponseEntity<List<Recensione>> getRecensioniByStudio(
            @Parameter(description = "ID dello studio di registrazione", required = true)
            @PathVariable String studioId) {
        return ResponseEntity.ok(recensioneService.getRecensioniByStudio(studioId));
    }

    @GetMapping("/mie")
    @PreAuthorize("isAuthenticated()")
    @Operation(
        summary = "Ottieni le mie recensioni",
        description = "Restituisce tutte le recensioni scritte dall'utente autenticato.",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista recensioni personali recuperata con successo",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = List.class))),
        @ApiResponse(responseCode = "401", description = "Utente non autenticato")
    })
    public ResponseEntity<List<Recensione>> getMieRecensioni() {
        return ResponseEntity.ok(recensioneService.getMieRecensioni());
    }

    @GetMapping
    @Operation(
        summary = "Ottieni tutte le recensioni",
        description = "Restituisce tutte le recensioni presenti nel sistema."
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Lista completa recensioni recuperata con successo",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = List.class))),
        @ApiResponse(responseCode = "500", description = "Errore interno del server")
    })
    public ResponseEntity<List<Recensione>> getAllRecensioni() {
        return ResponseEntity.ok(recensioneService.getAllRecensioni());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(
        summary = "Elimina recensione",
        description = "Cancella una recensione esistente. L'utente può eliminare solo le proprie recensioni.",
        security = @SecurityRequirement(name = "Bearer Authentication")
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "204", description = "Recensione eliminata con successo"),
        @ApiResponse(responseCode = "401", description = "Utente non autenticato"),
        @ApiResponse(responseCode = "403", description = "Accesso negato - non puoi eliminare questa recensione"),
        @ApiResponse(responseCode = "404", description = "Recensione non trovata")
    })
    public ResponseEntity<Void> deleteRecensione(
            @Parameter(description = "ID della recensione da eliminare", required = true)
            @PathVariable String id) {
        recensioneService.deleteRecensione(id);
        return ResponseEntity.noContent().build();
    }
}