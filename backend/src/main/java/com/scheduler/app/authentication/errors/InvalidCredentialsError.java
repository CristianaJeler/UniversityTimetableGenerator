package com.scheduler.app.authentication.errors;

public class InvalidCredentialsError extends Error {
    private String message;
    public InvalidCredentialsError(String message) {
        this.message=message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
