package com.scheduler.app.user.dtos;

public class ProfilePictureDTO {
    String picture;

    public String getPicture() {
        return picture;
    }

    public void setPicture(String picture) {
        this.picture = picture;
    }

    @Override
    public String toString() {
        return picture;
    }
}
