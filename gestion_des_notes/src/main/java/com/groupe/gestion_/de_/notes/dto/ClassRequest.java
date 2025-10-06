package com.groupe.gestion_.de_.notes.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClassRequest {
    @NotBlank
    private String academicYear;
    @NotBlank
    private String name;
    private String description;
}
