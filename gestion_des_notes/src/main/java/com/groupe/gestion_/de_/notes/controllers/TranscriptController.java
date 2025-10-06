package com.groupe.gestion_.de_.notes.controllers;

import com.groupe.gestion_.de_.notes.services.ServiceInterface.TranscriptService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/transcript")
@RequiredArgsConstructor
@Tag(name = "Transcript Management", description = "API for generating official student transcripts in PDF format.")
@CrossOrigin(origins = "http://localhost:4300")
public class TranscriptController {

    private final TranscriptService transcriptService;

    @Operation(summary = "Generate a PDF transcript for a student", description = "Generates and downloads an academic transcript in PDF format for the specified student.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Transcript generated and downloaded successfully"),
            @ApiResponse(responseCode = "403", description = "Forbidden: Insufficient privileges to view this transcript"),
            @ApiResponse(responseCode = "404", description = "Student not found")
    })
    @GetMapping("/generate/{studentIdNum}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<byte[]> generateStudentTranscript(@PathVariable String studentIdNum) throws IOException {
        byte[] pdfBytes = transcriptService.generateTranscriptForStudent(studentIdNum);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        String filename = "releve_notes_" + studentIdNum + ".pdf";
        headers.setContentDispositionFormData("attachment", filename);

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}
