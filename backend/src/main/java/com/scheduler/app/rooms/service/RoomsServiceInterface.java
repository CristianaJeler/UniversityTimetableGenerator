package com.scheduler.app.rooms.service;


import com.scheduler.app.rooms.model.BuildingEntity;
import com.scheduler.app.rooms.model.RoomEntity;
import com.scheduler.app.subjects.model.SubjectEntity;

import java.util.List;

public interface RoomsServiceInterface {

    BuildingEntity addNewBuilding(BuildingEntity building);

    List<BuildingEntity> getAllBuildings();

    List<RoomEntity> getAllRoomsFromBuilding(String b);

    RoomEntity addNewRoom(RoomEntity room);
}
