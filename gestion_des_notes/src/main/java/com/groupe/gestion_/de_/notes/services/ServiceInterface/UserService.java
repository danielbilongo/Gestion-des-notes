package com.groupe.gestion_.de_.notes.services.ServiceInterface;

import com.groupe.gestion_.de_.notes.dto.*;

import jakarta.transaction.Transactional;
import lombok.experimental.SuperBuilder;
import java.util.List;
import java.util.Optional;


public interface UserService {
    public StudentResponse registerStudent(StudentRequest studentRequest);
    public TeacherResponse registerTeacher(TeacherRequest teacherRequest);
    public Optional<UserResponse> findById(Long id);
    public List<UserResponse> getAllUsers();
    public List<StudentResponse> getAllStudents();
    public void deleteUserById(Long id);
    public Optional<UserResponse> findByUsername(String username);
    public Optional<UserResponse> findByEmail(String email);
    public List<TeacherResponse> getAllTeachers();
    public List<StudentResponse> getStudentsBySubject(String subjectCode);
    @Transactional
    UserResponse updateUser(Long id, UserRequest request);
}