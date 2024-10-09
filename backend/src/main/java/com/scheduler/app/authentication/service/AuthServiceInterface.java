package com.scheduler.app.authentication.service;


import com.scheduler.app.user.dtos.UserEntityDTO;
import com.scheduler.app.user.dtos.UserSignupDTO;

public interface AuthServiceInterface {
        UserEntityDTO signup(UserSignupDTO user);
}
