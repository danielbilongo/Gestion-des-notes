package com.groupe.gestion_.de_.notes.Config;

import com.groupe.gestion_.de_.notes.dto.StudentRequest;
import com.groupe.gestion_.de_.notes.dto.SubjectRequest;
import com.groupe.gestion_.de_.notes.dto.TeacherRequest;
import com.groupe.gestion_.de_.notes.dto.ClassRequest;
import com.groupe.gestion_.de_.notes.services.ServiceInterface.UserService;
import com.groupe.gestion_.de_.notes.services.ServiceInterface.SubjectService;
import com.groupe.gestion_.de_.notes.services.ServiceInterface.ClassService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * Initialisation automatique des données au démarrage
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserService userService;
    private final SubjectService subjectService;
    private final ClassService classService;

    @Override
    public void run(String... args) throws Exception {
        log.info("🚀 Initialisation des données par défaut...");
        
        try {
            // 1. Créer les matières
            log.info("📚 Début création des matières...");
            initializeSubjects();
            log.info("✅ Matières créées avec succès");
            
            // 2. Créer les classes
            log.info("🏫 Début création des classes...");
            initializeClasses();
            log.info("✅ Classes créées avec succès");
            
            // 3. Créer les enseignants
            log.info("👨‍🏫 Début création des enseignants...");
            initializeTeachers();
            log.info("✅ Enseignants créés avec succès");
            
            // 4. Créer les étudiants
            log.info("👨‍🎓 Début création des étudiants...");
            initializeStudents();
            log.info("✅ Étudiants créés avec succès");
            
            log.info("🎉 Initialisation des données terminée avec succès!");
            
        } catch (Exception e) {
            log.error("❌ ERREUR lors de l'initialisation: {}", e.getMessage(), e);
            throw e; // Re-lancer l'exception pour voir l'erreur complète
        }
    }

    private void initializeSubjects() {
        log.info("📚 Création des matières...");
        
        SubjectRequest[] subjects = {
            createSubject("MATH101", "Mathématiques", 3, "Mathématiques niveau 1"),
            createSubject("INFO101", "Informatique", 3, "Introduction à l'informatique"),
            createSubject("PHYS101", "Physique", 2, "Physique générale"),
            createSubject("ALGO101", "Algorithmique", 2, "Algorithmes et structures de données"),
            createSubject("BDD101", "Base de Données", 2, "Introduction aux bases de données")
        };

        for (SubjectRequest subject : subjects) {
            try {
                subjectService.addSubject(subject);
                log.info("✅ Matière créée: {}", subject.getName());
            } catch (Exception e) {
                log.debug("Matière {} existe déjà", subject.getName());
            }
        }
    }

    private void initializeClasses() {
        log.info("🏫 Création des classes...");
        
        ClassRequest[] classes = {
            createClass("L1 Informatique", "2024-2025", "Licence 1 Informatique"),
            createClass("L2 Informatique", "2024-2025", "Licence 2 Informatique"),
            createClass("L3 Informatique", "2024-2025", "Licence 3 Informatique")
        };

        for (ClassRequest classReq : classes) {
            try {
                classService.createClass(classReq);
                log.info("✅ Classe créée: {}", classReq.getName());
            } catch (Exception e) {
                log.debug("Classe {} existe déjà", classReq.getName());
            }
        }
    }

    private void initializeTeachers() {
        log.info("👨‍🏫 Création des enseignants...");
        
        TeacherRequest[] teachers = {
            createTeacher("prof_math", "prof123", "Landry", "Abéna", "landry.abena@ecole.fr", "T0001"),
            createTeacher("prof_info", "prof123", "Justine", "Éyenga", "justine.eyenga@ecole.fr", "T0002")
        };

        for (TeacherRequest teacher : teachers) {
            try {
                userService.registerTeacher(teacher);
                log.info("✅ Enseignant créé: {} {}", teacher.getFirstname(), teacher.getLastname());
            } catch (Exception e) {
                log.warn("⚠️ Enseignant {} existe déjà ou erreur: {}", teacher.getUsername(), e.getMessage());
            }
        }
    }

    private void initializeStudents() {
        log.info("👨‍🎓 Création des étudiants...");
        
        StudentRequest[] students = {
            createStudent("etudiant1", "etud123", "Patrick", "Onambélé", "patrick.onambelé@ecole.fr", "S0001"),
            createStudent("etudiant2", "etud123", "Fabrice", "Fokou", "fabrice.fokou@ecole.fr", "S0002"),
            createStudent("etudiant3", "etud123", "Eric", "Messina", "eric.messina@ecole.fr", "S0003")
        };

        for (StudentRequest student : students) {
            try {
                userService.registerStudent(student);
                log.info("✅ Étudiant créé: {} {}", student.getFirstname(), student.getLastname());
            } catch (Exception e) {
                log.warn("⚠️ Étudiant {} existe déjà ou erreur: {}", student.getUsername(), e.getMessage());
            }
        }
    }

    // Méthodes utilitaires
    private SubjectRequest createSubject(String code, String name, double coefficient, String description) {
        SubjectRequest subject = new SubjectRequest();
        subject.setSubjectCode(code);
        subject.setName(name);
        subject.setCoefficient(coefficient);
        subject.setDescription(description);
        return subject;
    }

    private ClassRequest createClass(String name, String academicYear, String description) {
        ClassRequest classReq = new ClassRequest();
        classReq.setName(name);
        classReq.setAcademicYear(academicYear);
        classReq.setDescription(description);
        return classReq;
    }

    private TeacherRequest createTeacher(String username, String password, String firstname, 
                                       String lastname, String email, String teacherIdNum) {
        TeacherRequest teacher = new TeacherRequest();
        teacher.setUsername(username);
        teacher.setPassword(password);
        teacher.setFirstname(firstname);
        teacher.setLastname(lastname);
        teacher.setEmail(email);
        teacher.setTeacherIdNum(teacherIdNum);
        return teacher;
    }

    private StudentRequest createStudent(String username, String password, String firstname, 
                                       String lastname, String email, String studentIdNum) {
        StudentRequest student = new StudentRequest();
        student.setUsername(username);
        student.setPassword(password);
        student.setFirstname(firstname);
        student.setLastname(lastname);
        student.setEmail(email);
        student.setStudentIdNum(studentIdNum);
        return student;
    }
}
