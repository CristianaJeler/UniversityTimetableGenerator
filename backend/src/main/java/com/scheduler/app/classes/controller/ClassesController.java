package com.scheduler.app.classes.controller;

import com.scheduler.app.classes.model.ClassEntity;
import com.scheduler.app.classes.service.ClassServiceInterface;
import com.scheduler.app.rooms.model.BuildingEntity;
import com.scheduler.app.solver.timetableGenerator.UniversityTimetableSolver;
import com.scheduler.app.timetable.model.TimetableEntryEntity;
import com.scheduler.app.timetable.repository.TimetableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
@RequestMapping("/timetable/classes/")
public class ClassesController {
    @Autowired
    ClassServiceInterface classServiceInterface;

    @GetMapping(value = "/getClasses")
    public ResponseEntity<List<ClassEntity>> getClasses() {
        var allClasses = classServiceInterface.getAll();

        return ResponseEntity.ok(allClasses);
    }

    @PostMapping(value = "/addClass")
    public ResponseEntity<ClassEntity> addClass(@RequestBody ClassEntity newClass) {
        var addedClass = classServiceInterface.addClass(newClass);

        return ResponseEntity.ok(addedClass);
    }

}
