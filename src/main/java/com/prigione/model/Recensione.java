package com.prigione.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.time.LocalDateTime;

@Data
@Document(collection = "recensioni")
@CompoundIndexes({
    @CompoundIndex(name = "cantante_studio_idx", def = "{cantanteId: 1, studioId: 1}", unique = true),
    @CompoundIndex(name = "studio_valutazione_idx", def = "{studioId: 1, valutazione: -1}"),
    @CompoundIndex(name = "data_recensione_idx", def = "{dataRecensione: -1}")
})
public class Recensione {

    @Id
    private String id;

    @Indexed
    private String cantanteId;

    @Indexed
    private String studioId;

    @Min(1)
    @Max(5)
    private Integer valutazione;

    private String commento;

    @Indexed
    private LocalDateTime dataRecensione = LocalDateTime.now();

    // Metadati aggiuntivi
    @Indexed
    private String nomeCantante; // Per evitare join nelle query
    @Indexed
    private String nomeStudio;   // Per evitare join nelle query
}