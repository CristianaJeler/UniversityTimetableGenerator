package com.scheduler.app.solver.utils.entity.timeIntervals;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class TeacherAvailableTimeIntervalsPK implements Serializable {
    @Column(name="teacher_id")
    String teacherId;
    @Column(name="day_id")
    Integer dayId;

    @Override
    public String toString() {
        return "TeacherAvailableTimeIntervalsPK{" +
                "teacherId='" + teacherId + '\'' +
                ", dayId='" + dayId + '\'' +
                '}';
    }

//    @Override
//    public boolean equals(Object o) {
//        if (this == o) return true;
//        if (!(o instanceof TeacherAvailableTimeIntervalsPK that)) return false;
//        return Objects.equals(getTeacherId(), that.getTeacherId()) && Objects.equals(getDayId(), that.getDayId());
//    }

    @Override
    public int hashCode() {
        return Objects.hash(getTeacherId(), getDayId());
    }

    public String getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
    }

    public Integer getDayId() {
        return dayId;
    }

    public void setDayId(Integer dayId) {
        this.dayId = dayId;
    }

    public TeacherAvailableTimeIntervalsPK() {
    }

    public TeacherAvailableTimeIntervalsPK(String teacherId, Integer dayId) {
        this.teacherId = teacherId;
        this.dayId = dayId;
    }
}
