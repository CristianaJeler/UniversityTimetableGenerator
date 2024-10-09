package com.scheduler.app.user.dtos;


import lombok.Data;

@Data
public class UserSignupDTO {
    private String firstName;
    private String lastName;
    private String email;
    private String userType;
    private String username;
    private String password;

    public UserSignupDTO(String firstName, String lastName, String email, String userType, String username, String password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.userType = userType;
        this.username = username;
        this.password = password;
    }

    @Override
    public String toString() {
        return "UserEntity{" +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", status='" + userType + '\'' +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                '}';
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

    public String getUserType() {
        return userType;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
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
    public void setUserType(String status) {
        this.userType = status;
    }

    public void setUsername(String username) {this.username = username;}

    public void setPassword(String password) {
        this.password = password;
    }
}
