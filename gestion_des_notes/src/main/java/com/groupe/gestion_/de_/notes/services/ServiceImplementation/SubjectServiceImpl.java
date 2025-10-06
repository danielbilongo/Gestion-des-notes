package com.groupe.gestion_.de_.notes.services.ServiceImplementation;

import com.groupe.gestion_.de_.notes.exceptions.BadRequestException;
import com.groupe.gestion_.de_.notes.exceptions.ResourceNotFoundException;
import com.groupe.gestion_.de_.notes.model.Subject;
import com.groupe.gestion_.de_.notes.dto.SubjectRequest;
import com.groupe.gestion_.de_.notes.dto.SubjectResponse;
import com.groupe.gestion_.de_.notes.repository.SubjectRepository;
import com.groupe.gestion_.de_.notes.services.ServiceInterface.SubjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubjectServiceImpl implements SubjectService {

    private final SubjectRepository subjectRepository;

    /**
     * Creates a new subject.
     * Validates that the subject code and name are unique.
     * @param request The DTO containing subject details.
     * @return The created SubjectResponse DTO.
     * @throws BadRequestException if subject code or name already exists.*/

    @Override
    @Transactional
    public SubjectResponse addSubject(SubjectRequest request) {
        log.info("Création d'une nouvelle matière: code={}, nom={}", request.getSubjectCode(), request.getName());
        
        // Validation de l'unicité du code
        if (subjectRepository.existsBySubjectCode(request.getSubjectCode())) {
            log.warn("Tentative de création avec un code existant: {}", request.getSubjectCode());
            throw new BadRequestException("Une matière avec le code '" + request.getSubjectCode() + "' existe déjà.");
        }
        
        // Validation de l'unicité du nom
        if (subjectRepository.existsByName(request.getName())) {
            log.warn("Tentative de création avec un nom existant: {}", request.getName());
            throw new BadRequestException("Une matière avec le nom '" + request.getName() + "' existe déjà.");
        }

        Subject subject = Subject.builder()
                .subjectCode(request.getSubjectCode())
                .name(request.getName())
                .coefficient(request.getCoefficient())
                .description(request.getDescription())
                .semester(request.getSemester() != null && !request.getSemester().isEmpty() ? request.getSemester() : "S1") // Valeur par défaut S1
                .build();

        log.debug("Sauvegarde de la matière: {}", subject);
        Subject savedSubject = subjectRepository.save(subject);
        log.info("Matière créée avec succès: ID={}, code={}", savedSubject.getId(), savedSubject.getSubjectCode());
        
        return mapSubjectToResponse(savedSubject);
    }

    /**
     * Retrieves a subject by its ID.
     * @param SubjectCode The ID of the subject.*/
     // @return An Optional containing the SubjectResponse DTO if found, empty otherwise.
    @Override
    @Transactional(readOnly = true)
    public Optional<SubjectResponse> findBySubjectCode(String SubjectCode) {
        return subjectRepository.findBySubjectCode(SubjectCode)
                .map(this::mapSubjectToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<SubjectResponse> findById(Long id) {
        return subjectRepository.findById(id)
                .map(this::mapSubjectToResponse);
    }


     // Retrieves all subject records.
     // @return A list of SubjectResponse DTOs.

    @Override
    @Transactional(readOnly = true)
    public List<SubjectResponse> getAllSubjects() {
        return subjectRepository.findAll().stream()
                .map(this::mapSubjectToResponse)
                .collect(Collectors.toList());
    }


    /**
     * Retrieves a subject by its unique name.
     * @param name The subject name.*/
     // @return An Optional containing the SubjectResponse DTO if found, empty otherwise.

    @Override
    @Transactional(readOnly = true)
    public Optional<SubjectResponse> findBySubject_Name(String name) {
        return subjectRepository.findByName(name)
                .map(this::mapSubjectToResponse);
    }


     //Updates an existing subject.
     // Validates that the updated subject code and name remain unique (excluding the current subject itself).
     /** @param subjectCode The code of the subject to update.
      @param request The DTO containing updated subject details.*/
     //@return The updated SubjectResponse DTO.
     //@throws ResourceNotFoundException if the subject is not found.
     //@throws BadRequestException if the updated subject code or name conflicts with another subject.

    @Override
    @Transactional
    public SubjectResponse updateSubject(String subjectCode, SubjectRequest request) {
        log.info("Modification de la matière: code={}", subjectCode);
        
        Subject existingSubject = subjectRepository.findBySubjectCode(subjectCode)
                .orElseThrow(() -> {
                    log.error("Matière non trouvée avec le code: {}", subjectCode);
                    return new ResourceNotFoundException("Matière non trouvée avec le code: " + subjectCode);
                });

        // Validation de l'unicité du code (en excluant la matière actuelle)
        if (!existingSubject.getSubjectCode().equals(request.getSubjectCode()) &&
                subjectRepository.existsBySubjectCode(request.getSubjectCode())) {
            log.warn("Tentative de modification avec un code existant: {}", request.getSubjectCode());
            throw new BadRequestException("Une matière avec le code '" + request.getSubjectCode() + "' existe déjà.");
        }

        // Validation de l'unicité du nom (en excluant la matière actuelle)
        if (!existingSubject.getName().equals(request.getName()) &&
                subjectRepository.existsByName(request.getName())) {
            log.warn("Tentative de modification avec un nom existant: {}", request.getName());
            throw new BadRequestException("Une matière avec le nom '" + request.getName() + "' existe déjà.");
        }

        // Mise à jour des champs
        existingSubject.setSubjectCode(request.getSubjectCode());
        existingSubject.setName(request.getName());
        existingSubject.setCoefficient(request.getCoefficient());
        existingSubject.setDescription(request.getDescription());
        if (request.getSemester() != null && !request.getSemester().isEmpty()) {
            existingSubject.setSemester(request.getSemester());
        }

        Subject updatedSubject = subjectRepository.save(existingSubject);
        log.info("Matière modifiée avec succès: ID={}, code={}", updatedSubject.getId(), updatedSubject.getSubjectCode());
        
        return mapSubjectToResponse(updatedSubject);
    }

    /**
     * Met à jour une matière par son ID
     */
    @Override
    @Transactional
    public SubjectResponse updateSubject(Long id, SubjectRequest request) {
        log.info("Modification de la matière: ID={}", id);
        
        Subject existingSubject = subjectRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Matière non trouvée avec l'ID: {}", id);
                    return new ResourceNotFoundException("Matière non trouvée avec l'ID: " + id);
                });

        // Validation de l'unicité du code (en excluant la matière actuelle)
        if (!existingSubject.getSubjectCode().equals(request.getSubjectCode()) &&
                subjectRepository.existsBySubjectCode(request.getSubjectCode())) {
            log.warn("Tentative de modification avec un code existant: {}", request.getSubjectCode());
            throw new BadRequestException("Une matière avec le code '" + request.getSubjectCode() + "' existe déjà.");
        }

        // Validation de l'unicité du nom (en excluant la matière actuelle)
        if (!existingSubject.getName().equals(request.getName()) &&
                subjectRepository.existsByName(request.getName())) {
            log.warn("Tentative de modification avec un nom existant: {}", request.getName());
            throw new BadRequestException("Une matière avec le nom '" + request.getName() + "' existe déjà.");
        }

        // Mise à jour des champs
        existingSubject.setSubjectCode(request.getSubjectCode());
        existingSubject.setName(request.getName());
        existingSubject.setCoefficient(request.getCoefficient());
        existingSubject.setDescription(request.getDescription());
        if (request.getSemester() != null && !request.getSemester().isEmpty()) {
            existingSubject.setSemester(request.getSemester());
        }

        Subject updatedSubject = subjectRepository.save(existingSubject);
        log.info("Matière modifiée avec succès: ID={}, code={}", updatedSubject.getId(), updatedSubject.getSubjectCode());
        
        return mapSubjectToResponse(updatedSubject);
    }


     /** Deletes a subject by its ID.*/
     //@param id The ID of the subject to delete.
     //@throws ResourceNotFoundException if the subject is not found.

    @Override
    @Transactional
    public void deleteSubject(Long id) {
        if (!subjectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Subject not found with ID: " + id);
        }
        // TODO: Add check here if subject has associated grades or class_subjects before deleting
        // If it does, consider throwing a BadRequestException or handling cascade deletion.
        subjectRepository.deleteById(id);
    }

    // --- Helper Methods ---
     //Maps a Subject entity to a SubjectResponse DTO.
     //@param subject The Subject entity to map.
     //@return The SubjectResponse DTO.

    private SubjectResponse mapSubjectToResponse(Subject subject) {
        return SubjectResponse.builder()
                .id(subject.getId())
                .subjectCode(subject.getSubjectCode())
                .name(subject.getName())
                .coefficient(subject.getCoefficient())
                .description(subject.getDescription())
                .semester(subject.getSemester())
                .build();
    }

    @Override
    @Transactional
    public void fixSemesters() {
        List<Subject> subjects = subjectRepository.findAll();
        
        System.out.println("=== DÉBUT CORRECTION SEMESTRES ===");
        System.out.println("Nombre de matières trouvées: " + subjects.size());
        
        for (Subject subject : subjects) {
            String code = subject.getSubjectCode();
            String currentSemester = subject.getSemester();
            
            System.out.println("Matière: " + code + " | Semestre actuel: " + currentSemester);
            
            if (currentSemester == null || currentSemester.trim().isEmpty()) {
                String newSemester = null;
                
                if (code != null) {
                    // Logique basée sur les codes réels trouvés dans les notes
                    if (code.equals("MATH101") || code.equals("PHYS101") || code.equals("INFO101") || 
                        code.equals("FRAN101") || code.equals("ANG101") || code.contains("101")) {
                        newSemester = "S1";
                    } else if (code.equals("MATH102") || code.equals("PHYS102") || code.equals("INFO102") || 
                               code.equals("FRAN102") || code.equals("ANG102") || code.contains("102")) {
                        newSemester = "S2";
                    } else {
                        // Pour tous les autres codes, assigner selon le nom de la matière
                        String name = subject.getName();
                        if (name != null) {
                            if (name.toLowerCase().contains("math")) {
                                newSemester = "S1";
                            } else if (name.toLowerCase().contains("physique")) {
                                newSemester = "S1";
                            } else if (name.toLowerCase().contains("informatique")) {
                                newSemester = "S2";
                            } else {
                                newSemester = "S1"; // Par défaut
                            }
                        } else {
                            newSemester = "S1"; // Par défaut
                        }
                    }
                    
                    subject.setSemester(newSemester);
                    subjectRepository.save(subject);
                    System.out.println("✅ CORRIGÉ: " + code + " (" + subject.getName() + ") -> " + newSemester);
                }
            } else {
                System.out.println("⏭️ IGNORÉ: " + code + " (déjà défini: " + currentSemester + ")");
            }
        }
        
        System.out.println("=== FIN CORRECTION SEMESTRES ===");
    }
}
