package com.scheduler.app.subjects.service;

import com.scheduler.app.subjects.model.SubjectEntity;
import com.scheduler.app.subjects.repository.SubjectRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class SubjectServiceImpl implements SubjectServiceInterface {
    @Autowired
    SubjectRepository subjectRepository;

    public SubjectServiceImpl() {
    }


    @Override
    public List<SubjectEntity> searchSubjects(String searchCriteria, Integer page, Integer size) {
        if (searchCriteria.equals("000")) searchCriteria = "";
        Collection<SubjectEntity> subjects;
        subjects = subjectRepository.searchSubjects(searchCriteria, page, size);
        return new ArrayList<>(subjects);
    }

    @Override
    public SubjectEntity addNewSubject(SubjectEntity subject) {
        return subjectRepository.save(subject);
    }

    @Override
    public int updateSubject(SubjectEntity subject) {
        return subjectRepository.update(subject.getName(), subject.getCode());
    }

    @Override
    public List<SubjectEntity> getAllSubjects() {
        return subjectRepository.findAll();
    }
}
