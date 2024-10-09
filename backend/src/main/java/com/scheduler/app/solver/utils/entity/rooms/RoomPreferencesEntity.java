package com.scheduler.app.solver.utils.entity.rooms;


import io.hypersistence.utils.hibernate.type.array.EnumArrayType;
import io.hypersistence.utils.hibernate.type.array.internal.AbstractArrayType;
import lombok.Data;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

enum Devices {Laptops, VR, Computers, Desktops, None}

enum Board_Type {Blackboard, Magnetic, Smart, Whiteboard, Interactive, None}

@Entity
@Table(name = "room_preferences")
@Data
@TypeDef(typeClass = EnumArrayType.class,
        defaultForType = Devices[].class,
        parameters = {
                @org.hibernate.annotations.Parameter(
                        name = AbstractArrayType.SQL_ARRAY_TYPE,
                        value = "devices"
                )
        },
        name = "Device_Type")
@TypeDef(typeClass = EnumArrayType.class,
        defaultForType = Board_Type[].class,
        parameters = {
                @org.hibernate.annotations.Parameter(
                        name = AbstractArrayType.SQL_ARRAY_TYPE,
                        value = "board_types"
                )
        },
        name = "Board_Type")
public class RoomPreferencesEntity implements Serializable {
    @EmbeddedId
    RoomPreferencesPK id;

    @Type(type = "list-array")
    @Column(name = "preferred_rooms", columnDefinition = "varchar[]")
    List<String> preferredRooms;

    @Type(type = "list-array")
    @Column(name = "preferred_buildings", columnDefinition = "varchar[]")
    List<String> preferredBuildings;

    @Type(type = "Device_Type")
    @Column(name = "preferred_devices", columnDefinition = "devices")
    Devices[] preferredDevices;

    @Type(type = "Board_Type")
    @Column(name = "preferred_boards", columnDefinition = "board_types")
    Board_Type[] preferredBoards;

    public List<String> getPreferredDevices() {
        List<String> devs = new ArrayList<>();
        for (var d : preferredDevices) {
            devs.add(d.name());
        }

        return devs;
    }


    public List<String> getPreferredBoards() {
        List<String> boards = new ArrayList<>();
        for (var b : this.preferredBoards) {
            boards.add(b.name());
        }

        return boards;
    }

    @Column(name = "wants_projector", columnDefinition = "integer")
    Integer wantsProjector;


    public RoomPreferencesPK getId() {
        return id;
    }

    public void setId(RoomPreferencesPK id) {
        this.id = id;
    }

    public List<String> getPreferredRooms() {
        return preferredRooms;
    }

    public void setPreferredRooms(List<String> preferred_rooms) {
        this.preferredRooms = preferred_rooms;
    }


    public Integer getWantsProjector() {
        return wantsProjector;
    }

    public void setWantsProjector(Integer wants_projector) {
        this.wantsProjector = wants_projector;
    }

    public List<String> getPreferredBuildings() {
        return preferredBuildings;
    }

    public void setPreferredBuildings(List<String> preferredBuildings) {
        this.preferredBuildings = preferredBuildings;
    }

    @Override
    public String toString() {
        return "RoomPreferencesEntity{" +
                "id=" + id +
                ", preferred_rooms=" + preferredRooms +
                ", preferredBoards=" + preferredBoards +
                '}';
    }
}
