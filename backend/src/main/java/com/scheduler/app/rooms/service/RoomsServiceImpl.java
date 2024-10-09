package com.scheduler.app.rooms.service;

import com.scheduler.app.rooms.model.BuildingEntity;
import com.scheduler.app.rooms.model.RoomEntity;
import com.scheduler.app.rooms.repository.BuildingRepository;
import com.scheduler.app.rooms.repository.RoomRepository;
import com.scheduler.app.subjects.model.SubjectEntity;
import com.scheduler.app.subjects.repository.SubjectRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
@AllArgsConstructor
public class RoomsServiceImpl implements RoomsServiceInterface {
    @Autowired
    RoomRepository roomRepository;

    @Autowired
    BuildingRepository buildingRepository;

    public RoomsServiceImpl() {
    }

    @Override
    public BuildingEntity addNewBuilding(BuildingEntity building) {
        return buildingRepository.save(building);
    }

    @Override
    public List<BuildingEntity> getAllBuildings() {
        return buildingRepository.findAll();
    }

    @Override
    public List<RoomEntity> getAllRoomsFromBuilding(String b) {
        System.out.println(roomRepository == null);
        return roomRepository.findAllByBuildingId(b);
    }

    @Override
    public RoomEntity addNewRoom(RoomEntity room) {
        return roomRepository.save(room);
    }
}
