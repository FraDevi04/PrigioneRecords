package com.prigione.service;

import com.prigione.dto.RecensioneRequest;
import com.prigione.model.Recensione;
import com.prigione.repository.CantanteRepository;
import com.prigione.repository.RecensioneRepository;
import com.prigione.repository.StudioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RecensioneService {

    private final RecensioneRepository recensioneRepository;
    private final StudioRepository studioRepository;
    private final CantanteRepository cantanteRepository;

    @Transactional
    @CacheEvict(value = {"recensioni", "recensioniByStudio", "recensioniByCantante"}, allEntries = true)
    public Recensione createRecensione(RecensioneRequest request) {
        // Ottieni l'email del cantante dal token (subject)
        String cantanteEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        
        // Trova il cantante per ottenere l'ID
        var cantante = cantanteRepository.findByEmail(cantanteEmail)
                .orElseThrow(() -> new RuntimeException("Cantante non trovato"));
        
        String cantanteId = cantante.getId();

        // Verifica se lo studio esiste
        var studio = studioRepository.findById(request.getStudioId())
                .orElseThrow(() -> new RuntimeException("Studio non trovato"));

        // Verifica se il cantante ha già recensito questo studio
        if (recensioneRepository.existsByCantanteIdAndStudioId(cantanteId, request.getStudioId())) {
            throw new RuntimeException("Hai già recensito questo studio");
        }

        var recensione = new Recensione();
        recensione.setCantanteId(cantanteId);
        recensione.setStudioId(request.getStudioId());
        recensione.setValutazione(request.getValutazione());
        recensione.setCommento(request.getCommento());
        recensione.setNomeCantante(cantante.getNome());
        recensione.setNomeStudio(studio.getNome());

        // Aggiorna la media delle recensioni dello studio
        studio.aggiornaMediaRecensioni(request.getValutazione());
        studioRepository.save(studio);

        return recensioneRepository.save(recensione);
    }

    @Cacheable(value = "recensioniByStudio", key = "#studioId")
    public List<Recensione> getRecensioniByStudio(String studioId) {
        if (!studioRepository.existsById(studioId)) {
            throw new RuntimeException("Studio non trovato");
        }
        return recensioneRepository.findByStudioId(studioId);
    }

    @Cacheable(value = "recensioniByCantante", key = "#cantanteId")
    public List<Recensione> getRecensioniByCantante(String cantanteId) {
        if (!cantanteRepository.existsById(cantanteId)) {
            throw new RuntimeException("Cantante non trovato");
        }
        return recensioneRepository.findByCantanteId(cantanteId);
    }

    public List<Recensione> getAllRecensioni() {
        return recensioneRepository.findAll();
    }

    @Transactional
    @CacheEvict(value = {"recensioni", "recensioniByStudio", "recensioniByCantante"}, allEntries = true)
    public void deleteRecensione(String id) {
        var recensione = recensioneRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Recensione non trovata"));

        // Ottieni l'email del cantante dal token (subject)
        String cantanteEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        
        // Trova il cantante per ottenere l'ID
        var cantante = cantanteRepository.findByEmail(cantanteEmail)
                .orElseThrow(() -> new RuntimeException("Cantante non trovato"));
        
        String cantanteId = cantante.getId();
        
        if (!recensione.getCantanteId().equals(cantanteId)) {
            throw new RuntimeException("Non puoi cancellare le recensioni di altri cantanti");
        }

        // Aggiorna la media delle recensioni dello studio
        var studio = studioRepository.findById(recensione.getStudioId())
                .orElseThrow(() -> new RuntimeException("Studio non trovato"));

        // Rimuovi questa recensione dal calcolo della media
        if (studio.getNumeroRecensioni() > 1) {
            double nuovaMedia = (studio.getMediaRecensioni() * studio.getNumeroRecensioni() - recensione.getValutazione()) 
                               / (studio.getNumeroRecensioni() - 1);
            studio.setMediaRecensioni(nuovaMedia);
            studio.setNumeroRecensioni(studio.getNumeroRecensioni() - 1);
        } else {
            // Se era l'unica recensione, azzera la media
            studio.setMediaRecensioni(0.0);
            studio.setNumeroRecensioni(0);
        }
        
        studioRepository.save(studio);
        recensioneRepository.deleteById(id);
    }
}