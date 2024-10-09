package com.scheduler.app.rooms.repository;

import com.scheduler.app.rooms.model.BuildingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface BuildingRepository extends JpaRepository<BuildingEntity, String> {

}
