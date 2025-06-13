package com.prigione.service;

import com.prigione.dto.StudioRequest;
import com.prigione.model.StudioRegistrazione;
import com.prigione.repository.PrenotazioneRepository;
import com.prigione.repository.StudioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudioService {

    private final StudioRepository studioRepository;
    private final PrenotazioneRepository prenotazioneRepository;

    @Transactional
    @CacheEvict(value = {"studios", "studioById"}, allEntries = true)
    public StudioRegistrazione createStudio(StudioRequest request) {
        if (studioRepository.existsByNome(request.getNome())) {
            throw new RuntimeException("Studio già esistente con questo nome");
        }

        StudioRegistrazione studio = new StudioRegistrazione();
        studio.setNome(request.getNome());
        studio.setIndirizzo(request.getIndirizzo());

        return studioRepository.save(studio);
    }

    @Cacheable(value = "studios")
    public List<StudioRegistrazione> getAllStudios() {
        System.out.println("🔍 Debug Service: Chiamato studioRepository.findAll()");
        List<StudioRegistrazione> result = studioRepository.findAll();
        System.out.println("🔍 Debug Service: Repository ha restituito " + result.size() + " risultati");
        return result;
    }

    @Cacheable(value = "studioById", key = "#id")
    public StudioRegistrazione getStudioById(String id) {
        return studioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Studio non trovato"));
    }

    public boolean isStudioDisponibile(String studioId, LocalDate data) {
        return !prenotazioneRepository.existsByStudioIdAndData(studioId, data);
    }

    @Transactional
    @CacheEvict(value = {"studios", "studioById"}, allEntries = true)
    public StudioRegistrazione updateStudio(String id, StudioRequest request) {
        StudioRegistrazione studio = getStudioById(id);
        
        if (!studio.getNome().equals(request.getNome()) && 
            studioRepository.existsByNome(request.getNome())) {
            throw new RuntimeException("Studio già esistente con questo nome");
        }

        studio.setNome(request.getNome());
        studio.setIndirizzo(request.getIndirizzo());

        return studioRepository.save(studio);
    }

    @Transactional
    @CacheEvict(value = {"studios", "studioById"}, allEntries = true)
    public void deleteStudio(String id) {
        if (!studioRepository.existsById(id)) {
            throw new RuntimeException("Studio non trovato");
        }
        studioRepository.deleteById(id);
    }
}