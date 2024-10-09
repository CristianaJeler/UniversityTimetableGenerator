package com.scheduler.app.formations.service;

import com.scheduler.app.classes.repository.ClassRepository;
import com.scheduler.app.formations.model.AssociationResponseEntity;
import com.scheduler.app.formations.model.TeachersClassesResponseEntity;
import com.scheduler.app.formations.model.formationsSubjects.FormationSubjectPK;
import com.scheduler.app.formations.model.formationsSubjects.FormationsSubjectsEntity;
import com.scheduler.app.formations.model.teachingAssignments.TeacherFormationClassAssociation;
import com.scheduler.app.formations.repository.FormationsRepository;
import com.scheduler.app.formations.repository.FormationsSubjectsRepository;
import com.scheduler.app.formations.repository.TeacherFormationClassAssociationRepository;
import com.scheduler.app.subjects.repository.SubjectRepository;
import com.scheduler.app.user.repository.UserRepository;
import org.postgresql.util.PSQLException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeacherFormationClassServiceImpl implements TeacherFormationClassServiceInterface {
    @Autowired
    TeacherFormationClassAssociationRepository associationRepository;
    @Autowired
    SubjectRepository subjectRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    ClassRepository classRepository;
    @Autowired
    FormationsSubjectsRepository formationsSubjectsRepository;

    @Autowired
    FormationsRepository formationsRepository;

    @Override
    public AssociationResponseEntity addNewAssociation(TeacherFormationClassAssociation association) throws Exception {
        var savedAssociation = associationRepository.save(association);
        var teacher = userRepository.findByUsername(association.getTeacherId());
        var classEntity = classRepository.findById(association.getClassId()).get();
        var subject = subjectRepository.findById(classEntity.getSubjectId()).get();
        var formation = formationsRepository.findById(association.getFormationId()).get();

        // check if association between year of study and subject exists
        var yearId =formation.getYear()==null?formation.getCode():formation.getYear();
        if(!formationsSubjectsRepository.existsById(new FormationSubjectPK(yearId, subject.getId()))){
            formationsSubjectsRepository.save(new FormationsSubjectsEntity(new  FormationSubjectPK(yearId, subject.getId())));
        }

        return new AssociationResponseEntity(classEntity.getClassType(),savedAssociation.getId(),
                teacher.getFirstName()+" "+teacher.getLastName(), association.getFormationId(),  subject.getName());
    }

    @Override
    public List<AssociationResponseEntity> getAllAssociations() {
        return associationRepository.findAll().stream()
                .map(tfca->{
                    var teacher = userRepository.findById(tfca.getTeacherId()).get();
                    var classEntity = classRepository.findById(tfca.getClassId()).get();
                    var subject = subjectRepository.findById(classEntity.getSubjectId()).get();
                    return new AssociationResponseEntity(classEntity.getClassType(),tfca.getId(),
                            teacher.getFirstName()+" "+teacher.getLastName(), tfca.getFormationId(),  subject.getName());
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<TeachersClassesResponseEntity> getAllAssociationsByTeacher(String token) {
        var userId = userRepository.findUserEntityByToken(token).getId();
        return associationRepository.findAllByTeacherId(userId).stream()
                .map(tfca->{
                    var classEntity = classRepository.findById(tfca.getClassId()).get();
                    var subject = subjectRepository.findById(classEntity.getSubjectId()).get();
                    return new TeachersClassesResponseEntity(classEntity.getId(),classEntity.getClassType(),subject.getName(),
                            subject.getId());
                })
                .collect(Collectors.toList());
    }
}
