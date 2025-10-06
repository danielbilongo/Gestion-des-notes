package com.groupe.gestion_.de_.notes.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class GradeResponse {
    private Long id;
    private Double value;
    private LocalDate date;
    private String comment;
    private String studentIdNum;
    private String firstname;
    private String lastname;
    private String subjectCode;
    private String subjectName;
    private String semester; // S1 ou S2
    private String recordedBy; // Optional, will be null if not set
}