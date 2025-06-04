package com.prigione.repository;

import com.prigione.model.StudioRegistrazione;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudioRepository extends MongoRepository<StudioRegistrazione, String> {
    
    boolean existsByNome(String nome);
}