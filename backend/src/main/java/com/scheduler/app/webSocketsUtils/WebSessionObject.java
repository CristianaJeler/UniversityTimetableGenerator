package com.scheduler.app.webSocketsUtils;

import org.springframework.web.socket.WebSocketSession;

public class WebSessionObject {
    WebSocketSession session;
    String userToken;

    public WebSessionObject(WebSocketSession session, String userToken) {
        this.session = session;
        this.userToken = userToken;
    }

    public WebSocketSession getSession() {
        return session;
    }

    public void setSession(WebSocketSession session) {
        this.session = session;
    }

    public String getUserToken() {
        return userToken;
    }

    public void setUserToken(String userToken) {
        this.userToken = userToken;
    }

    @Override
    public String toString() {
        return "WebSessionObject{" +
                "session=" + session +
                ", userToken='" + userToken + '\'' +
                '}';
    }
}
