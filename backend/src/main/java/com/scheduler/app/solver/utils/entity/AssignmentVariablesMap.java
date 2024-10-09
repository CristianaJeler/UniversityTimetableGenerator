package com.scheduler.app.solver.utils.entity;

import com.google.ortools.sat.Literal;
import com.scheduler.app.rooms.model.RoomEntity;

import java.util.*;
import java.util.stream.Collectors;

public class AssignmentVariablesMap {
    Map<AssignmentsVariableKey, Literal>
            assignmentVariablesMap;

    public AssignmentVariablesMap() {
        assignmentVariablesMap = new HashMap<>();
    }

    public void add(AssignmentsVariableKey key,
                    Literal value) {
        assignmentVariablesMap.put(key, value);
    }

    public List<Literal> getAllAssignmentsByTeacherAndWeekAndDay(String teacherId, Integer week, Integer day) {
        var result = new ArrayList<Literal>();
        var timeIntervalMin = (day - 1) * 6 + 1;
        var timeIntervalMax = (day - 1) * 6 + 6;
        for (var key : assignmentVariablesMap.keySet()) {
            if (Objects.equals(key.getTfc().getTeacherId(), teacherId)
                    && (Objects.equals(key.getWeek(), week)
                    || Objects.equals(key.getWeek(), 0))
                    && (key.getTimeInterval() >= timeIntervalMin && key.getTimeInterval() <= timeIntervalMax))
                result.add(assignmentVariablesMap.get(key));
        }

        return result;
    }

    public List<Literal> getAllAssignmentsByTeacherAndWeekAndTime(String teacherId, Integer week, Integer time) {
        var result = new ArrayList<Literal>();
        for (var key : assignmentVariablesMap.keySet()) {
            if (Objects.equals(key.getTfc().getTeacherId(), teacherId)
                    && (Objects.equals(key.getWeek(), week)
                    || Objects.equals(key.getWeek(), 0))
                    && Objects.equals(key.getTimeInterval(), time))
                result.add(assignmentVariablesMap.get(key));
        }

        return result;
    }

    public List<Literal> getAllAssignmentsByWeekAndRoomAndTime(Integer week, int room, Integer time) {
        var result = new ArrayList<Literal>();

        for (var key : assignmentVariablesMap.keySet()) {
            if ((Objects.equals(key.getWeek(), week)
                    || Objects.equals(key.getWeek(), 0))
                    && Objects.equals(key.getRoom(), room)
                    && Objects.equals(key.getTimeInterval(), time))
                result.add(assignmentVariablesMap.get(key));
        }

        return result;
    }

    public List<Literal> getAllAssignmentsByFormationAndWeekAndDay(String formationId, Integer week, Integer day) {
        var result = new ArrayList<Literal>();
        var timeIntervalMin = (day - 1) * 6 + 1;
        var timeIntervalMax = (day - 1) * 6 + 6;
        for (var key : assignmentVariablesMap.keySet()) {
            if (Objects.equals(key.getTfc().getFormationId(), formationId)
                    && (Objects.equals(key.getWeek(), week)
                    || Objects.equals(key.getWeek(), 0))
                    && (key.getTimeInterval() >= timeIntervalMin && key.getTimeInterval() <= timeIntervalMax))
                result.add(assignmentVariablesMap.get(key));
        }

        return result;
    }

    public List<Literal> getAllAssignmentsByFormationAndWeekAndTime(String formationId, Integer week, Integer time) {
        var result = new ArrayList<Literal>();

        for (var key : assignmentVariablesMap.keySet()) {
            if (Objects.equals(key.getTfc().getFormationId(), formationId)
                    && (Objects.equals(key.getWeek(), week)
                    || Objects.equals(key.getWeek(), 0))
                    && Objects.equals(key.getTimeInterval(), time))
                result.add(assignmentVariablesMap.get(key));
        }

        return result;
    }

    public List<Literal> getAllAssignmentsByTeacherFromOtherBuildingsInIntervalAndWeek(String teacherId, Integer building, Integer time, int week) {
        var result = new ArrayList<Literal>();

        for (var key : assignmentVariablesMap.keySet()) {
            if (Objects.equals(key.getTfc().getTeacherId(), teacherId)
                    && (Objects.equals(key.getWeek(), week)
                    || Objects.equals(key.getWeek(), 0))
                    && Objects.equals(key.getTimeInterval(), time)
                    && !Objects.equals(key.getBuilding(), building))
                result.add(assignmentVariablesMap.get(key));
        }

        return result;
    }

    public List<Literal> getAllAssignmentsByTeacherAndBuildingAndWeekAndTime(String teacherId, int b, Integer week, Integer time) {
        var result = new ArrayList<Literal>();

        for (var key : assignmentVariablesMap.keySet()) {
            if (Objects.equals(key.getTfc().getTeacherId(), teacherId)
                    && (Objects.equals(key.getWeek(), week)
                    || Objects.equals(key.getWeek(), 0))
                    && Objects.equals(key.getTimeInterval(), time)
                    && Objects.equals(key.getBuilding(), b))
                result.add(assignmentVariablesMap.get(key));
        }

        return result;
    }


    public Literal get(AssignmentsVariableKey key) {
        return assignmentVariablesMap.get(key);
    }
}
