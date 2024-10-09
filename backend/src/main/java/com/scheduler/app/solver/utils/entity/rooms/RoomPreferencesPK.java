package com.scheduler.app.solver.utils.entity.rooms;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class RoomPreferencesPK implements Serializable {
    @Column(name="teacher_id")
    String teacherId;
    @Column(name="class_id")
    String classId;

    public RoomPreferencesPK(String teacherId, String classId) {
        this.teacherId = teacherId;
        this.classId = classId;
    }

    public RoomPreferencesPK() {
    }

    @Override
    public String toString() {
        return "TeacherAvailableTimeIntervalsPK{" +
                "teacherId='" + teacherId + '\'' +
                ", classId='" + classId + '\'' +
                '}';
    }

//    @Override
//    public boolean equals(Object o) {
//        if (this == o) return true;
//        if (!(o instanceof TeacherAvailableTimeIntervalsPK that)) return false;
//        return Objects.equals(getTeacherId(), that.getTeacherId()) && Objects.equals(getDayId(), that.getDayId());
//    }

    public String getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(String teacherId) {
        this.teacherId = teacherId;
    }

    public String getClassId() {
        return classId;
    }

    public void setClassId(String classId) {
        this.classId = classId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RoomPreferencesPK)) return false;
        RoomPreferencesPK that = (RoomPreferencesPK) o;
        return Objects.equals(getTeacherId(), that.getTeacherId()) && Objects.equals(getClassId(), that.getClassId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getTeacherId(), getClassId());
    }
}

