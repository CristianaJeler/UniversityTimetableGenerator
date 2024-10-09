package com.scheduler.app.webSocketsUtils;


public class WSMessage<T> {
    T result;
    String type;

    public WSMessage(T payload, String type) {
        this.type=type;
        this.result = payload;
    }

    @Override
    public String toString() {
        return "{payload:"  + result.toString() +
                ", type:'" + type + '\'' +
                '}';
    }
}
