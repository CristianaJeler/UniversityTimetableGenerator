package com.scheduler.app.formations.model.formationsSubjects;


import com.scheduler.app.formations.model.FormationEntity;
import com.scheduler.app.user.model.UserEntity;
import lombok.Data;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Table(name = "years_subjects")
@Data
public class FormationsSubjectsEntity implements Serializable {
    @EmbeddedId
    FormationSubjectPK id;

    @Column(name = "semester")
    Integer semester;

    @Column(name = "type")
    Integer type;

    public FormationsSubjectsEntity(UserEntity user, FormationEntity formation) {
        this.id=new FormationSubjectPK(user.getId(), formation.getCode());
    }

    public FormationsSubjectsEntity() {

    }

    public FormationsSubjectsEntity(FormationSubjectPK id) {
        this.id = id;
        this.semester=2;
        this.type=1;
    }


    @Override
    public String toString() {
        return "FormationsSubjectsEntity{" +
                "id=" + id ;
    }

    public FormationSubjectPK getId() {
        return id;
    }
}
