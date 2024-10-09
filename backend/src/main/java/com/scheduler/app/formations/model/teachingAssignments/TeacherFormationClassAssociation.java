package com.scheduler.app.formations.model.teachingAssignments;


import com.scheduler.app.formations.model.FormationEntity;
import com.scheduler.app.user.model.UserEntity;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "teachers_formations_classes")
@Data
public class TeacherFormationClassAssociation implements Serializable {
    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "varchar")
    private String id;
    @Column(name = "teacher_id", columnDefinition = "varchar")
    private String teacherId;
    @Column(name = "class_id", columnDefinition = "varchar")
    private String classId;
    @Column(name = "formation_id", columnDefinition = "varchar")
    private String formationId;


    public TeacherFormationClassAssociation() {

    }

    public TeacherFormationClassAssociation(String teacherId, String classId, String formationId) {
        this.teacherId = teacherId;
        this.classId = classId;
        this.formationId = formationId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public TeacherFormationClassAssociation(String id) {
        this.id = id;
    }


    @Override
    public String toString() {
        return "FormationsSubjectsEntity{" +
                "id=" + id ;
    }


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

    public String getFormationId() {
        return formationId;
    }

    public void setFormationId(String formationId) {
        this.formationId = formationId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TeacherFormationClassAssociation)) return false;
        TeacherFormationClassAssociation that = (TeacherFormationClassAssociation) o;
        return Objects.equals(getId(), that.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }
}
