package com.prigione.service;

import com.prigione.model.Prenotazione;
import com.prigione.model.Recensione;
import com.prigione.repository.CantanteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final PrenotazioneService prenotazioneService;
    private final RecensioneService recensioneService;
    private final CantanteRepository cantanteRepository;

    public Map<String, Object> getDashboardData() {
        // Ottieni l'email del cantante dal token (subject)
        String cantanteEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        
        // Trova il cantante per ottenere l'ID
        var cantante = cantanteRepository.findByEmail(cantanteEmail)
                .orElseThrow(() -> new RuntimeException("Cantante non trovato"));
        
        String cantanteId = cantante.getId();

        // Ottieni le prenotazioni del cantante
        List<Prenotazione> prenotazioni = prenotazioneService.getPrenotazioniByCantante(cantanteId);
        List<Recensione> recensioni = recensioneService.getRecensioniByCantante(cantanteId);

        // Filtra le prenotazioni future
        List<Prenotazione> prenotazioniFuture = prenotazioni.stream()
                .filter(p -> p.getData().isAfter(LocalDate.now()))
                .toList();

        Map<String, Object> dashboardData = new HashMap<>();
        dashboardData.put("prenotazioniTotali", prenotazioni.size());
        dashboardData.put("prenotazioniFuture", prenotazioniFuture);
        dashboardData.put("recensioniTotali", recensioni.size());
        dashboardData.put("recensioni", recensioni);

        return dashboardData;
    }
}