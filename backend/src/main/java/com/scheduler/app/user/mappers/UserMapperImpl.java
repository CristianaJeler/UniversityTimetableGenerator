package com.scheduler.app.user.mappers;

import com.scheduler.app.authentication.jwt.LoggedInUserData;
import com.scheduler.app.user.dtos.UserEntityDTO;
import com.scheduler.app.user.dtos.UserSignupDTO;
import com.scheduler.app.user.model.UserEntity;
import org.springframework.stereotype.Component;

@Component
public class UserMapperImpl implements UsersMapperInterface{
    @Override
    public UserEntityDTO mapToUserEntityDTO(UserEntity user) {
        return new UserEntityDTO(user.getFirstName(), user.getLastName(),user.getEmail(),user.getUsername(), user.getPicture(), user.getUserType());
    }

    @Override
    public UserEntity mapToUserEntity(UserSignupDTO user) {
        return new UserEntity(user.getFirstName(), user.getLastName(), user.getEmail(), user.getUserType(), user.getUsername(), user.getPassword(), user.getUserType());
    }

    @Override
    public LoggedInUserData mapToLoggedInUserData(UserEntity user) {
        return new LoggedInUserData(user.getToken(), user.getFirstName(), user.getLastName(), user.getPicture(), user.getUserType());
    }
}
