package com.groupe.gestion_.de_.notes.services.ServiceImplementation;

import com.groupe.gestion_.de_.notes.dto.GradeResponse;
import com.groupe.gestion_.de_.notes.dto.UserResponse;
import com.groupe.gestion_.de_.notes.services.ServiceInterface.ExcelExportService;
import com.groupe.gestion_.de_.notes.services.ServiceInterface.GradesService;
import com.groupe.gestion_.de_.notes.services.ServiceInterface.UserService;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.CreationHelper;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExcelExportServiceImpl implements ExcelExportService {

    private final GradesService gradesService;
    private final UserService userService;

    @Override
    public byte[] exportGradesToExcel() throws IOException {
        // 1. Fetch all grades from the Grade Service
        List<GradeResponse> grades = gradesService.getAllGrades();

        // 2. Create the Excel Workbook
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            CreationHelper createHelper = workbook.getCreationHelper();
            Sheet sheet = workbook.createSheet("Grades Report");

            // 3. Create a header row with styling
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            CellStyle headerCellStyle = workbook.createCellStyle();
            headerCellStyle.setFont(headerFont);

            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "StudentIdNum", "Student Name", "SubjectCode", "Subject Name", "Grade Value", "Recorded By Teacher ID"};
            for (int col = 0; col < headers.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(headers[col]);
                cell.setCellStyle(headerCellStyle);
            }

            // 4. Populate the data rows
            int rowIdx = 1;
            for (GradeResponse grade : grades) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(grade.getId());
                row.createCell(1).setCellValue(grade.getStudentIdNum());
                row.createCell(2).setCellValue(grade.getFirstname() + " " + grade.getLastname());
                row.createCell(3).setCellValue(grade.getSubjectCode());
                row.createCell(4).setCellValue(grade.getSubjectName());
                row.createCell(5).setCellValue(grade.getValue());
                row.createCell(6).setCellValue(grade.getRecordedBy());
            }

            // 5. Auto-size columns for readability
            for (int col = 0; col < headers.length; col++) {
                sheet.autoSizeColumn(col);
            }

            // 6. Write the workbook to an output stream
            workbook.write(out);
            return out.toByteArray();
        }
    }

    @Override
    public byte[] exportUsersToExcel() throws IOException {
        // 1. Fetch all users from the User Service
        List<UserResponse> users = userService.getAllUsers();

        // 2. Create the Excel Workbook
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            // 3. Create a sheet
            Sheet sheet = workbook.createSheet("Users Report");

            // 4. Create header style
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            // 5. Create the header row
            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "Username", "First Name", "Last Name", "Email", "Role"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // 6. Populate data rows
            int rowNum = 1;
            for (UserResponse user : users) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(user.getId());
                row.createCell(1).setCellValue(user.getUsername());
                row.createCell(2).setCellValue(user.getFirstname());
                row.createCell(3).setCellValue(user.getLastname());
                row.createCell(4).setCellValue(user.getEmail());
                row.createCell(5).setCellValue(user.getRole().toString());
            }

            // 7. Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            // 8. Write the workbook to an output stream
            workbook.write(out);
            return out.toByteArray();
        }
    }
}
