package com.scheduler.app.webSocketsUtils;


import com.google.gson.Gson;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;


@Component
public class SocketMessageHandler extends TextWebSocketHandler {
    List<WebSessionObject> webSessions = new ArrayList<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session){
        System.out.println("CONNECTED "+session.getId());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status){
        System.out.println("CLOSES "+session.getId());
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) {
        var webSession=webSessions.stream().filter(ws->ws.getUserToken().equals(message.getPayload())).findFirst();
        var obj = new WebSessionObject(session, message.getPayload().toString());
        if(webSession.isPresent()){
            var index=-1;
            index=webSessions.indexOf(webSession.get());
            if(index!=-1) webSessions.set(index,obj);
            System.out.println(webSessions);
        }else{
            webSessions.add(obj);
            System.out.println(webSessions);
        }

    }

    public void sendMessage(String userToken, WSMessage<?> message) {
        var sessionOpt= webSessions.stream().filter(ws -> ws.userToken.equals(userToken)).findFirst();
        if (sessionOpt.isPresent()) {
            var session = sessionOpt.get();
            var gson=new Gson();
            try {
                session.getSession().sendMessage(new TextMessage(gson.toJson(message)));
                System.out.println("Msg Sent");
            } catch (IOException | IllegalStateException e) {
                System.out.println("YUP");
                e.printStackTrace();
            }
        }
    }
}
