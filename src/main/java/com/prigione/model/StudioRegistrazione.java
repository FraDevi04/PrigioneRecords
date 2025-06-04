package com.prigione.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "studi")
public class StudioRegistrazione {

    @Id
    private String id;

    private String nome;

    private String indirizzo;

    private Double mediaRecensioni = 0.0;

    private Integer numeroRecensioni = 0;

    public void aggiornaMediaRecensioni(Integer nuovaValutazione) {
        double totale = mediaRecensioni * numeroRecensioni + nuovaValutazione;
        numeroRecensioni++;
        mediaRecensioni = totale / numeroRecensioni;
    }
}