package com.groupe.gestion_.de_.notes.services.ServiceImplementation;

import com.groupe.gestion_.de_.notes.exceptions.BadRequestException;
import com.groupe.gestion_.de_.notes.exceptions.ResourceNotFoundException;
import com.groupe.gestion_.de_.notes.model.Enrollment;
import com.groupe.gestion_.de_.notes.model.Student;
import com.groupe.gestion_.de_.notes.model.Class; // Renamed to avoid keyword conflict
import com.groupe.gestion_.de_.notes.model.Subject;
import com.groupe.gestion_.de_.notes.dto.EnrollmentRequest;
import com.groupe.gestion_.de_.notes.dto.EnrollmentResponse;
import com.groupe.gestion_.de_.notes.dto.StudentResponse;
import com.groupe.gestion_.de_.notes.dto.ClassResponse;
import com.groupe.gestion_.de_.notes.dto.SubjectResponse;
import com.groupe.gestion_.de_.notes.repository.EnrollmentRepository;
import com.groupe.gestion_.de_.notes.repository.StudentRepository;
import com.groupe.gestion_.de_.notes.repository.ClassRepository;
import com.groupe.gestion_.de_.notes.repository.SubjectRepository;
import com.groupe.gestion_.de_.notes.services.ServiceInterface.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final ClassRepository classRepository;
    private final SubjectRepository subjectRepository;

    @Override
    @Transactional
    public EnrollmentResponse createEnrollment(EnrollmentRequest request) {
        if (enrollmentRepository.existsByStudent_StudentIdNumAndClassEntity_IdAndSubject_SubjectCode(
                request.getStudentIdNum(), request.getClassId(), request.getSubjectCode())) {
            throw new BadRequestException("Student is already enrolled in this subject for this class.");
        }

        Student student = studentRepository.findByStudentIdNum(request.getStudentIdNum())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + request.getStudentIdNum()));
        Class classEntity = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with ID: " + request.getClassId()));
        Subject subject = subjectRepository.findBySubjectCode(request.getSubjectCode())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with ID: " + request.getSubjectCode()));

        // Créer l'inscription avec les valeurs par défaut
        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .classEntity(classEntity)
                .subject(subject)
                .enrollmentDate(LocalDate.now()) // Date actuelle
                .semester("S1") // Semestre par défaut
                .academicYear(classEntity.getAcademicYear()) // Année de la classe
                .build();
        
        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);
        return mapToResponse(savedEnrollment);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<EnrollmentResponse> getEnrollmentById(Long id) {
        return enrollmentRepository.findById(id).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getAllEnrollments() {
        return enrollmentRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getEnrollmentsByStudentIdNum(String studentIdNum) {
        if (!studentRepository.existsByStudentIdNum(studentIdNum)) {
            throw new ResourceNotFoundException("Student not found with ID: " + studentIdNum);
        }
        return enrollmentRepository.findByStudentStudentIdNum(studentIdNum).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getEnrollmentsByClassId(Long classId) {
        if (!classRepository.existsById(classId)) {
            throw new ResourceNotFoundException("Class not found with ID: " + classId);
        }
        return enrollmentRepository.findByClassEntity_Id(classId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<EnrollmentResponse> getEnrollmentsByStudentIdNumAndClassEntity_Id(String studentIdNum, Long classId) {
        if (!studentRepository.existsByStudentIdNum(studentIdNum)) {
            throw new ResourceNotFoundException("Student not found with ID: " + studentIdNum);
        }
        if (!classRepository.existsById(classId)) {
            throw new ResourceNotFoundException("Class not found with ID: " + classId);
        }
        return enrollmentRepository.findByStudentStudentIdNumAndClassEntity_Id(studentIdNum, classId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public EnrollmentResponse updateEnrollment(Long id, EnrollmentRequest request) {
        // Vérifier que l'inscription existe
        Enrollment existingEnrollment = enrollmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found with ID: " + id));

        // Vérifier que les nouvelles entités existent
        Student student = studentRepository.findByStudentIdNum(request.getStudentIdNum())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + request.getStudentIdNum()));
        Class classEntity = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with ID: " + request.getClassId()));
        Subject subject = subjectRepository.findBySubjectCode(request.getSubjectCode())
                .orElseThrow(() -> new ResourceNotFoundException("Subject not found with code: " + request.getSubjectCode()));

        // Vérifier qu'il n'y a pas de doublon (sauf pour l'inscription actuelle)
        // Si la combinaison existe ET que ce n'est pas la même inscription qu'on modifie
        boolean isDuplicate = enrollmentRepository.existsByStudent_StudentIdNumAndClassEntity_IdAndSubject_SubjectCode(
                request.getStudentIdNum(), request.getClassId(), request.getSubjectCode());
        
        boolean isSameEnrollment = existingEnrollment.getStudent().getStudentIdNum().equals(request.getStudentIdNum()) &&
                existingEnrollment.getClassEntity().getId().equals(request.getClassId()) &&
                existingEnrollment.getSubject().getSubjectCode().equals(request.getSubjectCode());
        
        if (isDuplicate && !isSameEnrollment) {
            throw new BadRequestException("Student is already enrolled in this subject for this class.");
        }

        // Mettre à jour l'inscription
        existingEnrollment.setStudent(student);
        existingEnrollment.setClassEntity(classEntity);
        existingEnrollment.setSubject(subject);
        // Conserver la date d'inscription originale, mais mettre à jour l'année académique si la classe change
        existingEnrollment.setAcademicYear(classEntity.getAcademicYear());

        Enrollment updatedEnrollment = enrollmentRepository.save(existingEnrollment);
        return mapToResponse(updatedEnrollment);
    }

    @Override
    @Transactional
    public void deleteEnrollment(Long id) {
        if (!enrollmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Enrollment not found with ID: " + id);
        }
        enrollmentRepository.deleteById(id);
    }

    private EnrollmentResponse mapToResponse(Enrollment enrollment) {
        StudentResponse studentResponse = new StudentResponse(
                enrollment.getStudent().getId(),
                enrollment.getStudent().getUsername(),
                enrollment.getStudent().getFirstname(),
                enrollment.getStudent().getLastname(),
                enrollment.getStudent().getEmail(),
                enrollment.getStudent().getRole(),
                enrollment.getStudent().getStudentIdNum()
        );

        ClassResponse classResponse = new ClassResponse(
                enrollment.getClassEntity().getId(),
                enrollment.getClassEntity().getName(),
                enrollment.getClassEntity().getAcademicYear()
        );

        SubjectResponse subjectResponse = SubjectResponse.builder()
                .id(enrollment.getSubject().getId())
                .subjectCode(enrollment.getSubject().getSubjectCode())
                .name(enrollment.getSubject().getName())
                .coefficient(enrollment.getSubject().getCoefficient())
                .description(enrollment.getSubject().getDescription())
                .semester(enrollment.getSubject().getSemester())
                .build();

        return EnrollmentResponse.builder()
                .id(enrollment.getId())
                .enrollmentDate(enrollment.getEnrollmentDate())
                .semester(enrollment.getSemester())
                .academicYear(enrollment.getAcademicYear())
                .student(studentResponse)
                .subject(subjectResponse)
                .classEntity(classResponse)
                .build();
    }
}
