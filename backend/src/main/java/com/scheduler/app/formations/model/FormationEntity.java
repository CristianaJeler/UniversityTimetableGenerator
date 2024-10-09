package com.scheduler.app.formations.model;


import lombok.Data;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Objects;

@Entity
@Table(name = "formations")
@Data
public class FormationEntity implements Serializable {
    @Id
//    @GeneratedValue(generator = "uuid2")
//    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "code", columnDefinition = "varchar")
    private String code;

    @Column(name = "year")
    private String year;
    @Column(name = "\"group\"")
    private String group;
    @Column(name = "type")
    private Integer type;
    @Column(name = "members")
    private Integer members;


    public FormationEntity() {
    }

    public FormationEntity(String code, String year, String group, Integer type, Integer members) {
        this.code = code;
        this.year = year;
        this.group = group;
        this.type = type;
        this.members = members;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getYear() {
        return year;
    }

    public void setYear(String year) {
        this.year = year;
    }

    public String getGroup() {
        return group;
    }

    public void setGroup(String group) {
        this.group = group;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Integer getMembers() {
        return members;
    }

    public void setMembers(Integer members) {
        this.members = members;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FormationEntity)) return false;
        FormationEntity that = (FormationEntity) o;
        return Objects.equals(getCode(), that.getCode());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getCode());
    }

    @Override
    public String toString() {
        return "FormationEntity{" +
                "code='" + code + '\'' +
                ", year='" + year + '\'' +
                ", group='" + group + '\'' +
                ", type=" + type +
                ", members=" + members +
                '}';
    }
}
