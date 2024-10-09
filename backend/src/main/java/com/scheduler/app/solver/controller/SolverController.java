package com.scheduler.app.solver.controller;

import com.scheduler.app.rooms.repository.RoomRepository;
import com.scheduler.app.solver.timetableGenerator.UniversityTimetableSolver;
import com.scheduler.app.solver.utils.entity.rooms.RoomPreferencesEntity;
import com.scheduler.app.solver.utils.entity.rooms.RoomPreferencesPK;
import com.scheduler.app.solver.utils.entity.timeIntervals.TeacherAvailableTimeIntervals;
import com.scheduler.app.solver.utils.repository.rooms.RoomsPreferencesRepository;
import com.scheduler.app.solver.utils.repository.timeIntervals.TeacherAvailableTimeIntervalsRepository;
import com.scheduler.app.timetable.model.TimetableEntryEntity;
import com.scheduler.app.timetable.repository.TimetableRepository;
import com.scheduler.app.user.repository.UserRepository;
import com.scheduler.app.webSocketsUtils.SocketMessageHandler;
import com.scheduler.app.webSocketsUtils.WSMessage;
import com.scheduler.app.webSocketsUtils.WebSocketConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.lang.model.type.ArrayType;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@RestController
@CrossOrigin
@RequestMapping("/timetable/solve/")
public class SolverController {
    @Autowired
    UniversityTimetableSolver solver;

    @Autowired
    TimetableRepository timetableRepository;

    @Autowired
    RoomsPreferencesRepository roomsPreferencesRepository;


    @Autowired
    RoomRepository roomRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    TeacherAvailableTimeIntervalsRepository timeAvailabilityRepository;

    @Autowired
    WebSocketConfig webSocketConfig;


//    @GetMapping(value = "/sem={semester}/t={token}")
    @GetMapping(value = "/sem={semester}")
    public ResponseEntity<?> generateTimetable(@PathVariable Integer semester/*, @PathVariable String token*/) {
        var start = System.currentTimeMillis();
//        solver.generateTimetable(semester, token);

//        ((SocketMessageHandler) webSocketConfig.myMessageHandler()).sendMessage(token, new WSMessage<>("Extracting data from database...", "generatedData"));

        solver.extractDataFromDatabase(semester);

//        ((SocketMessageHandler) webSocketConfig.myMessageHandler()).sendMessage(token, new WSMessage<>("Adding constraints to the model...", "addingConstraints"));
        solver.addConstraints();

//        ((SocketMessageHandler) webSocketConfig.myMessageHandler()).sendMessage(token, new WSMessage<>("Generating timetable...", "generatingTimetable"));
        solver.generateTimetable(semester);

        var end = System.currentTimeMillis();
        var time = (end - start) / 1000.0;

        System.out.println("===== ALL EXEC TIME: "+time/60 + " minutes");

        var timetable = new ArrayList<>(timetableRepository.findAll());
//        return ResponseEntity.ok("Generated successfully in " + time / 60 + " minutes");
        return ResponseEntity.ok(timetable);
    }

    @GetMapping(value = "/get-last-timetable")
    public ResponseEntity<List<TimetableEntryEntity>> getLastTimetable() {
        var timetable = new ArrayList<>(timetableRepository.findAll());
        return ResponseEntity.ok(timetable);
    }


    @PostMapping(value = "/addRoomPreferences")
    public ResponseEntity<List<RoomPreferencesEntity>> addRoomPreferences(@RequestBody List<RoomPreferencesEntity> roomPreferences) {
        var teacherToken = roomPreferences.get(0).getId().getTeacherId();
        var teacherId = userRepository.findUserEntityByToken(teacherToken).getId();
        for (RoomPreferencesEntity roomPreference : roomPreferences) {
            var id = roomPreference.getId();
            id.setTeacherId(teacherId);
            roomPreference.setId(id);

            var preferredRooms = roomPreference.getPreferredRooms();
            for(var code : preferredRooms){
                var roomId = roomRepository.findByCode(code);
                if(roomId!=null) {
                    preferredRooms.set(preferredRooms.indexOf(code), roomId.getId());
                }
            }

            roomPreference.setPreferredRooms(preferredRooms);
        }


        var toAddPreferences = roomPreferences.stream().filter(p ->
                p.getPreferredRooms().size() != 0 || p.getPreferredDevices().size() != 0
                || p.getPreferredBoards().size() != 0 || p.getWantsProjector()==1).collect(Collectors.toList());

        var toRemovePreferences = roomPreferences.stream().filter(p ->
                p.getPreferredRooms().size() == 0 && p.getPreferredDevices().size() == 0
                && p.getPreferredBoards().size() == 0 && p.getWantsProjector()==0).collect(Collectors.toList());

        System.out.println("TO ADD: "+toAddPreferences);

        roomsPreferencesRepository.saveAll(toAddPreferences);
        roomsPreferencesRepository.deleteAll(toRemovePreferences);

        return ResponseEntity.ok(roomPreferences);
    }

    @PostMapping(value = "/addTimePreferences")
    public ResponseEntity<List<TeacherAvailableTimeIntervals>> addTimePreference(@RequestBody List<TeacherAvailableTimeIntervals> timePreferences) {
        var teacherToken = timePreferences.get(0).getId().getTeacherId();
        var teacherId = userRepository.findUserEntityByToken(teacherToken).getId();
        for (TeacherAvailableTimeIntervals timePreference : timePreferences) {
            var id = timePreference.getId();
            id.setTeacherId(teacherId);
            timePreference.setId(id);
        }

        System.out.println(timePreferences);
        var addedPreferences = timeAvailabilityRepository.saveAll(timePreferences);
        return ResponseEntity.ok(addedPreferences);
    }

    @GetMapping(value = "/getTimePreferences/t={token}")
    public ResponseEntity<List<TeacherAvailableTimeIntervals>> addTimePreference(@PathVariable String token) {
        var teacherId = userRepository.findUserEntityByToken(token).getId();
        var timePreferences = timeAvailabilityRepository.findAllByTeacherId(teacherId);
        timePreferences.forEach(p->{var id= p.getId(); id.setTeacherId(token);p.setId(id);});

        return ResponseEntity.ok(timePreferences);
    }

    @GetMapping(value = "/getRoomPreferences/t={token}")
    public ResponseEntity<List<RoomPreferencesEntity>> getRoomPreferences(@PathVariable String token) {
        var teacherId = userRepository.findUserEntityByToken(token).getId();
        var roomPreferences = roomsPreferencesRepository.findAllByTeacherId(teacherId);

        for(var pref:roomPreferences){
            var prefRooms = pref.getPreferredRooms();
            for(var id : prefRooms){
                System.out.println("id ======= "+id);
                var roomCode = roomRepository.findById(id);
                if(roomCode.isPresent()) {
                    var code = roomCode.get().getCode();
                    prefRooms.set(prefRooms.indexOf(id), code);
                }
            }
            pref.setPreferredRooms(prefRooms);
        }
        roomPreferences.forEach(p->{var id= p.getId(); id.setTeacherId(token);p.setId(id);});
        return ResponseEntity.ok(roomPreferences);
    }
}
