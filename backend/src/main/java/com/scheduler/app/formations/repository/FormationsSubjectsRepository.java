package com.scheduler.app.formations.repository;

import com.scheduler.app.formations.model.formationsSubjects.FormationSubjectPK;
import com.scheduler.app.formations.model.formationsSubjects.FormationsSubjectsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface FormationsSubjectsRepository extends JpaRepository<FormationsSubjectsEntity, FormationSubjectPK> {

}
