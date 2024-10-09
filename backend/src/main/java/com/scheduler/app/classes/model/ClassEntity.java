package com.scheduler.app.classes.model;


import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "classes")
@Data
public class ClassEntity implements Serializable {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "varchar")
    private String id;

    @Column(name = "subject_id")
    private String subjectId;
    @Column(name = "class_type")
    private Integer classType;
    @Column(name = "frequency")
    private Integer frequency;


    public ClassEntity() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(String subjectId) {
        this.subjectId = subjectId;
    }

    public Integer getClassType() {
        return classType;
    }

    public void setClassType(Integer classType) {
        this.classType = classType;
    }

    public ClassEntity(String id, String subjectId, Integer classType) {
        this.id = id;
        this.subjectId = subjectId;
        this.classType = classType;
    }

    @Override
    public String toString() {
        return "ClassEntity{" +
                "id='" + id + '\'' +
                ", subjectId='" + subjectId + '\'' +
                ", classType=" + classType +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ClassEntity)) return false;
        ClassEntity that = (ClassEntity) o;
        return Objects.equals(getId(), that.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }

    public Integer getFrequency() {
        return frequency;
    }

    public void setFrequency(Integer frequency) {
        this.frequency = frequency;
    }
}
