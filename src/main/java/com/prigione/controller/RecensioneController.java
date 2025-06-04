package com.prigione.controller;

import com.prigione.dto.RecensioneRequest;
import com.prigione.model.Recensione;
import com.prigione.service.RecensioneService;
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
@RequiredArgsConstructor
public class RecensioneController {

    private final RecensioneService recensioneService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Recensione> createRecensione(
            @Valid @RequestBody RecensioneRequest request) {
        return ResponseEntity.ok(recensioneService.createRecensione(request));
    }

    @GetMapping("/studio/{studioId}")
    public ResponseEntity<List<Recensione>> getRecensioniByStudio(
            @PathVariable String studioId) {
        return ResponseEntity.ok(recensioneService.getRecensioniByStudio(studioId));
    }

    @GetMapping("/mie")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Recensione>> getMieRecensioni(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(recensioneService.getRecensioniByCantante(userDetails.getUsername()));
    }

    @GetMapping
    public ResponseEntity<List<Recensione>> getAllRecensioni() {
        return ResponseEntity.ok(recensioneService.getAllRecensioni());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteRecensione(@PathVariable String id) {
        recensioneService.deleteRecensione(id);
        return ResponseEntity.noContent().build();
    }
}