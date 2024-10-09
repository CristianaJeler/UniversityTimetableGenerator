package com.scheduler.app.rooms.model;

import io.hypersistence.utils.hibernate.type.array.EnumArrayType;
import io.hypersistence.utils.hibernate.type.array.internal.AbstractArrayType;
import lombok.Data;
import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
enum Devices {Laptops, VR, Computers, Desktops, None}
enum Board_Type {Blackboard, Magnetic, Smart, Whiteboard, Interactive, None}
@Entity
@Table(name = "rooms")
@Data
@TypeDef(typeClass = EnumArrayType.class,
        defaultForType = Devices[].class,
        parameters = {
                @Parameter(
                        name = AbstractArrayType.SQL_ARRAY_TYPE,
                        value = "devices"
                )
        },
        name = "Device_Type")
@TypeDef(typeClass = EnumArrayType.class,
        defaultForType = Board_Type[].class,
        parameters = {
                @Parameter(
                        name = AbstractArrayType.SQL_ARRAY_TYPE,
                        value = "board_types"
                )
        },
        name = "Board_Type")
public class RoomEntity implements Serializable {


    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "varchar")
    private String id;

    @Column(name = "building_id")
    private String buildingId;
    @Column(name = "capacity")
    private Integer capacity;
    @Column(name = "code")
    private String code;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Column(name = "description")
    private String description;

    @Type(type = "Device_Type")
    @Column(name = "devices", columnDefinition = "devices")
    private Devices[] devices;

    @Type(type = "Board_Type")
    @Column(name = "boards", columnDefinition = "board_types")
    private Board_Type[] boards;

    public List<String> getDevices() {
        List<String> devs = new ArrayList<>();
        for(var d:devices) {
           devs.add(d.name());
        }

        return devs;
    }


    public List<String> getBoards() {
        List<String> boards = new ArrayList<>();
        for(var b:this.boards) {
            boards.add(b.name());
        }

        return boards;
    }


    public Integer getProjector() {
        return projector;
    }

    public void setProjector(Integer projector) {
        this.projector = projector;
    }

    @Column(name = "projector", columnDefinition = "integer")
    private Integer projector;



    public RoomEntity(String id, String buildingId, Integer capacity) {
        this.id = id;
        this.buildingId = buildingId;
        this.capacity = capacity;
    }

    public RoomEntity() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getBuildingId() {
        return buildingId;
    }

    public void setBuildingId(String buildingId) {
        this.buildingId = buildingId;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof RoomEntity)) return false;
        RoomEntity that = (RoomEntity) o;
        return Objects.equals(getId(), that.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId());
    }

    @Override
    public String toString() {
        return "RoomEntity{" +
                "id='" + id + '\'' +
                ", buildingId='" + buildingId + '\'' +
                ", capacity=" + capacity +
                '}';
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }
}