package com.prigione.controller;

import com.prigione.dto.PrenotazioneRequest;
import com.prigione.model.Prenotazione;
import com.prigione.service.PrenotazioneService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/prenotazioni")
@RequiredArgsConstructor
public class PrenotazioneController {

    private final PrenotazioneService prenotazioneService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Prenotazione> createPrenotazione(
            @Valid @RequestBody PrenotazioneRequest request) {
        return ResponseEntity.ok(prenotazioneService.createPrenotazione(request));
    }

    @GetMapping("/studio/{studioId}")
    public ResponseEntity<List<Prenotazione>> getPrenotazioniByStudio(
            @PathVariable String studioId) {
        return ResponseEntity.ok(prenotazioneService.getPrenotazioniByStudio(studioId));
    }

    @GetMapping("/mie")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Prenotazione>> getMiePrenotazioni(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(prenotazioneService.getPrenotazioniByCantante(userDetails.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<Prenotazione>> getPrenotazioniAttuali() {
        return ResponseEntity.ok(prenotazioneService.getPrenotazioniAttuali());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deletePrenotazione(@PathVariable String id) {
        prenotazioneService.deletePrenotazione(id);
        return ResponseEntity.noContent().build();
    }
}