package com.scheduler.app.solver.utils.repository.rooms;
import com.scheduler.app.solver.utils.entity.rooms.RoomPreferencesEntity;
import com.scheduler.app.solver.utils.entity.rooms.RoomPreferencesPK;
import com.scheduler.app.solver.utils.entity.timeIntervals.TeacherAvailableTimeIntervals;
import com.scheduler.app.solver.utils.entity.timeIntervals.TeacherAvailableTimeIntervalsPK;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;


@Repository
public interface RoomsPreferencesRepository extends JpaRepository<RoomPreferencesEntity, RoomPreferencesPK> {

    @Transactional
    @Query(value = "SELECT * FROM room_preferences WHERE teacher_id = :teacherId", nativeQuery = true)
    List<RoomPreferencesEntity> findAllByTeacherId(String teacherId);
}
