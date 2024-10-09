package com.scheduler.app.classes.repository;

import com.scheduler.app.classes.model.ClassEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ClassRepository extends JpaRepository<ClassEntity, String> {
    ClassEntity findByClassTypeAndSubjectId(int classType, String subjectId);
}
