package com.scheduler.app.formations.model;

public class AssociationResponseEntity {
    String id;
    String teacher;
    String formation;
    int classType;
    String subject;

    public AssociationResponseEntity(String teacher, String formation, int classType, String subject) {
        this.teacher = teacher;
        this.formation = formation;
        this.classType = classType;
        this.subject = subject;
    }

    public AssociationResponseEntity(int classType, String id, String teacher, String formation, String subject) {
        this.id = id;
        this.teacher = teacher;
        this.formation = formation;
        this.classType = classType;
        this.subject = subject;
    }

    public AssociationResponseEntity() {
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

    public String getFormation() {
        return formation;
    }

    public void setFormation(String formation) {
        this.formation = formation;
    }

    public int getClassType() {
        return classType;
    }

    public void setClassType(int classType) {
        this.classType = classType;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    @Override
    public String toString() {
        return "AssociationResponseEntity{" +
                "id='" + id + '\'' +
                ", teacher='" + teacher + '\'' +
                ", formation='" + formation + '\'' +
                ", classType=" + classType +
                ", subject='" + subject + '\'' +
                '}';
    }
}
