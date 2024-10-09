package com.scheduler.app.user.mappers;

import com.scheduler.app.authentication.jwt.LoggedInUserData;
import com.scheduler.app.user.dtos.UserEntityDTO;
import com.scheduler.app.user.dtos.UserSignupDTO;
import com.scheduler.app.user.model.UserEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UsersMapperInterface {
    UserEntityDTO mapToUserEntityDTO(UserEntity user);
    UserEntity mapToUserEntity(UserSignupDTO user);
    LoggedInUserData mapToLoggedInUserData(UserEntity user);
}
