package com.scheduler.app.formations.model.formationsSubjects;


import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class FormationSubjectPK implements Serializable {
    @Column(name="year_id")
    String formationId;
    @Column(name="subject_id")
    String subjectId;

    public FormationSubjectPK() {
    }

    public FormationSubjectPK(String formationId, String subjectId) {
        this.formationId = formationId;
        this.subjectId = subjectId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        FormationSubjectPK that = (FormationSubjectPK) o;
        return formationId.equals(that.formationId) && subjectId.equals(that.subjectId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(subjectId, formationId);
    }

    public String getFormationId() {
        return formationId;
    }

    public void setFormationId(String formationId) {
        this.formationId = formationId;
    }

    public String getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(String subjectId) {
        this.subjectId = subjectId;
    }
}
