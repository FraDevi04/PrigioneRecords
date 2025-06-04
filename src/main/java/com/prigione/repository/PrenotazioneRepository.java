package com.prigione.repository;

import com.prigione.model.Prenotazione;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PrenotazioneRepository extends MongoRepository<Prenotazione, String> {
    
    boolean existsByStudioIdAndData(String studioId, LocalDate data);
    
    boolean existsByCantanteIdAndData(String cantanteId, LocalDate data);
    
    List<Prenotazione> findByStudioId(String studioId);
    
    List<Prenotazione> findByCantanteId(String cantanteId);
    
    List<Prenotazione> findByDataGreaterThanEqual(LocalDate data);
}