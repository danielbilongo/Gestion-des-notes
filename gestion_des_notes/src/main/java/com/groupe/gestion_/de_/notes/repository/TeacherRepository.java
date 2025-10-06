package com.groupe.gestion_.de_.notes.repository;

import com.groupe.gestion_.de_.notes.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeacherRepository extends JpaRepository<Teacher, Long> {
    Optional<Teacher> findByTeacherIdNum(String teacherIdNum);
    boolean existsByTeacherIdNum(String teacherIdNum);
    
    @Query("SELECT MAX(t.teacherIdNum) FROM Teacher t WHERE t.teacherIdNum LIKE 'T%'")
    String findMaxTeacherIdNum();
}
