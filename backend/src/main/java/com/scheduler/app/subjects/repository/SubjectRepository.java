package com.scheduler.app.subjects.repository;

import com.scheduler.app.subjects.model.SubjectEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.Collection;
import java.util.List;


@Repository
public interface SubjectRepository extends JpaRepository<SubjectEntity, String> {
        @Transactional
        @Query(value = "select * from subjects s " +
                "where s.name ilike :searchCriteria ||'%' "+
                "order by s.name "+
                "limit :size offset :page * :size", nativeQuery = true)
        Collection<SubjectEntity> searchSubjects(String searchCriteria, Integer page, Integer size);

//        @Transactional
//        @Query(value = "select * from subjects s " +
//                "where s.type = :filter " +
//                "and s.name ilike :searchCriteria ||'%' "+
//                "order by s.name "+
//                "limit :size offset :page * :size", nativeQuery = true)
//        Collection<SubjectEntity> searchSubjectsFiltered(String searchCriteria, Integer filter, Integer page, Integer size);
        @Transactional
        @Modifying
        @Query(value = "update subjects " +
                "set name = :name "+
                "where code = :code", nativeQuery = true)
        int update(String name, String code);

        @Transactional
        @Query(value = "SELECT s.id, s.code, s.name " +
                "FROM subjects s " +
                "join years_subjects ys on s.id = ys.subject_id " +
                "WHERE ys.semester = :semester " +
                "AND/* (*/ys.year_id = 'IE1' /*OR ys.year_id = 'I2' OR ys.year_id = 'I3')*/", nativeQuery = true)
        List<SubjectEntity> getSubjectsInSemester(int semester);
}
