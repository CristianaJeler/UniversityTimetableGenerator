package com.scheduler.app.formations.service;

import com.scheduler.app.formations.model.AssociationResponseEntity;
import com.scheduler.app.formations.model.TeachersClassesResponseEntity;
import com.scheduler.app.formations.model.teachingAssignments.TeacherFormationClassAssociation;
import org.postgresql.util.PSQLException;

import java.util.List;

public interface TeacherFormationClassServiceInterface {
    AssociationResponseEntity addNewAssociation(TeacherFormationClassAssociation association) throws Exception;

    List<AssociationResponseEntity> getAllAssociations();

    List<TeachersClassesResponseEntity> getAllAssociationsByTeacher(String token);
}
