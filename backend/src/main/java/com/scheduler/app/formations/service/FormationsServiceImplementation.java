package com.scheduler.app.formations.service;

import com.scheduler.app.formations.model.FormationEntity;
import com.scheduler.app.formations.repository.FormationsRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class FormationsServiceImplementation implements FormationsServiceInterface{
    @Autowired
    FormationsRepository formationsRepository;

    @Override
    public List<FormationEntity> getAllFormations(int type, int page, int size) {
        if(type!=0) return formationsRepository.getAllFormationByTypeAndPages(type/*, page, size*/);
        return formationsRepository.getAllFormations(page, size);
    }

    @Override
    public FormationEntity addNewFormation(FormationEntity formation) {
        System.out.println("========= FORMATION: "+formation);
        return formationsRepository.save(formation);
    }
}
