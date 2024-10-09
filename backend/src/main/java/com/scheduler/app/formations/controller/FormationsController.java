package com.scheduler.app.formations.controller;

import com.scheduler.app.apiResponse.ApiResponse;
import com.scheduler.app.classes.repository.ClassRepository;
import com.scheduler.app.classes.service.ClassServiceInterface;
import com.scheduler.app.formations.model.AssociationResponseEntity;
import com.scheduler.app.formations.model.FormationEntity;
import com.scheduler.app.formations.model.TeachersClassesResponseEntity;
import com.scheduler.app.formations.model.teachingAssignments.TeacherFormationClassAssociation;
import com.scheduler.app.formations.service.FormationsServiceInterface;
import com.scheduler.app.formations.service.TeacherFormationClassServiceInterface;
import com.scheduler.app.user.repository.UserRepository;
import org.postgresql.util.PSQLException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/timetable/formations")
public class FormationsController {
    @Autowired
    FormationsServiceInterface formationsService;

    @Autowired
    TeacherFormationClassServiceInterface teacherFormationClassService;

    @Autowired
    ClassServiceInterface classService;
    @Autowired
    UserRepository userRepository;

    @GetMapping(value = "/type={type}&pg={page}&s={size}")
    public ResponseEntity<List<FormationEntity>> getFormations(@PathVariable int type, @PathVariable int page, @PathVariable int size) {
        var formations = formationsService.getAllFormations(type, page, size);
        return ResponseEntity.ok(formations);
    }

    @PostMapping(value = "/addNewFormation")
    public ResponseEntity<FormationEntity> addFormation(@RequestBody FormationEntity formation) {
        var result = formationsService.addNewFormation(formation);
        return ResponseEntity.ok(result);
    }

    @PostMapping(value = "/addNewAssociation")
    public ResponseEntity<AssociationResponseEntity> addAssociation(@RequestBody AssociationResponseEntity associationBody) {
        try{
        System.out.println("====== ASSOCIATION: "+associationBody);
        String classId = classService.findByTypeAndSubject(associationBody.getClassType(), associationBody.getSubject()).getId();
        var teacherId = userRepository.findByUsername(associationBody.getTeacher()).getId();
        var association = new TeacherFormationClassAssociation(teacherId, classId, associationBody.getFormation());
        var result = teacherFormationClassService.addNewAssociation(association);
        return ResponseEntity.ok(result);
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        }
    }

    @GetMapping(value = "/getAllAssociations")
    public ResponseEntity<List<AssociationResponseEntity>> getAllAssociations() {
            var result = teacherFormationClassService.getAllAssociations();
            return ResponseEntity.ok(result);

    }

    @GetMapping(value = "/getAssociationsByTeacher/t={token}")
    public ResponseEntity<List<TeachersClassesResponseEntity>> getAssociationsByTeacher(@PathVariable String token) {
        var result = teacherFormationClassService.getAllAssociationsByTeacher(token);
        return ResponseEntity.ok(result);
    }
}
