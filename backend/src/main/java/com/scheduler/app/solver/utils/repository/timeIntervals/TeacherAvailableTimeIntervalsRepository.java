package com.scheduler.app.solver.utils.repository.timeIntervals;
import com.scheduler.app.solver.utils.entity.timeIntervals.TeacherAvailableTimeIntervals;
import com.scheduler.app.solver.utils.entity.timeIntervals.TeacherAvailableTimeIntervalsPK;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;


@Repository
public interface TeacherAvailableTimeIntervalsRepository extends JpaRepository<TeacherAvailableTimeIntervals, TeacherAvailableTimeIntervalsPK> {

    @Transactional
    @Query(value = "SELECT * FROM time_availability WHERE teacher_id = :teacherId", nativeQuery = true)
    List<TeacherAvailableTimeIntervals> findAllByTeacherId(String teacherId);
}
