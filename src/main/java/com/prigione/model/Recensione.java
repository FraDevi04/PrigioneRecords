package com.prigione.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.CompoundIndex;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.time.LocalDateTime;

@Data
@Document(collection = "recensioni")
@CompoundIndex(name = "cantante_studio_idx", def = "{cantanteId: 1, studioId: 1}", unique = true)
public class Recensione {

    @Id
    private String id;

    private String cantanteId;

    private String studioId;

    @Min(1)
    @Max(5)
    private Integer valutazione;

    private String commento;

    private LocalDateTime dataRecensione = LocalDateTime.now();

    // Metadati aggiuntivi
    private String nomeCantante; // Per evitare join nelle query
    private String nomeStudio;   // Per evitare join nelle query
}