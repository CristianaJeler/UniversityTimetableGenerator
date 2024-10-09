package com.scheduler.app.solver.timetableGenerator;

import com.google.common.collect.BiMap;
import com.google.common.collect.HashBiMap;
import com.google.ortools.Loader;
import com.google.ortools.sat.*;
import com.scheduler.app.classes.model.ClassEntity;
import com.scheduler.app.classes.repository.ClassRepository;
import com.scheduler.app.formations.model.FormationEntity;
import com.scheduler.app.formations.model.teachingAssignments.TeacherFormationClassAssociation;
import com.scheduler.app.formations.repository.FormationsRepository;
import com.scheduler.app.formations.repository.TeacherFormationClassAssociationRepository;
import com.scheduler.app.rooms.model.BuildingEntity;
import com.scheduler.app.rooms.model.RoomEntity;
import com.scheduler.app.rooms.repository.BuildingRepository;
import com.scheduler.app.rooms.repository.RoomRepository;
import com.scheduler.app.solver.utils.entity.AssignmentVariablesMap;
import com.scheduler.app.solver.utils.entity.AssignmentsVariableKey;
import com.scheduler.app.solver.utils.entity.rooms.RoomPreferencesPK;
import com.scheduler.app.solver.utils.repository.rooms.RoomsPreferencesRepository;
import com.scheduler.app.solver.utils.repository.timeIntervals.TeacherAvailableTimeIntervalsRepository;
import com.scheduler.app.subjects.repository.SubjectRepository;
import com.scheduler.app.timetable.model.TimetableEntryEntity;
import com.scheduler.app.timetable.repository.TimetableRepository;
import com.scheduler.app.user.model.UserEntity;
import com.scheduler.app.user.repository.UserRepository;
import com.scheduler.app.webSocketsUtils.SocketMessageHandler;
import com.scheduler.app.webSocketsUtils.WSMessage;
import com.scheduler.app.webSocketsUtils.WebSocketConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.scheduler.app.solver.utils.Tuple;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static com.scheduler.app.solver.timetableGenerator.Constants.*;

@Component
public class UniversityTimetableSolver {
    @Autowired
    private TeacherFormationClassAssociationRepository teacherFormationClassAssociationRepository;

    @Autowired
    private TeacherAvailableTimeIntervalsRepository availabilityRepository;

    @Autowired
    private RoomsPreferencesRepository roomsPreferencesRepository;

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private UserRepository teacherRepository;

    @Autowired
    private FormationsRepository formationRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private TimetableRepository timetableRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private BuildingRepository buildingRepository;

    @Autowired
    private WebSocketConfig webSocketConfig;
    private List<RoomEntity> rooms = new ArrayList<>();
    private List<String> buildings = new ArrayList<>();
    private final BiMap<TeacherFormationClassAssociation, Integer> associationsMap = HashBiMap.create();

    AssignmentVariablesMap constraintVarsMap = new AssignmentVariablesMap();
    CpModel model;

    private final BiMap<String, ClassEntity> classesMap = HashBiMap.create();
    private final BiMap<String, FormationEntity> formationsMap = HashBiMap.create();
    private final BiMap<String, UserEntity> teachersMap = HashBiMap.create();
    private int roomsNo;

    private Map<Tuple<String, Integer, Integer, Integer>, List<Literal>> consecutiveIntervalsAssigments = new HashMap<>();

    public UniversityTimetableSolver() {

    }

    public void extractDataFromDatabase(int semester) {
        rooms = roomRepository.findAll().stream().filter(r -> r.getCapacity() > 0).collect(Collectors.toList());
        buildings = rooms.stream().map(RoomEntity::getBuildingId).distinct().collect(Collectors.toList());
//        System.out.println(buildings + "\n");
//        System.out.println(buildingRepository.findAll().stream()
//                .map(BuildingEntity::getId).collect(Collectors.toList()) + "\n");
        // elements of the format (teacher_id, formations_id, class_id)
        var associations = new ArrayList<>(teacherFormationClassAssociationRepository.getAllFromSemester(semester));
        for (var teachingAssignment : associations) {
            associationsMap.put(teachingAssignment, associations.indexOf(teachingAssignment));
            // extracting the class from the association
            var c = classRepository.findById(teachingAssignment.getClassId());
            c.ifPresent(classEntity -> {
                if (!classesMap.containsKey(classEntity.getId())) {
                    classesMap.put(classEntity.getId(), classEntity);
                }
            });

            //  extracting the teachers from the association
            var t = teacherRepository.findById(teachingAssignment.getTeacherId());
            t.ifPresent(teacherEntity -> {
                if (!teachersMap.containsKey(teacherEntity.getId())) {
                    teachersMap.put(teacherEntity.getId(), teacherEntity);
                }
            });

            // extracting the formation from the association
            var f = formationRepository.findById(teachingAssignment.getFormationId());
            f.ifPresent(formationEntity -> {
                if (!formationsMap.containsKey(formationEntity.getCode())) {
                    formationsMap.put(formationEntity.getCode(), formationEntity);
                }
            });
        }
        roomsNo = rooms.size();
    }

