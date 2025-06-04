package com.prigione.service;

import com.prigione.model.Prenotazione;
import com.prigione.model.Recensione;
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

    public Map<String, Object> getDashboardData() {
        String cantanteId = SecurityContextHolder.getContext().getAuthentication().getName();

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