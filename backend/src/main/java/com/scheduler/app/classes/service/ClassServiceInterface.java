package com.scheduler.app.classes.service;


import com.scheduler.app.classes.model.ClassEntity;
import com.scheduler.app.formations.model.teachingAssignments.TeacherFormationClassAssociation;
import com.scheduler.app.rooms.model.BuildingEntity;
import com.scheduler.app.rooms.model.RoomEntity;

import java.util.List;

public interface ClassServiceInterface {
    List<ClassEntity> getAll();

    ClassEntity findByTypeAndSubject(int classType, String subjectId);

    ClassEntity addClass(ClassEntity newClass);
}
