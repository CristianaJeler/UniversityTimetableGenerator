package com.scheduler.app.rooms.repository;

import com.scheduler.app.rooms.model.RoomEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface RoomRepository extends JpaRepository<RoomEntity, String> {
    List<RoomEntity> findAllByBuildingId(String buildingId);

    RoomEntity findByCode(String code);
}
