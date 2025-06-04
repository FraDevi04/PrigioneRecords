package com.prigione.repository;

import com.prigione.model.Recensione;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RecensioneRepository extends MongoRepository<Recensione, String> {
    
    List<Recensione> findByStudioId(String studioId);
    
    List<Recensione> findByCantanteId(String cantanteId);
    
    Optional<Recensione> findByCantanteIdAndStudioId(String cantanteId, String studioId);
    
    boolean existsByCantanteIdAndStudioId(String cantanteId, String studioId);
}