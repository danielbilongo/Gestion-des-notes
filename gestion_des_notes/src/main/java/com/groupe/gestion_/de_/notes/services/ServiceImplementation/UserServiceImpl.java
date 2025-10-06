package com.groupe.gestion_.de_.notes.services.ServiceImplementation;

import com.groupe.gestion_.de_.notes.dto.*;
import com.groupe.gestion_.de_.notes.model.*;
import com.groupe.gestion_.de_.notes.services.ServiceInterface.*;
import com.groupe.gestion_.de_.notes.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.NoSuchElementException;


@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final TeacherRepository teacherRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Génère le prochain ID étudiant disponible
     * Format: S0001, S0002, etc.
     */
    @Transactional(readOnly = true)
    private String generateNextStudentId() {
        // Utiliser une requête optimisée pour trouver le max
        String maxId = studentRepository.findMaxStudentIdNum();
        
        if (maxId == null || !maxId.startsWith("S")) {
            return "S0001";
        }
        
        try {
            int maxNumber = Integer.parseInt(maxId.substring(1));
            return String.format("S%04d", maxNumber + 1);
        } catch (NumberFormatException e) {
            log.warn("Format d'ID étudiant invalide: {}", maxId);
            return "S0001";
        }
    }
    
    /**
     * Génère le prochain ID enseignant disponible
     * Format: T0001, T0002, etc.
     */
    @Transactional(readOnly = true)
    private String generateNextTeacherId() {
        // Utiliser une requête optimisée pour trouver le max
        String maxId = teacherRepository.findMaxTeacherIdNum();
        
        if (maxId == null || !maxId.startsWith("T")) {
            return "T0001";
        }
        
        try {
            int maxNumber = Integer.parseInt(maxId.substring(1));
            return String.format("T%04d", maxNumber + 1);
        } catch (NumberFormatException e) {
            log.warn("Format d'ID enseignant invalide: {}", maxId);
            return "T0001";
        }
    }

    /**
     * Enregistre un nouvel étudiant avec génération automatique d'ID
     */
    @Override
    @Transactional
    public StudentResponse registerStudent(StudentRequest request) {
        log.info("Création d'un nouvel étudiant: {}", request.getUsername());
        
        // Validation des données uniques
        validateNewUserUniqueness(request.getUsername(), request.getEmail());
        
        // Génération automatique de l'ID étudiant
        String studentId = generateNextStudentId();
        log.debug("ID étudiant généré: {}", studentId);
        
        // Vérification de l'unicité de l'ID généré (sécurité supplémentaire)
        while (studentRepository.existsByStudentIdNum(studentId)) {
            log.warn("ID étudiant {} déjà existant, génération d'un nouveau", studentId);
            studentId = generateNextStudentId();
        }
        
        // Création de l'entité Student
        Student student = Student.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .role(Role.STUDENT)
                .studentIdNum(studentId)
                .build();
        
        // Sauvegarde
        Student savedStudent = studentRepository.save(student);
        log.info("Étudiant créé avec succès: {} (ID: {})", savedStudent.getUsername(), savedStudent.getStudentIdNum());
        
        return mapUserToStudentResponse(savedStudent);
    }
    
    /**
     * Enregistre un nouvel enseignant avec génération automatique d'ID
     */
    @Override
    @Transactional
    public TeacherResponse registerTeacher(TeacherRequest request) {
        log.info("Création d'un nouvel enseignant: {}", request.getUsername());
        
        // Validation des données uniques
        validateNewUserUniqueness(request.getUsername(), request.getEmail());
        
        // Génération automatique de l'ID enseignant
        String teacherId = generateNextTeacherId();
        log.debug("ID enseignant généré: {}", teacherId);
        
        // Vérification de l'unicité de l'ID généré (sécurité supplémentaire)
        while (teacherRepository.existsByTeacherIdNum(teacherId)) {
            log.warn("ID enseignant {} déjà existant, génération d'un nouveau", teacherId);
            teacherId = generateNextTeacherId();
        }
        
        // Création de l'entité Teacher
        Teacher teacher = Teacher.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .role(Role.TEACHER)
                .teacherIdNum(teacherId)
                .build();
        
        // Sauvegarde
        Teacher savedTeacher = teacherRepository.save(teacher);
        log.info("Enseignant créé avec succès: {} (ID: {})", savedTeacher.getUsername(), savedTeacher.getTeacherIdNum());
        
        return mapUserToTeacherResponse(savedTeacher);
    }


    /**
     * Valide l'unicité des données utilisateur
     */
    private void validateNewUserUniqueness(String username, String email) {
        log.debug("Validation de l'unicité pour: username={}, email={}", username, email);
        
        if (userRepository.findByUsername(username).isPresent()) {
            log.warn("Tentative de création avec un username déjà existant: {}", username);
            throw new IllegalArgumentException("Le nom d'utilisateur '" + username + "' existe déjà.");
        }
        
        if (userRepository.findByEmail(email).isPresent()) {
            log.warn("Tentative de création avec un email déjà existant: {}", email);
            throw new IllegalArgumentException("L'email '" + email + "' est déjà utilisé.");
        }
    }

    // Helper for mapping User entity to UserResponse DTO

    private StudentResponse mapUserToStudentResponse(Student student){
        return new StudentResponse(
                student.getId(),
                student.getUsername(),
                student.getFirstname(),
                student.getLastname(),
                student.getEmail(),
                student.getRole(),
                student.getStudentIdNum()
        );
    }

    private TeacherResponse mapUserToTeacherResponse(Teacher teacher) {
        return new TeacherResponse(
                teacher.getId(),
                teacher.getUsername(),
                teacher.getFirstname(),
                teacher.getLastname(),
                teacher.getEmail(),
                teacher.getRole(),
                teacher.getTeacherIdNum()
        );
    }