    private void addNoOverlapsBetweenFormations(List<FormationEntity> noOverlappingFormations) {
        for (var formation : noOverlappingFormations) {
            for (var i : ALL_TIME_INTERVALS) {
                var week1List = constraintVarsMap.getAllAssignmentsByFormationAndWeekAndTime(formation.getCode(), 1, i);
                var week2List = constraintVarsMap.getAllAssignmentsByFormationAndWeekAndTime(formation.getCode(), 2, i);

                model.addAtMostOne(week1List);
                model.addAtMostOne(week2List);
            }
        }
    }

    public void addConstraints(){
        Loader.loadNativeLibraries();

        model = new CpModel();

//        ((SocketMessageHandler) webSocketConfig.myMessageHandler()).sendMessage(token, new WSMessage<>("Adding constraint to the model...", "addingConstraints"));
        // defining the HARD constraints
        addHardConstraints();
        System.out.println("============ ADDED HARD CONSTRAINTS");

        // defining the SOFT constraints
        addSoftConstraints();
        System.out.println("============ ADDED SOFT CONSTRAINTS");
    }


    public void generateTimetable(Integer semester/*, String token*/) {

        // extracting the data that is relevant for the schedule generator
//        ((SocketMessageHandler) webSocketConfig.myMessageHandler()).sendMessage(token, new WSMessage<>("Extracting data from database...", "generatedData"));
//        extractDataFromDatabase(semester);

        System.out.println("============ DATA EXTRACTED");
        System.out.println("===== ROOMS: "+rooms);
        System.out.println("===== BUILDINGS: "+buildings);
        System.out.println("===== TEACHERS: "+teachersMap);
        System.out.println("===== ASSOCIATIONS: "+associationsMap);
        System.out.println("===== CLASSES: "+classesMap);
        System.out.println("===== FORMATIONS: "+formationsMap);

//        hardConstraintsVariables = new BoolVar[associationsMap.size()][ALL_TIME_INTERVALS.length + 1][roomsNo][FREQUENCY_TYPES_NO];
//        model = new CpModel();
//
////        ((SocketMessageHandler) webSocketConfig.myMessageHandler()).sendMessage(token, new WSMessage<>("Adding constraint to the model...", "addingConstraints"));
//        // defining the HARD constraints
//        addHardConstraints();
//        System.out.println("============ ADDED HARD CONSTRAINTS");
//
//        // defining the SOFT constraints
//        addSoftConstraints();
//        System.out.println("============ ADDED SOFT CONSTRAINTS");
        // calling the solver on the model that we have created
        CpSolver solver = new CpSolver();
        solver.getParameters().setMaxTimeInSeconds(1800);
        // Creates a solver and solves the model.
        solver.getParameters().setLogSearchProgress(true);

        System.out.println("============ SOLVING NOW");
        solver.getParameters().setNumWorkers(8);
//        solver.getParameters().setEnumerateAllSolutions(true);

//        ((SocketMessageHandler) webSocketConfig.myMessageHandler()).sendMessage(token, new WSMessage<>("Generating timetable...", "generatingTimetable"));
        CpSolverStatus status = solver.solve(model);

        if (status == CpSolverStatus.OPTIMAL || status == CpSolverStatus.FEASIBLE) {
            var subjects = subjectRepository.getSubjectsInSemester(semester);
            timetableRepository.deleteAll();
            int assocsToScheduled = 0;
            for (var i : ALL_TIME_INTERVALS) {
                for (var a : associationsMap.keySet()) {
                    var subjectName = subjects.stream().filter(s ->
                            Objects.equals(s.getId(), classesMap.get(a.getClassId()).getSubjectId())).findFirst().get().getName();
                    for (var r = 0; r < roomsNo; r++) {
                        var b = buildings.indexOf(rooms.get(r).getBuildingId());
                        for (var week : IntStream.range(0, 3).toArray()) {
                            if (constraintVarsMap.get(new AssignmentsVariableKey(a, i, r, b, week)) != null &&
                                    solver.booleanValue(constraintVarsMap.get(new AssignmentsVariableKey(a, i, r, b, week)))) {
                                assocsToScheduled++;

                                var day = Days.indexOf(TimeIntervals[i].split(" ")[0]);
                                var time = Times.indexOf(TimeIntervals[i].split(" ")[1]);
                                TimetableEntryEntity timetableEntry = new TimetableEntryEntity(
                                        teachersMap.get(a.getTeacherId()).getFirstName() + " " + teachersMap.get(a.getTeacherId()).getLastName(),
                                        subjectName,
                                        ClassTypes[classesMap.get(a.getClassId()).getClassType()],
                                        a.getFormationId(),
                                        rooms.get(r).getCode(),
                                        day,
                                        time,
                                        week

                                );
                                timetableRepository.save(timetableEntry);
                            }
                        }
                    }
                }
            }


            // Statistics.
            System.out.println("Statistics");
            System.out.println("SOLUTION IS " + status.name());
            System.out.println("Objective value: " + solver.objectiveValue());
            System.out.println("Wall Time: " + solver.wallTime());
            System.out.println("User Time: " + solver.userTime());
            System.out.println("Conflicts: " + solver.numConflicts());
            System.out.println("Branches: " + solver.numBranches());
            System.out.println("Best obj bound: " + solver.bestObjectiveBound());
            System.out.println("Solution Info: " + solver.getSolutionInfo());

            System.out.println("Associations to be scheduled: " + associationsMap.size());
            System.out.println("Associations scheduled: " + assocsToScheduled);
            System.out.println("Constraint satisfiability percentage: " + solver.objectiveValue() / (associationsMap.size() * MAX_COEFFICIENT));

            System.out.println("Scheduled activities: "+associationsMap.size());
            System.out.println("Teachers: "+teachersMap.keySet().size());
            System.out.println("Formations: "+formationsMap.keySet().size());
            System.out.println("Rooms: "+rooms.size());
            System.out.println("Buildings: "+buildings.size());
        }
    }

