package com.scheduler.app.authentication.jwt;

import lombok.Data;

import java.io.Serializable;
import java.util.Base64;

@Data
public class LoggedInUserData implements Serializable {
    private String token;
    private String firstName;
    private String lastName;
    private String picture;

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    private String userType;


    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    public LoggedInUserData(String token, String firstName, String lastName, byte[] picture, String userType) {
        this.token = token;
        this.firstName = firstName;
        this.lastName = lastName;
        if(picture!=null)
            this.picture= Base64.getEncoder().encodeToString(picture);
        this.userType = userType;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }


    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
