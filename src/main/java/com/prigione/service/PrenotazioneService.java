package com.prigione.service;

import com.prigione.dto.PrenotazioneRequest;
import com.prigione.model.Prenotazione;
import com.prigione.repository.CantanteRepository;
import com.prigione.repository.PrenotazioneRepository;
import com.prigione.repository.StudioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PrenotazioneService {

    private final PrenotazioneRepository prenotazioneRepository;
    private final StudioRepository studioRepository;
    private final CantanteRepository cantanteRepository;

    @Transactional
    @CacheEvict(value = {"prenotazioni", "prenotazioniByStudio", "prenotazioniByCantante"}, allEntries = true)
    public Prenotazione createPrenotazione(PrenotazioneRequest request) {
        // Verifica se lo studio esiste
        if (!studioRepository.existsById(request.getStudioId())) {
            throw new RuntimeException("Studio non trovato");
        }

        // Verifica se la data è valida
        if (request.getData().isBefore(LocalDate.now())) {
            throw new RuntimeException("Non è possibile prenotare per date passate");
        }

        // Ottieni l'email del cantante dal token (subject)
        String cantanteEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        
        // Trova il cantante per ottenere l'ID
        var cantante = cantanteRepository.findByEmail(cantanteEmail)
                .orElseThrow(() -> new RuntimeException("Cantante non trovato"));
        
        String cantanteId = cantante.getId();

        // Verifica se lo studio è già prenotato per quella data
        if (prenotazioneRepository.existsByStudioIdAndData(request.getStudioId(), request.getData())) {
            throw new RuntimeException("Studio già prenotato per questa data");
        }

        // Verifica se il cantante ha già una prenotazione per quella data
        if (prenotazioneRepository.existsByCantanteIdAndData(cantanteId, request.getData())) {
            throw new RuntimeException("Hai già una prenotazione per questa data");
        }

        var prenotazione = new Prenotazione();
        prenotazione.setCantanteId(cantanteId);
        prenotazione.setStudioId(request.getStudioId());
        prenotazione.setData(request.getData());
        prenotazione.setNote(request.getNote());

        return prenotazioneRepository.save(prenotazione);
    }

    @Cacheable(value = "prenotazioniByStudio", key = "#studioId")
    public List<Prenotazione> getPrenotazioniByStudio(String studioId) {
        if (!studioRepository.existsById(studioId)) {
            throw new RuntimeException("Studio non trovato");
        }
        return prenotazioneRepository.findByStudioId(studioId);
    }

    @Cacheable(value = "prenotazioniByCantante", key = "#cantanteId")
    public List<Prenotazione> getPrenotazioniByCantante(String cantanteId) {
        return prenotazioneRepository.findByCantanteId(cantanteId);
    }

    @Cacheable(value = "prenotazioniFuture")
    public List<Prenotazione> getPrenotazioniFuture() {
        return prenotazioneRepository.findByDataGreaterThanEqual(LocalDate.now());
    }

    @Transactional
    @CacheEvict(value = {"prenotazioni", "prenotazioniByStudio", "prenotazioniByCantante", "prenotazioniFuture"}, allEntries = true)
    public void deletePrenotazione(String id) {
        var prenotazione = prenotazioneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Prenotazione non trovata"));

        // Ottieni l'email del cantante dal token (subject)
        String cantanteEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        
        // Trova il cantante per ottenere l'ID
        var cantante = cantanteRepository.findByEmail(cantanteEmail)
                .orElseThrow(() -> new RuntimeException("Cantante non trovato"));
        
        String cantanteId = cantante.getId();
        
        if (!prenotazione.getCantanteId().equals(cantanteId)) {
            throw new RuntimeException("Non puoi cancellare le prenotazioni di altri cantanti");
        }

        if (prenotazione.getData().isBefore(LocalDate.now())) {
            throw new RuntimeException("Non puoi cancellare prenotazioni passate");
        }

        prenotazioneRepository.deleteById(id);
    }
}