package com.prigione.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "studi")
@CompoundIndexes({
    @CompoundIndex(name = "nome_indirizzo_idx", def = "{nome: 1, indirizzo: 1}", unique = true),
    @CompoundIndex(name = "media_recensioni_idx", def = "{mediaRecensioni: -1, numeroRecensioni: -1}")
})
public class StudioRegistrazione {

    @Id
    private String id;

    @Field("nome")
    @Indexed
    private String nome;

    @Field("indirizzo")
    @Indexed
    private String indirizzo;

    @Field("mediaRecensioni")
    private Double mediaRecensioni = 0.0;

    @Field("numeroRecensioni")
    private Integer numeroRecensioni = 0;

    public void aggiornaMediaRecensioni(Integer nuovaValutazione) {
        double totale = mediaRecensioni * numeroRecensioni + nuovaValutazione;
        numeroRecensioni++;
        mediaRecensioni = totale / numeroRecensioni;
    }
}