package com.scheduler.app.formations.service;

import com.scheduler.app.formations.model.FormationEntity;

import java.util.List;

public interface FormationsServiceInterface {
    List<FormationEntity> getAllFormations(int page, int size, int i);
    FormationEntity addNewFormation(FormationEntity formation);
}
