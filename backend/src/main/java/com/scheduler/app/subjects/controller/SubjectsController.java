package com.scheduler.app.subjects.controller;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import com.scheduler.app.apiResponse.ApiResponse;
import com.scheduler.app.subjects.model.NewSubjectEntityDTO;
import com.scheduler.app.subjects.model.SubjectEntity;
import com.scheduler.app.subjects.service.SubjectServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.logging.Logger;

@RestController
@CrossOrigin
@RequestMapping("/timetable/subjects/")
public class SubjectsController {
    @Autowired
    SubjectServiceInterface subjectService;



    @PostMapping(value = "/newSubject")
    public ResponseEntity<?> addNewSubject(@RequestBody NewSubjectEntityDTO subject) {
//        System.out.println(subject.toString());
//        var result = new SubjectEntity();
//        try (CSVReader csvReader = new CSVReader(new FileReader("D:\\Faculta\\Master\\__Disertatie__\\UniversityScheduleGenerator\\backend\\src\\main\\java\\com\\scheduler\\app\\subjects\\controller\\subjects.csv"));) {
//            String[] values;
//            while ((values = csvReader.readNext()) != null) {
//                result = subjectService.addNewSubject(
//                        new SubjectEntity(values[0], values[1], Integer.parseInt(values[2])
//                        ));
//            }
//        } catch (CsvValidationException | IOException e) {
//            throw new RuntimeException(e);
//        }
        SubjectEntity result;
        try {
            result = subjectService.addNewSubject(subject.mapToSubjectEntity());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse(e.getMessage(), false));
        }
    }

        @PutMapping(value = "/updateSubject")
        public ResponseEntity<?> updateSubject(@RequestBody SubjectEntity subject) {
            int result;
            try {
                result = subjectService.updateSubject(subject);
                return ResponseEntity.ok(result);
            } catch(Exception e) {
                return ResponseEntity.ok(new ApiResponse(e.getMessage(), false));
            }
    }

    @GetMapping(value = "/getAllSubjects")
    public ResponseEntity<List<SubjectEntity>> getAllSubjects() {
        var subjects = subjectService.getAllSubjects();
        return ResponseEntity.ok(subjects);
    }

    @GetMapping(value = "/crt={searchCriteria}/pg={page}&s={size}")
    public ResponseEntity<Collection<SubjectEntity>> searchSubjects(@PathVariable String searchCriteria,
                                                                   @PathVariable Integer page,
                                                                   @PathVariable Integer size) {
        var searchedSubjects=subjectService.searchSubjects(searchCriteria, page, size);
        return ResponseEntity.ok(searchedSubjects);
    }
}