    private void addSoftConstraints() {
        LinearExprBuilder objective = LinearExpr.newBuilder();
        for (var a : associationsMap.keySet()) {
            var teachersAvailableIntervals = new ArrayList<Integer>();

            availabilityRepository.findAllByTeacherId(a.getTeacherId()).forEach(tai -> {
                if (/*tai.getTimeIntervals() == null || */tai.isAvailableAllDay()!=0) {
                    for (var interval : IntStream.range(1, 7).toArray()) {
                        teachersAvailableIntervals.add((tai.getId().getDayId() - 1) * 6 + interval);
                    }
                } else if(!tai.getTimeIntervals().isEmpty()){
                    var intervals = tai.getTimeIntervals().stream().map(i -> (tai.getId().getDayId() - 1) * 6 + i).collect(Collectors.toList());

                    teachersAvailableIntervals.addAll(intervals);
                }
            });


            int wantsProjector = 0;
            List<String> preferredRooms = new ArrayList<>();
            List<String> preferredBoards = new ArrayList<>();
            List<String> preferredDevices = new ArrayList<>();
            List<String> preferredBuildings = new ArrayList<>();


            var roomPreferences = roomsPreferencesRepository.findById(new RoomPreferencesPK(a.getTeacherId(), a.getClassId()));
            if (roomPreferences.isPresent()) {
                preferredRooms = roomPreferences.get().getPreferredRooms();
                wantsProjector = roomPreferences.get().getWantsProjector();
                preferredBoards = roomPreferences.get().getPreferredBoards();
                preferredDevices = roomPreferences.get().getPreferredDevices();
                preferredBuildings = roomPreferences.get().getPreferredBuildings();
            }

            for (var i : ALL_TIME_INTERVALS) {
                for (var r = 0; r < roomsNo; r++) {
                    var building = buildings.indexOf(rooms.get(r).getBuildingId());
                    long coeff = MAX_COEFFICIENT;
                    if (!teachersAvailableIntervals.isEmpty()&&!teachersAvailableIntervals.contains(i)) {
                        coeff -= 30;
                    }
                    if (!preferredRooms.isEmpty()&&!preferredRooms.contains(rooms.get(r).getId())) {
                        coeff -= 15;
                    }

                    if (!preferredBoards.isEmpty() && noCommonElements(preferredBoards, rooms.get(r).getBoards())) {
                        coeff -= 10;
                    }

                    if (!preferredDevices.isEmpty() && noCommonElements(preferredDevices, rooms.get(r).getDevices())) {
                        coeff -= 10;
                    }
                    if (wantsProjector == 1 && rooms.get(r).getProjector() == 0) {
                        coeff -= 15;
                    }

//                    if (!preferredBuildings.isEmpty() && !preferredBuildings.contains(rooms.get(r).getBuildingId())) {
//                        coeff -= 10;
//                    }

                    // The room capacity should be greater than the number
                    // of members in the formation, but we would like it
                    // to have a plus of maximum 20% places
                    int membersNo = formationsMap.get(a.getFormationId()).getMembers();
                    if (rooms.get(r).getCapacity() >= membersNo + 0.2 * membersNo) {
                        coeff -= 20;
                    }


                    if (classesMap.get(a.getClassId()).getFrequency() == 1 && constraintVarsMap.get(new AssignmentsVariableKey(a, i, r, building, 0)) != null) {
                        objective.addTerm(constraintVarsMap.get(new AssignmentsVariableKey(a, i, r, building, 0)), coeff);
                    } else if (constraintVarsMap.get(new AssignmentsVariableKey(a, i, r, building, 1)) != null) {
                        var first = constraintVarsMap.get(new AssignmentsVariableKey(a, i, r, building, 1));
                        var second = constraintVarsMap.get(new AssignmentsVariableKey(a, i, r, building, 2));
                        objective.addTerm(LinearExpr.sum(
                                new BoolVar[]{(BoolVar) first, (BoolVar) second}), coeff);
                    }
                }
            }
        }
        model.maximize(objective);
    }

