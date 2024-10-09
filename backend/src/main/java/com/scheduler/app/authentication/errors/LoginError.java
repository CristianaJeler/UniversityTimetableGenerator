package com.scheduler.app.authentication.errors;

public class LoginError extends Error{
    private String message;
    public LoginError(String message) {
        this.message=message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
