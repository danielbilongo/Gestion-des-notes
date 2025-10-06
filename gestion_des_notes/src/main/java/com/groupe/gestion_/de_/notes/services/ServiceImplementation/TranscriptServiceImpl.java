package com.groupe.gestion_.de_.notes.services.ServiceImplementation;

import com.groupe.gestion_.de_.notes.exceptions.ResourceNotFoundException;
import com.groupe.gestion_.de_.notes.model.Student;
import com.groupe.gestion_.de_.notes.dto.GradeResponse;
import com.groupe.gestion_.de_.notes.repository.StudentRepository;
import com.groupe.gestion_.de_.notes.services.ServiceInterface.GradesService;
import com.groupe.gestion_.de_.notes.services.ServiceInterface.TranscriptService;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TranscriptServiceImpl implements TranscriptService {

    private final StudentRepository studentRepository;
    private final GradesService gradesService;

    @Override
    public byte[] generateTranscriptForStudent(String studentIdNum) throws IOException {
        Student student = studentRepository.findByStudentIdNum(studentIdNum)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with ID: " + studentIdNum));
        
        List<GradeResponse> grades = gradesService.findGradesByStudentIdNum(studentIdNum);
        Double overallAverage = gradesService.calculateStudentOverallAverageGrade(studentIdNum);

        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                // Header avec bandeau bleu
                contentStream.setNonStrokingColor(0.2f, 0.4f, 0.8f);
                contentStream.addRect(50, 750, 500, 50);
                contentStream.fill();
                
                contentStream.beginText();
                contentStream.setNonStrokingColor(Color.WHITE);
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 18);
                contentStream.newLineAtOffset(60, 770);
                contentStream.showText("UNIVERSITE - RELEVE DE NOTES OFFICIEL");
                contentStream.endText();

                // Informations personnelles
                contentStream.setNonStrokingColor(Color.BLACK);
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 14);
                contentStream.newLineAtOffset(50, 700);
                contentStream.showText("INFORMATIONS PERSONNELLES");
                contentStream.endText();

                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA, 12);
                contentStream.newLineAtOffset(50, 680);
                contentStream.showText("Nom: " + student.getLastname());
                contentStream.newLineAtOffset(0, -15);
                contentStream.showText("Prenom: " + student.getFirstname());
                contentStream.newLineAtOffset(0, -15);
                contentStream.showText("Numero etudiant: " + student.getStudentIdNum());
                contentStream.newLineAtOffset(0, -15);
                contentStream.showText("Date de generation: " + LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
                contentStream.endText();

                // Section Notes
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 14);
                contentStream.newLineAtOffset(50, 600);
                contentStream.showText("NOTES");
                contentStream.endText();

                float yPos = 580;
                contentStream.setFont(PDType1Font.HELVETICA, 10);

                // En-têtes
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 10);
                contentStream.newLineAtOffset(50, yPos);
                contentStream.showText("Matiere");
                contentStream.newLineAtOffset(150, 0);
                contentStream.showText("Semestre");
                contentStream.newLineAtOffset(80, 0);
                contentStream.showText("Note");
                contentStream.newLineAtOffset(80, 0);
                contentStream.showText("Date");
                contentStream.endText();
                yPos -= 20;

                // Notes
                for (GradeResponse grade : grades) {
                    contentStream.beginText();
                    contentStream.setFont(PDType1Font.HELVETICA, 9);
                    contentStream.newLineAtOffset(50, yPos);
                    contentStream.showText(grade.getSubjectName());
                    contentStream.newLineAtOffset(150, 0);
                    contentStream.showText(grade.getSemester() != null ? grade.getSemester() : "N/A");
                    contentStream.newLineAtOffset(80, 0);
                    contentStream.showText(String.format("%.2f", grade.getValue()));
                    contentStream.newLineAtOffset(80, 0);
                    contentStream.showText(grade.getDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
                    contentStream.endText();
                    yPos -= 15;
                }

                // Moyenne générale
                yPos -= 20;
                contentStream.setNonStrokingColor(0.8f, 0.9f, 1.0f);
                contentStream.addRect(50, yPos - 10, 500, 25);
                contentStream.fill();
                
                contentStream.setNonStrokingColor(Color.BLACK);
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 12);
                contentStream.newLineAtOffset(60, yPos - 5);
                contentStream.showText("MOYENNE GENERALE: " + String.format("%.2f/20", overallAverage));
                contentStream.endText();

                // Footer
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA_OBLIQUE, 8);
                contentStream.newLineAtOffset(50, 50);
                contentStream.showText("Document officiel genere le " + LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
                contentStream.endText();
            }

            document.save(out);
            return out.toByteArray();
        }
    }
}
