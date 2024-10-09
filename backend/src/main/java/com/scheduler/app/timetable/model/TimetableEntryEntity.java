package com.scheduler.app.timetable.model;

import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "timetable")
@Data
public class TimetableEntryEntity implements Serializable {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "varchar")
    private String id;

    @Column(name = "teacher")
    private String teacher;

    @Column(name = "subject_name")
    private String subjectName;

    @Column(name = "class_type")
    private String classType;

    @Column(name = "formation")
    private String formation;

    @Column(name = "room")
    private String room;

    @Column(name = "day")
    private Integer day;

    @Column(name = "time")
    private Integer time;

    @Column(name = "week")
    private Integer week;


    @Override
    public String toString() {
        return "TimetableEntryEntity{" +
                "id='" + id + '\'' +
                ", teacher='" + teacher + '\'' +
                ", subjectName='" + subjectName + '\'' +
                ", classType='" + classType + '\'' +
                ", formation='" + formation + '\'' +
                ", room='" + room + '\'' +
                ", day=" + day +
                ", time=" + time +
                ", week=" + week +
                '}';
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTeacher() {
        return teacher;
    }

    public void setTeacher(String teacher) {
        this.teacher = teacher;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public String getClassType() {
        return classType;
    }

    public void setClassType(String classType) {
        this.classType = classType;
    }

    public String getFormation() {
        return formation;
    }

    public void setFormation(String formation) {
        this.formation = formation;
    }

    public String getRoom() {
        return room;
    }

    public void setRoom(String room) {
        this.room = room;
    }

    public Integer getDay() {
        return day;
    }

    public void setDay(Integer day) {
        this.day = day;
    }

    public Integer getTime() {
        return time;
    }

    public void setTime(Integer time) {
        this.time = time;
    }

    public Integer getWeek() {
        return week;
    }

    public void setWeek(Integer week) {
        this.week = week;
    }

    public TimetableEntryEntity() {
    }

    public TimetableEntryEntity(String teacher, String subjectName, String classType, String formation, String room, Integer day, Integer time, Integer week) {
        this.teacher = teacher;
        this.subjectName = subjectName;
        this.classType = classType;
        this.formation = formation;
        this.room = room;
        this.day = day;
        this.time = time;
        this.week = week;
    }
}
