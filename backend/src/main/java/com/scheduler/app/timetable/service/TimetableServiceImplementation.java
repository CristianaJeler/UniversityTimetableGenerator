package com.scheduler.app.timetable.service;

import com.scheduler.app.timetable.repository.TimetableRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class TimetableServiceImplementation {
    @Autowired
    TimetableRepository timetableRepository;
}
