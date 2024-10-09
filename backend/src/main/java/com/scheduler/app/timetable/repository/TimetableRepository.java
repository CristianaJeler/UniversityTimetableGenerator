package com.scheduler.app.timetable.repository;

import com.scheduler.app.timetable.model.TimetableEntryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TimetableRepository extends JpaRepository<TimetableEntryEntity, String> {

}
