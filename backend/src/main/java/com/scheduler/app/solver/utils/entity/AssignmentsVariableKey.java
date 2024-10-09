package com.scheduler.app.solver.utils.entity;

import com.scheduler.app.formations.model.teachingAssignments.TeacherFormationClassAssociation;
import com.scheduler.app.rooms.model.RoomEntity;

import java.util.Objects;

public class AssignmentsVariableKey {
    TeacherFormationClassAssociation tfc;
    int timeInterval;
    int room;
    int building;
    int week;

    public AssignmentsVariableKey(TeacherFormationClassAssociation tfc, int timeInterval, int room, int building, int week) {
        this.tfc = tfc;
        this.timeInterval = timeInterval;
        this.room = room;
        this.building = building;
        this.week = week;
    }

    public void setTimeInterval(int timeInterval) {
        this.timeInterval = timeInterval;
    }

    public int getBuilding() {
        return building;
    }

    public void setBuilding(int building) {
        this.building = building;
    }

    public void setWeek(int week) {
        this.week = week;
    }

    @Override
    public String toString() {
        return "AssignmentsVariableKey{" +
                "tfc=" + tfc +
                ", timeInterval=" + timeInterval +
                ", room=" + room +
                ", building=" + building +
                ", week=" + week +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof AssignmentsVariableKey)) return false;
        AssignmentsVariableKey that = (AssignmentsVariableKey) o;
        return Objects.equals(getTfc().getFormationId(), that.getTfc().getFormationId())
                && Objects.equals(getTfc().getClassId(), that.getTfc().getClassId())
                && Objects.equals(getTfc().getTeacherId(), that.getTfc().getTeacherId())
                && Objects.equals(getTimeInterval(), that.getTimeInterval())
                && Objects.equals(getRoom(), that.getRoom())
                && Objects.equals(getWeek(), that.getWeek());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getTfc(), getTimeInterval(), getRoom(), getWeek());
    }

    public TeacherFormationClassAssociation getTfc() {
        return tfc;
    }

    public void setTfc(TeacherFormationClassAssociation tfc) {
        this.tfc = tfc;
    }

    public Integer getTimeInterval() {
        return timeInterval;
    }

    public void setTimeInterval(Integer timeInterval) {
        this.timeInterval = timeInterval;
    }

    public int getRoom() {
        return room;
    }

    public void setRoom(int room) {
        this.room = room;
    }

    public Integer getWeek() {
        return week;
    }

    public void setWeek(Integer week) {
        this.week = week;
    }

    public AssignmentsVariableKey() {
    }
}
