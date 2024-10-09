package com.scheduler.app.formations.repository;

import com.scheduler.app.formations.model.FormationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.List;


@Repository
public interface FormationsRepository extends JpaRepository<FormationEntity, String> {

    @Transactional
    @Query(value = "SELECT * FROM formations WHERE type = :type ORDER BY code /*LIMIT :size OFFSET :page*:size*/", nativeQuery = true)
    List<FormationEntity> getAllFormationByTypeAndPages(int type/*, int page, int size*/);

    @Transactional
    @Query(value = "SELECT * FROM formations ORDER BY code LIMIT :size OFFSET :page*:size", nativeQuery = true)
    List<FormationEntity> getAllFormations(int page, int size);
}
