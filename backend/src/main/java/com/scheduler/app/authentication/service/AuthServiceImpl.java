package com.scheduler.app.authentication.service;


import com.scheduler.app.authentication.errors.AuthValidator;
import com.scheduler.app.authentication.errors.ExistingCredentialsError;
import com.scheduler.app.authentication.errors.InvalidCredentialsError;
import com.scheduler.app.user.dtos.UserEntityDTO;
import com.scheduler.app.user.dtos.UserSignupDTO;
import com.scheduler.app.user.mappers.UsersMapperInterface;
import com.scheduler.app.user.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthServiceImpl implements AuthServiceInterface {

    @Autowired
    UserRepository userRepository;

    @Autowired
    UsersMapperInterface entityMapper;

    @Autowired
    PasswordEncoder passwordEncoder;


    @Override
    public UserEntityDTO signup(UserSignupDTO user) {
        switch(validation(user)){
            case VALID_INPUTS:
                break;
            case INVALID_EMAIL:
                throw new InvalidCredentialsError("Invalid email!");
            case INVALID_PASSWORD:
                throw new InvalidCredentialsError("Invalid password!");
            case INVALID_USERNAME:
                throw new InvalidCredentialsError("Invalid username!");
            case EXISTING_EMAIL:
                throw new ExistingCredentialsError("Existing email!");
            case EXISTING_USERNAME:
                throw new ExistingCredentialsError("Existing username!");
        }

        String encodedPasswd=passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPasswd);

        var res= userRepository.save(
                        entityMapper.mapToUserEntity(user));

        userRepository.setToken("token_"+res.getId(), res.getUsername());

        return entityMapper.mapToUserEntityDTO(res);
    }


    public AuthValidator validation(UserSignupDTO user){
        final String EMAIL_REGEX="^[a-z._A-Z]+[0-9]*@[a-zA-Z]+.[a-zA-Z]{2,6}$";
        final String USERNAME_REGEX="^[a-zA-Z_.0-9]{7,20}$";
        final String PASSWORD_REGEX="^[a-zA-Z_.0-9]{7,20}$";

        if(userRepository.existsByEmail(user.getEmail())) return AuthValidator.EXISTING_EMAIL;
        if(userRepository.existsByUsername(user.getUsername())) return AuthValidator.EXISTING_USERNAME;
        if(!user.getEmail().matches(EMAIL_REGEX)) return AuthValidator.INVALID_EMAIL;
        if(!user.getUsername().matches(USERNAME_REGEX)) return AuthValidator.INVALID_USERNAME;
        if(!user.getPassword().matches(PASSWORD_REGEX)) return AuthValidator.INVALID_PASSWORD;
        return AuthValidator.VALID_INPUTS;
    }
}
