package com.scheduler.app.user.service;


import com.scheduler.app.authentication.jwt.LoggedInUserData;
import com.scheduler.app.user.dtos.PasswordChangeDTO;
import com.scheduler.app.user.dtos.UserEntityDTO;
import com.scheduler.app.user.model.UserEntity;

import java.io.UnsupportedEncodingException;
import java.sql.SQLException;
import java.util.Collection;
import java.util.List;

public interface UserServiceInterface {
    /**
     *
     * @param token
     * @param username
     */
    void setToken(String token, String username);

    /**
     *
     * @param jwt
     * @return
     */
    LoggedInUserData getLoggedInUserFromJWT(String jwt);

    /**
     *
     * @param picture
     * @param token
     * @throws SQLException
     * @throws UnsupportedEncodingException
     */
    void updateProfilePic(String picture, String token) throws SQLException, UnsupportedEncodingException;

    /**
     *
     * @param token
     * @return
     */
    UserEntityDTO getUserDTOByToken(String token);

    /**
     *
     * @param user
     * @param token
     * @return
     */
    UserEntityDTO updateProfileDetails(UserEntityDTO user, String token);


    /**
     *
     * @param oldAndNewPswd
     * @param token
     */
    void updateUserPassword(PasswordChangeDTO oldAndNewPswd, String token);

    /**
     *
     * @param token
     * @return
     */
    UserEntity getUserEntityByToken(String token);

    UserEntity getUser(String userId);

    UserEntity getUserByUsername(String username);

    List<UserEntityDTO> getTeachers(int page, int size);
}
