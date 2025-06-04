package com.prigione.repository;

import com.prigione.model.Cantante;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CantanteRepository extends MongoRepository<Cantante, String> {
    
    Optional<Cantante> findByEmail(String email);
    
    boolean existsByEmail(String email);
}