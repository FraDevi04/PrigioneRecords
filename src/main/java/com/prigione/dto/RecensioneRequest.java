package com.prigione.dto;

import lombok.Data;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class RecensioneRequest {

    @NotBlank(message = "L'ID dello studio è obbligatorio")
    private String studioId;

    @Min(value = 1, message = "La valutazione deve essere compresa tra 1 e 5")
    @Max(value = 5, message = "La valutazione deve essere compresa tra 1 e 5")
    private Integer valutazione;

    @Size(max = 500, message = "Il commento non può superare i 500 caratteri")
    private String commento;
}