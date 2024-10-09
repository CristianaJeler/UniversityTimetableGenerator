package com.scheduler.app.classes.service;

import com.scheduler.app.classes.model.ClassEntity;
import com.scheduler.app.classes.repository.ClassRepository;
import com.scheduler.app.rooms.model.BuildingEntity;
import com.scheduler.app.rooms.model.RoomEntity;
import com.scheduler.app.rooms.repository.BuildingRepository;
import com.scheduler.app.rooms.repository.RoomRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class ClassesServiceImpl implements ClassServiceInterface {
    @Autowired
    ClassRepository classRepository;

    public ClassesServiceImpl() {
    }

    @Override
    public List<ClassEntity> getAll() {
        return classRepository.findAll();
    }

    @Override
    public ClassEntity findByTypeAndSubject(int classType, String subjectId) {
        return classRepository.findByClassTypeAndSubjectId(classType, subjectId);
    }

    @Override
    public ClassEntity addClass(ClassEntity newClass) {
        return classRepository.save(newClass);
    }
}
