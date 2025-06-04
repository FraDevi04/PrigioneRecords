package com.prigione.controller;

import com.prigione.dto.StudioRequest;
import com.prigione.model.StudioRegistrazione;
import com.prigione.service.StudioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/studi")
@RequiredArgsConstructor
public class StudioController {

    private final StudioService studioService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudioRegistrazione> createStudio(@Valid @RequestBody StudioRequest request) {
        return ResponseEntity.ok(studioService.createStudio(request));
    }

    @GetMapping
    public ResponseEntity<List<StudioRegistrazione>> getAllStudi() {
        return ResponseEntity.ok(studioService.getAllStudi());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudioRegistrazione> getStudioById(@PathVariable String id) {
        return ResponseEntity.ok(studioService.getStudioById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudioRegistrazione> updateStudio(
            @PathVariable String id,
            @Valid @RequestBody StudioRequest request) {
        return ResponseEntity.ok(studioService.updateStudio(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteStudio(@PathVariable String id) {
        studioService.deleteStudio(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/disponibilita")
    public ResponseEntity<Boolean> checkDisponibilita(
            @PathVariable String id,
            @RequestParam String data) {
        return ResponseEntity.ok(studioService.isStudioDisponibile(id, java.time.LocalDate.parse(data)));
    }
}