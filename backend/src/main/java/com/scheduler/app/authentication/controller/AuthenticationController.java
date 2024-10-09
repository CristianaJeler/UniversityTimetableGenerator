package com.scheduler.app.authentication.controller;

import com.scheduler.app.apiResponse.ApiResponse;
import com.scheduler.app.authentication.errors.ExistingCredentialsError;
import com.scheduler.app.authentication.errors.InvalidCredentialsError;
import com.scheduler.app.authentication.errors.LoginError;
import com.scheduler.app.authentication.jwt.LoggedInUserData;
import com.scheduler.app.authentication.jwt.TokenProvider;
import com.scheduler.app.authentication.service.AuthServiceInterface;
import com.scheduler.app.user.dtos.UserLoginDTO;
import com.scheduler.app.user.dtos.UserSignupDTO;
import com.scheduler.app.user.service.UserServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.logging.Logger;

@RestController
@CrossOrigin
@RequestMapping("/timetable/authentication")
public class AuthenticationController {
    private static final Logger logger = Logger.getLogger(AuthenticationController.class.getName());
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    AuthServiceInterface authService;
    @Autowired
    TokenProvider tokenProvider;

    @Autowired
    UserServiceInterface userService;

    @PostMapping(value = "/signup")
    ResponseEntity<?> signup(@RequestBody UserSignupDTO user) {
        try{
            authService.signup(user);
            return new ResponseEntity<>(new ApiResponse(null,true),HttpStatus.OK);
        }catch (InvalidCredentialsError | ExistingCredentialsError ex){
            return new ResponseEntity<>(new ApiResponse(ex.getMessage(),false),HttpStatus.OK);
        }
    }

    @PostMapping(value = "/login")
    ResponseEntity<?> login(@RequestBody UserLoginDTO user) {
        try{
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getUsername(),
                            user.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwt = tokenProvider.generateToken(authentication);
            userService.setToken(jwt, user.getUsername());
            LoggedInUserData loggedUser=userService.getLoggedInUserFromJWT(jwt);
            loggedUser.setToken(jwt);
            logger.info(loggedUser.toString());
            return ResponseEntity.ok(loggedUser);
        }catch (LoginError ex) {
            return new ResponseEntity<>(new ApiResponse(ex.getMessage(),false),HttpStatus.OK);
        }
    }
}