package com.scheduler.app.apiResponse;


import java.io.Serializable;

public class ApiResponse implements Serializable {
    String message;
    boolean succeeded;

    public ApiResponse(String message, boolean succeded) {
        this.message = message;
        this.succeeded = succeded;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSucceeded() {
        return succeeded;
    }

    public void setSucceeded(boolean succeded) {
        this.succeeded = succeded;
    }
}
