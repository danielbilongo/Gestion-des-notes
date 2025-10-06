package com.groupe.gestion_.de_.notes.services.ServiceImplementation;

import com.groupe.gestion_.de_.notes.exceptions.BadRequestException;
import com.groupe.gestion_.de_.notes.exceptions.ResourceNotFoundException;
import com.groupe.gestion_.de_.notes.model.Class;
import com.groupe.gestion_.de_.notes.model.Teacher;
import com.groupe.gestion_.de_.notes.model.TeacherClass;
import com.groupe.gestion_.de_.notes.dto.TeacherClassRequest;
import com.groupe.gestion_.de_.notes.dto.ClassResponse;
import com.groupe.gestion_.de_.notes.dto.TeacherClassResponse;
import com.groupe.gestion_.de_.notes.dto.TeacherResponse;
import com.groupe.gestion_.de_.notes.repository.ClassRepository;
import com.groupe.gestion_.de_.notes.repository.TeacherClassRepository;
import com.groupe.gestion_.de_.notes.repository.TeacherRepository;
import com.groupe.gestion_.de_.notes.services.ServiceInterface.TeacherClassService;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeacherClassServiceImpl implements TeacherClassService {

    private final TeacherClassRepository teacherClassRepository;
    private final TeacherRepository teacherRepository;
    private final ClassRepository classRepository;

    /**
     * Assigns a teacher to a class.
     *
     * @param request The DTO containing the teacher and class IDs.
     * @return The response DTO for the new assignment.
     * @throws ResourceNotFoundException if the teacher or class does not exist.
     * @throws BadRequestException if the assignment already exists.
     */
    @Override
    @Transactional
    public TeacherClassResponse assignTeacherToClass(TeacherClassRequest request) {
        if (teacherClassRepository.existsByTeacher_TeacherIdNumAndClassEntity_Id(request.getTeacherIdNum(), request.getClassId())) {
            throw new BadRequestException("Teacher with IdNum " + request.getTeacherIdNum() + " is already assigned to class with ID " + request.getClassId());
        }

        Teacher teacher = (Teacher) teacherRepository.findByTeacherIdNum(request.getTeacherIdNum())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with IdNum: " + request.getTeacherIdNum()));
        Class classEntity = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with ID: " + request.getClassId()));

        TeacherClass teacherClass = TeacherClass.builder()
                .teacher(teacher)
                .classEntity(classEntity)
                .build();

        TeacherClass savedAssignment = teacherClassRepository.save(teacherClass);
        return mapTeacherClassToResponse(savedAssignment);
    }

    /**
     * Retrieves all classes assigned to a specific teacher.
     *
     * @param teacherIdNum The ID of the teacher.
     * @return A list of assignments.
     */
    @Override
    @Transactional(readOnly = true)
    public List<TeacherClassResponse> getTeacherClassesByTeacherIdNum(String teacherIdNum) {
        if (!teacherRepository.existsByTeacherIdNum(teacherIdNum)) {
            throw new ResourceNotFoundException("Teacher not found with ID: " + teacherIdNum);
        }
        return teacherClassRepository.findByTeacher_TeacherIdNum(teacherIdNum).stream()
                .map(this::mapTeacherClassToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves all teachers assigned to a specific class.
     *
     * @param classId The ID of the class.
     * @return A list of assignments.
     */
    @Override
    @Transactional(readOnly = true)
    public List<TeacherClassResponse> getTeachersByClassId(Long classId) {
        if (!classRepository.existsById(classId)) {
            throw new ResourceNotFoundException("Class not found with ID: " + classId);
        }
        return teacherClassRepository.findByClassEntity_Id(classId).stream()
                .map(this::mapTeacherClassToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Retrieves all teacher-class assignments.
     *
     * @return A list of all assignments.
     */
    @Override
    @Transactional(readOnly = true)
    public List<TeacherClassResponse> getAllTeacherClassAssignments() {
        return teacherClassRepository.findAll().stream()
                .map(this::mapTeacherClassToResponse)
                .collect(Collectors.toList());
    }

    /**
     * Updates a teacher-class assignment.
     *
     * @param id The ID of the assignment to update.
     * @param request The new assignment data.
     * @return The updated assignment response.
     * @throws ResourceNotFoundException if the assignment, teacher, or class is not found.
     * @throws BadRequestException if the new assignment already exists.
     */
    @Override
    @Transactional
    public TeacherClassResponse updateTeacherClassAssignment(Long id, TeacherClassRequest request) {
        // Find existing assignment
        TeacherClass existingAssignment = teacherClassRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Teacher-Class assignment not found with ID: " + id));

        // Validate teacher and class exist
        Teacher teacher = teacherRepository.findByTeacherIdNum(request.getTeacherIdNum())
                .orElseThrow(() -> new ResourceNotFoundException("Teacher not found with ID: " + request.getTeacherIdNum()));
        Class classEntity = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with ID: " + request.getClassId()));

        // Check if the new assignment already exists (excluding current assignment)
        Optional<TeacherClass> duplicateAssignment = teacherClassRepository
                .findByTeacher_TeacherIdNumAndClassEntity_Id(request.getTeacherIdNum(), request.getClassId());
        
        if (duplicateAssignment.isPresent() && !duplicateAssignment.get().getId().equals(id)) {
            throw new BadRequestException("Teacher " + request.getTeacherIdNum() + " is already assigned to class " + request.getClassId());
        }

        // Update the assignment
        existingAssignment.setTeacher(teacher);
        existingAssignment.setClassEntity(classEntity);

        TeacherClass savedAssignment = teacherClassRepository.save(existingAssignment);
        return mapTeacherClassToResponse(savedAssignment);
    }

    /**
     * Deletes a teacher-class assignment by ID.
     *
     * @param id The ID of the assignment to delete.
     * @throws ResourceNotFoundException if the assignment is not found.
     */
    @Override
    @Transactional
    public void deleteTeacherClassAssignment(Long id) {
        if (!teacherClassRepository.existsById(id)) {
            throw new ResourceNotFoundException("Teacher-Class assignment not found with ID: " + id);
        }
        teacherClassRepository.deleteById(id);
    }

    /**
     * Removes a teacher's assignment from a class.
     *
     * @param teacherIdNum The ID of the teacher.
     * @param classId The ID of the class.
     * @throws ResourceNotFoundException if the assignment does not exist.
     */
    @Override
    @Transactional
    public void unassignTeacherFromClass(String teacherIdNum, Long classId) {
        TeacherClass assignment = teacherClassRepository.findByTeacher_TeacherIdNumAndClassEntity_Id(teacherIdNum, classId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found for teacher " + teacherIdNum + " and class " + classId));
        teacherClassRepository.delete(assignment);
    }

    // --- Helper Methods ---

    private TeacherClassResponse mapTeacherClassToResponse(TeacherClass teacherClass) {
        TeacherResponse teacherResponse = new TeacherResponse(
                teacherClass.getTeacher().getId(),
                teacherClass.getTeacher().getUsername(),
                teacherClass.getTeacher().getFirstname(),
                teacherClass.getTeacher().getLastname(),
                teacherClass.getTeacher().getEmail(),
                teacherClass.getTeacher().getRole(),
                teacherClass.getTeacher().getTeacherIdNum()
        );

        ClassResponse classResponse = ClassResponse.builder()
                .id(teacherClass.getClassEntity().getId())
                .name(teacherClass.getClassEntity().getName())
                .academicYear(teacherClass.getClassEntity().getAcademicYear())
                .build();

        return TeacherClassResponse.builder()
                .id(teacherClass.getId())
                .teacher(teacherResponse)
                .classEntity(classResponse)
                .build();
    }
}
