package com.scheduler.app.formations.repository;

import com.scheduler.app.formations.model.teachingAssignments.TeacherFormationClassAssociation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;


@Repository
public interface TeacherFormationClassAssociationRepository extends JpaRepository<TeacherFormationClassAssociation, String> {
    @Transactional
    @Query(value = "SELECT tfc.id as id, tfc.teacher_id as teacher_id, tfc.formation_id as formation_id, tfc.class_id as class_id " +
            "FROM teachers_formations_classes as tfc " +
            "JOIN classes c on tfc.class_id = c.id " +
            "JOIN years_subjects ys on c.subject_id = ys.subject_id " +
            "WHERE ys.semester = :semester " +
            "AND /*(*/ys.year_id = 'IE1' /*OR ys.year_id = 'I2' OR ys.year_id = 'I3')*/", nativeQuery = true)
    List<TeacherFormationClassAssociation> getAllFromSemester(int semester);

    @Transactional
    @Query(value = "SELECT * " +
            "FROM teachers_formations_classes as tfc " +
            "WHERE tfc.teacher_id = :teacherId /*AND " +
            "(SELECT COUNT(*) FROM room_preferences rp WHERE tfc.class_id=rp.class_id) =0*/", nativeQuery = true)
    List<TeacherFormationClassAssociation> findAllByTeacherId(String teacherId);
}
