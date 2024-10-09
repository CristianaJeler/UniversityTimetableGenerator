package com.scheduler.app.subjects.service;


import com.scheduler.app.subjects.model.SubjectEntity;

import java.util.List;

public interface SubjectServiceInterface {
    List<SubjectEntity> searchSubjects(String searchCriteria, Integer page, Integer size);
    SubjectEntity addNewSubject(SubjectEntity subject);
    int updateSubject(SubjectEntity subject);

    List<SubjectEntity> getAllSubjects();
}
