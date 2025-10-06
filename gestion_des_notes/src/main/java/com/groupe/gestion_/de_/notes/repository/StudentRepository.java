package com.groupe.gestion_.de_.notes.repository;

import com.groupe.gestion_.de_.notes.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByStudentIdNum(String studentIdNum);
    Boolean existsByStudentIdNum(String studentIdNum);
    
    @Query("SELECT MAX(s.studentIdNum) FROM Student s WHERE s.studentIdNum LIKE 'S%'")
    String findMaxStudentIdNum();
    
    @Query("SELECT DISTINCT s FROM Student s " +
           "JOIN s.enrollments e " +
           "JOIN e.subject sub " +
           "WHERE sub.subjectCode = :subjectCode")
    List<Student> findStudentsBySubjectCode(@Param("subjectCode") String subjectCode);
}
