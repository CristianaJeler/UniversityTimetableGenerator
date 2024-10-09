package com.scheduler.app.user.dtos;

import lombok.Data;

import java.io.Serializable;
import java.util.Base64;


@Data
public class UserEntityDTO implements Serializable {
    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private String picture;
    private String userType;

    @Override
    public String toString() {
        return "UserEntityDTO{" +
                "firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", username='" + username + '\'' +
                ", picture='" + picture + '\'' +
                '}';
    }

    public UserEntityDTO(String firstName, String lastName, String email, String username, byte[] picture, String userType) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.username = username;
       this.picture = (picture == null) ? null : Base64.getEncoder().encodeToString(picture);
       this.userType = userType;

    }


    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }


    public String getUsername() {
        return username;
    }


    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setUsername(String username) {
        this.username = username;
    }


    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }
}
