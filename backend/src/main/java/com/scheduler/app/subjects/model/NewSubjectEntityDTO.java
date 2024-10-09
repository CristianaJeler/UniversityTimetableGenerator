package com.scheduler.app.subjects.model;

import java.io.Serializable;

public class NewSubjectEntityDTO implements Serializable {
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }


    public NewSubjectEntityDTO() {
    }

    public NewSubjectEntityDTO(String name, String code, int type) {
        this.name = name;
        this.code = code;
    }

    private String name;
    private String code;

    public SubjectEntity mapToSubjectEntity(){
        return new SubjectEntity(code, name);
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    @Override
    public String toString() {
        return "NewSubjectEntityDTO{" +
                "name='" + name + '\'' +
                ", code='" + code + '\'' +
                '}';
    }
}
