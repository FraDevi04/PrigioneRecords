package com.prigione.service;

import com.prigione.dto.StudioRequest;
import com.prigione.model.StudioRegistrazione;
import com.prigione.repository.PrenotazioneRepository;
import com.prigione.repository.StudioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudioService {

    private final StudioRepository studioRepository;
    private final PrenotazioneRepository prenotazioneRepository;

    public StudioRegistrazione createStudio(StudioRequest request) {
        if (studioRepository.existsByNome(request.getNome())) {
            throw new RuntimeException("Studio con questo nome già esistente");
        }

        var studio = new StudioRegistrazione();
        studio.setNome(request.getNome());
        studio.setIndirizzo(request.getIndirizzo());
        
        return studioRepository.save(studio);
    }

    public List<StudioRegistrazione> getAllStudi() {
        return studioRepository.findAll();
    }

    public StudioRegistrazione getStudioById(String id) {
        return studioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Studio non trovato"));
    }

    public boolean isStudioDisponibile(String studioId, LocalDate data) {
        return !prenotazioneRepository.existsByStudioIdAndData(studioId, data);
    }

    public StudioRegistrazione updateStudio(String id, StudioRequest request) {
        var studio = getStudioById(id);
        
        // Verifica se il nuovo nome è già utilizzato da un altro studio
        if (!studio.getNome().equals(request.getNome()) && 
            studioRepository.existsByNome(request.getNome())) {
            throw new RuntimeException("Studio con questo nome già esistente");
        }

        studio.setNome(request.getNome());
        studio.setIndirizzo(request.getIndirizzo());
        
        return studioRepository.save(studio);
    }

    public void deleteStudio(String id) {
        if (!studioRepository.existsById(id)) {
            throw new RuntimeException("Studio non trovato");
        }
        studioRepository.deleteById(id);
    }
}