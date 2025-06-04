package com.prigione.dto;

import lombok.Data;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
public class PrenotazioneRequest {

    @NotBlank(message = "L'ID dello studio è obbligatorio")
    private String studioId;

    @NotNull(message = "La data è obbligatoria")
    @FutureOrPresent(message = "La data deve essere presente o futura")
    private LocalDate data;

    private String note;
}