//-----------------------------------------------------------------------------------------------------


    @Transactional(readOnly = true) // Read-only for performance optimization
    public Optional <UserResponse> findById(Long id) {
        Optional<User> userOptional = userRepository.findById(id);
        if(userOptional.isPresent()){
            return userOptional.map(this::mapToResponse);
        }else{
            throw new NoSuchElementException("User not found with id: " + id);
        }
    }

    @Transactional(readOnly = true)
    @Override
    public Optional<UserResponse> findByUsername(String username) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if(userOptional.isPresent()){
            return userOptional.map(this::mapToResponse);
        }else {
            throw new NoSuchElementException(" No User found with Username: " + username);
        }
    }

    @Transactional(readOnly = true)
    @Override
    public Optional<UserResponse> findByEmail( String email){
        Optional<User> userOptional = userRepository.findByEmail(email);
        if(userOptional.isPresent()){
            return userOptional.map(this::mapToResponse);
        }else {
            throw new NoSuchElementException("No User found with the Email: " + email );
        }
    }

    @Transactional(readOnly = true)
    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public List<StudentResponse> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::mapToStudentResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public List<TeacherResponse> getAllTeachers() {
        return teacherRepository.findAll().stream()
                .map(this::mapUserToTeacherResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public List<StudentResponse> getStudentsBySubject(String subjectCode) {
        log.info("Récupération des étudiants inscrits à la matière: {}", subjectCode);
        
        // Récupérer les étudiants via les inscriptions (enrollments)
        return studentRepository.findStudentsBySubjectCode(subjectCode).stream()
                .map(this::mapToStudentResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public UserResponse updateUser(Long id, UserRequest request) {
        User concernedUser = userRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("User not found with ID: " + id));

        // Update fields only if provided in the request
        if (request.getUsername() != null && !request.getUsername().equals(concernedUser.getUsername())) {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new IllegalArgumentException("Username already taken: " + request.getUsername());
            }
            concernedUser.setUsername(request.getUsername());
        }
        if (request.getEmail() != null && !request.getEmail().equals(concernedUser.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new IllegalArgumentException("Email already in use: " + request.getEmail());
            }
            concernedUser.setEmail(request.getEmail());
        }
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            concernedUser.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        if (request.getFirstname() != null) {
            concernedUser.setFirstname(request.getFirstname());
        }
        if (request.getLastname() != null) {
            concernedUser.setLastname(request.getLastname());
        }

        User updatedUser = userRepository.save(concernedUser);
        return mapToResponse(updatedUser);
    }

    @Transactional
    @Override
    public void deleteUserById(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    // --- Helper method for mapping ---
    private UserResponse mapToResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getFirstname(),
                user.getLastname(),
                user.getEmail(),
                user.getRole()
                );
    }

    private StudentResponse mapToStudentResponse(Student student) {
        return new StudentResponse(
                student.getId(),
                student.getUsername(),
                student.getFirstname(),
                student.getLastname(),
                student.getEmail(),
                student.getRole(),
                student.getStudentIdNum()
        );
    }
}