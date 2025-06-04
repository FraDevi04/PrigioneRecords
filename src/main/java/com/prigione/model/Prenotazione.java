package com.prigione.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;

import java.time.LocalDate;

@Data
@Document(collection = "prenotazioni")
@CompoundIndexes({
    @CompoundIndex(name = "studio_data_idx", def = "{studioId: 1, data: 1}", unique = true),
    @CompoundIndex(name = "cantante_data_idx", def = "{cantanteId: 1, data: 1}", unique = true)
})
public class Prenotazione {

    @Id
    private String id;

    private String cantanteId;

    private String studioId;

    private LocalDate data;

    private String note;

    // Timestamp di creazione e modifica
    private LocalDate createdAt = LocalDate.now();
    private LocalDate updatedAt = LocalDate.now();
}