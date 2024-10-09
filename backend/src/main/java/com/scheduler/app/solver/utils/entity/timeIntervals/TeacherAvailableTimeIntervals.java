package com.scheduler.app.solver.utils.entity.timeIntervals;

import io.hypersistence.utils.hibernate.type.array.ListArrayType;
import lombok.Data;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "time_availability")
@Data
@TypeDef(name = "list-array", typeClass = ListArrayType.class)
public class TeacherAvailableTimeIntervals implements Serializable {
    @EmbeddedId
    TeacherAvailableTimeIntervalsPK id;

    @Column(name = "available_all_day")
    Integer availableAllDay;

    @Column(name = "max_hours")
    int maxHoursPerDay;

    @Type(type="list-array")
    @Column(name = "time_intervals", columnDefinition = "integer[]")
    private List<Integer> timeIntervals;


    @Override
    public String toString() {
        return "TeacherAvailableTimeIntervals{" +
                "id=" + id +
                ", availableAllDay=" + availableAllDay +
                ", timeIntervals=" + timeIntervals +
                '}';
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }

    public TeacherAvailableTimeIntervalsPK getId() {
        return id;
    }
    public int getMaxHoursPerDay() {
        return maxHoursPerDay;
    }

    public void setMaxHoursPerDay(int maxHoursPerDay) {
        this.maxHoursPerDay = maxHoursPerDay;
    }
    public void setId(TeacherAvailableTimeIntervalsPK id) {
        this.id = id;
    }

    public Integer isAvailableAllDay() {
        return availableAllDay;
    }

    public void setAvailableAllDay(Integer availableAllDay) {
        this.availableAllDay = availableAllDay;
    }

    public List<Integer> getTimeIntervals() {
        return timeIntervals;
    }

    public void setTimeIntervals(List<Integer> timeIntervals) {
        this.timeIntervals = timeIntervals;
    }

    public TeacherAvailableTimeIntervals() {
    }

    public TeacherAvailableTimeIntervals(TeacherAvailableTimeIntervalsPK id, Integer availableAllDay, List<Integer> timeIntervals) {
        this.id = id;
        this.availableAllDay = availableAllDay;
        this.timeIntervals = timeIntervals;
    }

    public Integer getAvailableAllDay() {
        return availableAllDay;
    }
}
