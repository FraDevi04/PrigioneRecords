package com.prigione.dto;

import lombok.Data;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class StudioRequest {

    @NotBlank(message = "Il nome dello studio è obbligatorio")
    @Size(min = 2, max = 100, message = "Il nome deve essere compreso tra 2 e 100 caratteri")
    private String nome;

    @NotBlank(message = "L'indirizzo dello studio è obbligatorio")
    @Size(min = 5, max = 200, message = "L'indirizzo deve essere compreso tra 5 e 200 caratteri")
    private String indirizzo;
}