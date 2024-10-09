package com.scheduler.app.formations.model;

import java.io.Serializable;

public class TeachersClassesResponseEntity {
    private String classId;
    private int classType;
    private String subjectName;
    private String subjectId;


    public TeachersClassesResponseEntity() {
    }

    public TeachersClassesResponseEntity(String classId, int classType, String subjectName, String subjectId) {
        this.classId = classId;
        this.classType = classType;
        this.subjectName = subjectName;
        this.subjectId = subjectId;
    }

    public String getClassId() {
        return classId;
    }

    public void setClassId(String classId) {
        this.classId = classId;
    }

    public int getClassType() {
        return classType;
    }

    public void setClassType(int classType) {
        this.classType = classType;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public String getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(String subjectId) {
        this.subjectId = subjectId;
    }
}
