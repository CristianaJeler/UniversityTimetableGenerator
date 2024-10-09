package com.scheduler.app.solver.timetableGenerator;

import java.sql.Time;
import java.util.Arrays;
import java.util.List;
import java.util.stream.IntStream;

public final class Constants {
    public static final String[] ClassTypes = {
            "",
            "Lecture",
            "Seminar",
            "Laboratory"
    };

    public final static String[] TimeIntervals = {"DUMMY",
            "MONDAY 08:00-10:00", "MONDAY 10:00-12:00", "MONDAY 12:00-14:00", "MONDAY 14:00-16:00", "MONDAY 16:00-18:00", "MONDAY 18:00-20:00",
            "TUESDAY 08:00-10:00", "TUESDAY 10:00-12:00", "TUESDAY 12:00-14:00", "TUESDAY 14:00-16:00", "TUESDAY 16:00-18:00", "TUESDAY 18:00-20:00",
            "WEDNESDAY 08:00-10:00", "WEDNESDAY 10:00-12:00", "WEDNESDAY 12:00-14:00", "WEDNESDAY 14:00-16:00", "WEDNESDAY 16:00-18:00", "WEDNESDAY 18:00-20:00",
            "THURSDAY 08:00-10:00", "THURSDAY 10:00-12:00", "THURSDAY 12:00-14:00", "THURSDAY 14:00-16:00", "THURSDAY 16:00-18:00", "THURSDAY 18:00-20:00",
            "FRIDAY 08:00-10:00", "FRIDAY 10:00-12:00", "FRIDAY 12:00-14:00", "FRIDAY 14:00-16:00", "FRIDAY 16:00-18:00", "FRIDAY 18:00-20:00",
    };

    public final static List<String> Days = List.of(new String[]{"DUMMY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"});
    public final static List<String> Times = List.of(new String[]{"DUMMY", "08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00", "18:00-20:00"});

    public final static int[] ALL_TIME_INTERVALS = IntStream.range(1, TimeIntervals.length).toArray();
    public final static int[] ALL_INTERVALS_NOT_AT_THE_END_OF_DAY = Arrays.stream(ALL_TIME_INTERVALS).filter(i->i%6!=0).toArray();
public final static int[] ALL_DAYS =  IntStream.range(1, Days.size()).toArray();
public static final int TEACHER_MAX_HOURS = 5;
public static final int FORMATION_MAX_HOURS = 5;
    enum FREQUENCY{
        WEEKLY,
        WEEK_1,
        WEEK_2
    }

    public static long MAX_COEFFICIENT = 100;
}
