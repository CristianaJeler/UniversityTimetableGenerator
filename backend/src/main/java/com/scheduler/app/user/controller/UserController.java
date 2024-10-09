package com.scheduler.app.user.controller;

import com.scheduler.app.apiResponse.ApiResponse;
import com.scheduler.app.authentication.jwt.JwtValues;
import com.scheduler.app.user.dtos.PasswordChangeDTO;
import com.scheduler.app.user.dtos.ProfilePictureDTO;
import com.scheduler.app.user.dtos.UserEntityDTO;
import com.scheduler.app.user.service.UserServiceInterface;
//import com.scheduler.app.webSocketsUtils.WebSocketConfig;
import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.sql.SQLException;
import java.util.Collection;
import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("/timetable/users")
public class UserController {
    @Autowired
    UserServiceInterface userService;

    @Autowired
    JwtValues jwtValues;


    @PutMapping(value = "/profilePic")
    public ResponseEntity<ProfilePictureDTO> updateProfilePic(@RequestBody ProfilePictureDTO picture, HttpServletRequest request) {
        String token = request.getHeader(jwtValues.getHEADER()).split(jwtValues.getTOKEN_TYPE())[1];
        try {
            userService.updateProfilePic(picture.getPicture(), token);
        } catch (SQLException | UnsupportedEncodingException throwables) {
            System.out.println("ERROR");
        }
        return ResponseEntity.ok(picture);
    }

    @GetMapping(value = "/details")
    public ResponseEntity<UserEntityDTO> getUserDetails(HttpServletRequest request) {
        String token = request.getHeader(jwtValues.getHEADER()).split(jwtValues.getTOKEN_TYPE())[1].trim();
        var user = userService.getUserDTOByToken(token);
        return ResponseEntity.ok(user);
    }

    @PutMapping(value = "/details")
    public ResponseEntity<UserEntityDTO> updateUserDetails(@RequestBody UserEntityDTO user, HttpServletRequest request) {
        String token = request.getHeader(jwtValues.getHEADER()).split(jwtValues.getTOKEN_TYPE())[1].trim();
        var userUpdated = userService.updateProfileDetails(user, token);
        return ResponseEntity.ok(userUpdated);
    }

    @PutMapping(value = "/pass")
    public ResponseEntity<ApiResponse> updateUserPassword(@RequestBody PasswordChangeDTO oldAndNewPswd, HttpServletRequest request) {
        String token = request.getHeader(jwtValues.getHEADER()).split(jwtValues.getTOKEN_TYPE())[1].trim();
        try {
            userService.updateUserPassword(oldAndNewPswd, token);
            return ResponseEntity.ok(new ApiResponse(null, true));
        } catch (ServiceException ex) {
            return ResponseEntity.ok(new ApiResponse(ex.getMessage(), false));
        }
    }

    @GetMapping(value = "/teachers/pg={page}&s={size}")
    public ResponseEntity<List<UserEntityDTO>> getTeachers(@PathVariable int page, @PathVariable int size) {
        var teachers = userService.getTeachers(page, size);
        System.out.println("TEACHERS: "+teachers);
        return ResponseEntity.ok(teachers);
    }
}
