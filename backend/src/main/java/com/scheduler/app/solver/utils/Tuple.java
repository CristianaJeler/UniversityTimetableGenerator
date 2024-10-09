package com.scheduler.app.solver.utils;

import java.util.Objects;

public class Tuple<L,R,T,S> {

    private final L teacher;
    private final R building;
    private final T interval;
    private final S week;


    public Tuple(L teacher, R building, T interval, S week) {
        this.teacher = teacher;
        this.building = building;
        this.interval = interval;
        this.week = week;
    }

    @Override
    public String toString() {
        return "Tuple{" +
                "teacher=" + teacher +
                ", building=" + building +
                ", interval=" + interval +
                ", week=" + week +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Tuple)) return false;
        Tuple<?, ?, ?, ?> tuple = (Tuple<?, ?, ?, ?>) o;
        return Objects.equals(teacher, tuple.teacher) && Objects.equals(building, tuple.building) && Objects.equals(interval, tuple.interval) && Objects.equals(week, tuple.week);
    }

    @Override
    public int hashCode() {
        return Objects.hash(teacher, building, interval, week);
    }
}