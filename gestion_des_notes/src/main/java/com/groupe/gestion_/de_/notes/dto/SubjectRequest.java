package com.groupe.gestion_.de_.notes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Pattern;
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
public class SubjectRequest {
    @NotBlank(message = "Le code de la matière est obligatoire")
    private String subjectCode;
    
    @NotBlank(message = "Le nom de la matière est obligatoire")
    private String name;
    
    @NotNull(message = "Le coefficient est obligatoire")
    @Min(value = 0, message = "Le coefficient doit être positif")
    private Double coefficient;
    
    private String description; // Optionnel
    
    @Pattern(regexp = "^(S1|S2)$", message = "Le semestre doit être S1 ou S2")
    private String semester; // Optionnel, S1 ou S2

}
