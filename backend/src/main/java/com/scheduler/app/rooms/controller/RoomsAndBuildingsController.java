package com.scheduler.app.rooms.controller;

import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;
import com.scheduler.app.apiResponse.ApiResponse;
import com.scheduler.app.rooms.model.BuildingEntity;
import com.scheduler.app.rooms.model.RoomEntity;
import com.scheduler.app.rooms.service.RoomsServiceInterface;
import com.scheduler.app.subjects.model.NewSubjectEntityDTO;
import com.scheduler.app.subjects.model.SubjectEntity;
import com.scheduler.app.subjects.service.SubjectServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.logging.Logger;

@RestController
@CrossOrigin
@RequestMapping("/timetable/rooms/")
public class RoomsAndBuildingsController {
    @Autowired
    RoomsServiceInterface roomsService;



    @PostMapping(value = "/newBuilding")
    public ResponseEntity<?> addNewBuilding(@RequestBody BuildingEntity building) {
        var addedEntity = roomsService.addNewBuilding(building);

        return ResponseEntity.ok(addedEntity);
    }

    @GetMapping(value = "/getBuildings")
    public ResponseEntity<?> getBuildings() {
        var buildings = roomsService.getAllBuildings();

        return ResponseEntity.ok(buildings);
    }

    @GetMapping(value = "/getRoomsInBuilding/building={b}")
    public ResponseEntity<?> getRoomsInBuilding(@PathVariable String b) {
        var rooms = roomsService.getAllRoomsFromBuilding(b);
        System.out.println(rooms);
        return ResponseEntity.ok(rooms);
    }

    @PostMapping(value = "/newRoom")
    public ResponseEntity<?> addNewRoom(@RequestBody RoomEntity room) {
        var savedRoom = roomsService.addNewRoom(room);
        return ResponseEntity.ok(savedRoom);
    }


}
