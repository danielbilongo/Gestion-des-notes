package com.groupe.gestion_.de_.notes.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Entity
@Table(name = "subjects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String subjectCode;

    @Column(nullable = false)
    private String name;

    private Double coefficient;

    private String description;

    @Column(nullable = true) // Nullable pour compatibilité avec données existantes
    private String semester; // S1 ou S2

    // Relationships
    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL)
    private List<Enrollment> enrollments;

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL)
    private List<Grade> grades;

    @OneToMany(mappedBy = "subject", cascade = CascadeType.ALL)
    private List<ClassSubject> classSubjects; // Many-to-many relationship with Class via ClassSubject
}