    private void addHardConstraints() {
        // CONSTRAINT: add exactly one assignment for each (class, teacher, formation) tuple
        for (var a : associationsMap.keySet()) {
            List<Literal> exactlyOneAssignmentList = new ArrayList<>();
            for (var i : ALL_TIME_INTERVALS) {
                for (var r = 0; r < roomsNo; r++) {
                    // CONSTRAINT: Room capacity constraint: roomCapacity >= formationMembersNo
                    var fittingRoomCapacity = formationsMap.get(a.getFormationId()).getMembers() <= rooms.get(r).getCapacity();
                    var b = buildings.indexOf(rooms.get(r).getBuildingId());
                    if (fittingRoomCapacity) {
                        if (classesMap.get(a.getClassId()).getFrequency() == 1) {
                            var key = new AssignmentsVariableKey(a, i, r, b, 0);
                            var value = model.newBoolVar("interval_a" + associationsMap.get(a) + "_i" + i + "_r" + r + "_b" + b + "_weekly");
                            constraintVarsMap.add(key, value);

                            exactlyOneAssignmentList.add(value);

                            consecutiveIntervalsAssigments.computeIfAbsent(new Tuple<>(a.getTeacherId(), b, i, 0), k -> new ArrayList<>()).add(value);
                        } else {
                            var key1 = new AssignmentsVariableKey(a, i, r, b, 1);
                            var value1 = model.newBoolVar("interval_a" + associationsMap.get(a) + "_i" + i + "_r" + r + "_b" + b + "_week1");
                            constraintVarsMap.add(key1, value1);

                            exactlyOneAssignmentList.add(value1);
                            consecutiveIntervalsAssigments.computeIfAbsent(new Tuple<>(a.getTeacherId(), b, i, 1), k -> new ArrayList<>()).add(value1);


                            var key2 = new AssignmentsVariableKey(a, i, r, b, 2);
                            var value2 = model.newBoolVar("interval_a" + associationsMap.get(a) + "_i" + i + "_r" + r + "_b" + b + "_week2");
                            constraintVarsMap.add(key2, value2);

                            exactlyOneAssignmentList.add(value2);
                            consecutiveIntervalsAssigments.computeIfAbsent(new Tuple<>(a.getTeacherId(), b, i, 2), k -> new ArrayList<>()).add(value2);

                        }
                    }
                }
            }
            model.addExactlyOne(exactlyOneAssignmentList);
        }
        System.out.println("============ ADDED EXACTLY ONE ASSIGNMENT ...");


        // CONSTRAINT: Teacher's consecutive intervals should be in the same building
        System.out.println("========= TEACHERS " + teachersMap.keySet().size());
        for (var teacherId : teachersMap.keySet()) {
            for (var i : ALL_INTERVALS_NOT_AT_THE_END_OF_DAY) {
                for (var b : IntStream.range(0, buildings.size()).toArray()) {
                    if (consecutiveIntervalsAssigments.containsKey(new Tuple<>(teacherId, b, i, 1))
                            || consecutiveIntervalsAssigments.containsKey(new Tuple<>(teacherId, b, i, 2))
                            || consecutiveIntervalsAssigments.containsKey(new Tuple<>(teacherId, b, i, 0))) {
                        List<Literal> teacherActivityInWeek1 = consecutiveIntervalsAssigments.get(new Tuple<>(teacherId, b, i, 1));
                        List<Literal> teacherActivityInWeek2 = consecutiveIntervalsAssigments.get(new Tuple<>(teacherId, b, i, 2));
                        List<Literal> teacherActivityInWeek0 = consecutiveIntervalsAssigments.get(new Tuple<>(teacherId, b, i, 0));

                        if (teacherActivityInWeek0 != null && teacherActivityInWeek1 != null && teacherActivityInWeek2 != null) {
                            teacherActivityInWeek2.addAll(teacherActivityInWeek0);
                            teacherActivityInWeek1.addAll(teacherActivityInWeek0);
                        }

                        var fromOtherBuildingW1 = new ArrayList<Literal>();
                        var fromOtherBuildingW2 = new ArrayList<Literal>();
                        var fromOtherBuildingW0 = new ArrayList<Literal>();

                        for (var building2 : IntStream.range(0, buildings.size()).filter(bld -> bld != b).toArray()) {
                            if (consecutiveIntervalsAssigments.containsKey(new Tuple<>(teacherId, building2, i + 1, 1))) {
                                fromOtherBuildingW1.addAll(consecutiveIntervalsAssigments.get(new Tuple<>(teacherId, building2, i + 1, 1)));
                            }

                            if (consecutiveIntervalsAssigments.containsKey(new Tuple<>(teacherId, building2, i + 1, 2))) {
                                fromOtherBuildingW2.addAll(consecutiveIntervalsAssigments.get(new Tuple<>(teacherId, building2, i + 1, 2)));
                            }

                            if (consecutiveIntervalsAssigments.containsKey(new Tuple<>(teacherId, building2, i + 1, 0))) {
                                fromOtherBuildingW0.addAll(consecutiveIntervalsAssigments.get(new Tuple<>(teacherId, building2, i + 1, 0)));
                            }

                            fromOtherBuildingW1.addAll(fromOtherBuildingW0);
                            fromOtherBuildingW2.addAll(fromOtherBuildingW0);
                        }

                        if (teacherActivityInWeek1 != null) {
                            var auxBool = model.newBoolVar("bool_help1_" + teacherId + b + i + 1);
                            model.addMaxEquality(auxBool, teacherActivityInWeek1);
                            model.addDifferent(LinearExpr.sum(fromListToArray(teacherActivityInWeek1)),
                                            LinearExpr.sum(fromListToArray(fromOtherBuildingW1)))
                                    .onlyEnforceIf(auxBool);
                        }

                        if (teacherActivityInWeek2 != null) {
                            var auxBool = model.newBoolVar("bool_help1_" + teacherId + b + i + 2);
                            model.addMaxEquality(auxBool, teacherActivityInWeek2);
                            model.addDifferent(LinearExpr.sum(fromListToArray(teacherActivityInWeek2)),
                                            LinearExpr.sum(fromListToArray(fromOtherBuildingW2)))
                                    .onlyEnforceIf(auxBool);
                        }
                    }
                }
            }
        }
        System.out.println("============ CONSECUTIVE INTERVALS IN DIFFERENT BUILDINGS...");

        // CONSTRAINT: prevent overlapping activities in a room at the same time
        for (var r = 0; r < roomsNo; r++) {
            for (var i : ALL_TIME_INTERVALS) {
                List<Literal> week1List = constraintVarsMap.getAllAssignmentsByWeekAndRoomAndTime(1, r, i);
                List<Literal> week2List = constraintVarsMap.getAllAssignmentsByWeekAndRoomAndTime(2, r, i);

                model.addAtMostOne(week1List);
                model.addAtMostOne(week2List);
            }
        }
        System.out.println("============ PREVENT OVERLAPPING ACTIVITIES IN A ROOM ...");


        // CONSTRAINT: prevent overlapping timetable entries for a teacher at the same time
        for (var teacherId : teachersMap.keySet()) {
            for (var i : ALL_TIME_INTERVALS) {
                List<Literal> week1List = constraintVarsMap.getAllAssignmentsByTeacherAndWeekAndTime(teacherId, 1, i);
                List<Literal> week2List = constraintVarsMap.getAllAssignmentsByTeacherAndWeekAndTime(teacherId, 2, i);

                model.addAtMostOne(week1List);
                model.addAtMostOne(week2List);
            }
        }
        System.out.println("============ PREVENT OVERLAPPING ACTIVITIES FOR A TEACHER ...");


        // CONSTRAINT: prevent overlapping timetable entries for a formation
        for (var formationId : formationsMap.keySet()) {
            for (var i : ALL_TIME_INTERVALS) {
                List<Literal> week1List = constraintVarsMap.getAllAssignmentsByFormationAndWeekAndTime(formationId, 1, i);
                List<Literal> week2List = constraintVarsMap.getAllAssignmentsByFormationAndWeekAndTime(formationId, 2, i);

                model.addAtMostOne(week1List);
                model.addAtMostOne(week2List);
            }
        }
        System.out.println("============ PREVENT OVERLAPPING ACTIVITIES FOR A FORMATION ...");


        // CONSTRAINT: prevent overlapping timetable entries for a year of study, its groups and subgroups
        for (var year : formationsMap.inverse().keySet()) {
            if (year.getType() == 1) { // formation is a year of study
                for (var group : formationsMap.inverse().keySet()) {
                    // formation type is a group
                    if (group.getType() == 2 && Objects.equals(group.getYear(), year.getCode())) {
                        for (var subgroup : formationsMap.inverse().keySet()) {
                            // formation is a subgroup
                            if (subgroup.getType() == 3 && Objects.equals(subgroup.getGroup(), group.getCode())) {
                                addNoOverlapsBetweenFormations(List.of(year, group, subgroup));
                            }
                        }
                    }
                }
            }
        }
        System.out.println("============ PREVENT OVERLAPPING ACTIVITIES FOR A YEAR AND ITS GROUPS ...");


        // CONSTRAINT: maximum number of hours per day for a teacher
        var maxNoHours = 10;
        for (var teacherId : teachersMap.keySet()) {
            for (var d : IntStream.range(1, Days.size()).toArray()) {
                List<Literal> dayInWeek1List = constraintVarsMap.getAllAssignmentsByTeacherAndWeekAndDay(teacherId, 1, d);
                List<Literal> dayInWeek2List = constraintVarsMap.getAllAssignmentsByTeacherAndWeekAndDay(teacherId, 2, d);

                var dayInWeek1Array = fromListToArray(dayInWeek1List);
                var dayInWeek2Array = fromListToArray(dayInWeek2List);

                model.addLessOrEqual(LinearExpr.sum(dayInWeek1Array), maxNoHours / 2);
                model.addLessOrEqual(LinearExpr.sum(dayInWeek2Array), maxNoHours / 2);
            }
        }
        System.out.println("============ MAX NO OF HOURS A DAY FOR A TEACHER...");


        // CONSTRAINT: maximum number of hours per day for a formation
        for (var formationId : formationsMap.keySet()) {
            for (var d : IntStream.range(1, Days.size()).toArray()) {
                List<Literal> dayInWeek1List = constraintVarsMap.getAllAssignmentsByFormationAndWeekAndDay(formationId, 1, d);
                List<Literal> dayInWeek2List = constraintVarsMap.getAllAssignmentsByFormationAndWeekAndDay(formationId, 2, d);

                var dayInWeek1Array = fromListToArray(dayInWeek1List);
                var dayInWeek2Array = fromListToArray(dayInWeek2List);

                model.addLessOrEqual(LinearExpr.sum(dayInWeek1Array), maxNoHours / 2);
                model.addLessOrEqual(LinearExpr.sum(dayInWeek2Array), maxNoHours / 2);
            }
        }
        System.out.println("============ MAX NO OF HOURS A DAY FOR A FORMATION...");
    }

    private Literal[] fromListToArray(List<Literal> list) {
        var array = new Literal[list.size()];
        var idx = 0;
        for (var nmrc : list) {
            array[idx] = nmrc;
            idx++;
        }

        return array;
    }

    private static <T> boolean noCommonElements(List<T> first, List<T> second) {
        for (var el : first) {
            if (second.contains(el)) {
                return false;
            }
        }
        return true;
    }
}
