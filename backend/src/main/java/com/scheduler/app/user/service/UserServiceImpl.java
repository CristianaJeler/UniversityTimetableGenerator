package com.scheduler.app.user.service;

import com.scheduler.app.authentication.jwt.LoggedInUserData;
import com.scheduler.app.user.dtos.PasswordChangeDTO;
import com.scheduler.app.user.dtos.UserEntityDTO;
import com.scheduler.app.user.mappers.UsersMapperInterface;
import com.scheduler.app.user.model.UserEntity;
import com.scheduler.app.user.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.hibernate.service.spi.ServiceException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Collection;
import java.util.LinkedList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class UserServiceImpl implements UserServiceInterface {
    @Autowired
    UserRepository userRepository;

    @Autowired
    UsersMapperInterface usersMapper;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Override
    public void setToken(String token, String username) {
        userRepository.setToken(token, username);
    }

    @Override
    public LoggedInUserData getLoggedInUserFromJWT(String jwt) {
        return usersMapper.mapToLoggedInUserData(userRepository.findUserEntityByToken(jwt));
    }


    @Override
    public void updateProfilePic(String picture, String token) {
        var decodedBase64 = Base64.getDecoder().decode(picture.substring(picture.indexOf(",") + 1).getBytes(StandardCharsets.UTF_8));
        userRepository.updateProfilePic(decodedBase64, token.trim());

    }


    @Override
    public UserEntityDTO getUserDTOByToken(String token) {
        return usersMapper.mapToUserEntityDTO(userRepository.findUserEntityByToken(token));
    }


    @Override
    public UserEntity getUserEntityByToken(String token) {
        return userRepository.findUserEntityByToken(token);
    }


    @Override
    public UserEntityDTO updateProfileDetails(UserEntityDTO user, String token) {
        var dbUser = userRepository.findUserEntityByToken(token);
        if (dbUser == null) throw new ServiceException("Unexisting user!");
        else {
            var id = dbUser.getId();
            if (user.getFirstName() != null && user.getFirstName().length() != 0)
                userRepository.updateFirstName(user.getFirstName(), id);
            else user.setFirstName(dbUser.getFirstName());

            if (user.getLastName() != null && user.getLastName().length() != 0)
                userRepository.updateLastName(user.getLastName(), id);
            else user.setLastName(dbUser.getLastName());

            return user;
        }
    }

    @Override
    public void updateUserPassword(PasswordChangeDTO oldAndNewPswd, String token) {
        var dbUser = userRepository.findUserEntityByToken(token);
        if (dbUser != null) {
            String oldPassword = oldAndNewPswd.getOldPassword();
            String newPassword = passwordEncoder.encode(oldAndNewPswd.getNewPassword());
            if (passwordEncoder.matches(oldPassword, dbUser.getPassword())) {
                userRepository.updatePassword(dbUser.getPassword(), newPassword, dbUser.getId());
            } else {
                throw new ServiceException("Parolă incorectă!");
            }
        } else {
            throw new ServiceException("Utilizator neautorizat!");
        }
    }


    @Override
    public UserEntity getUser(String userId) {
        var usr=userRepository.findById(userId);
        return usr.orElse(null);
    }

    @Override
    public UserEntity getUserByUsername(String username) {
        return userRepository.findUserEntityByUsername(username);
    }

    @Override
    public List<UserEntityDTO> getTeachers(int size, int page) {
        return userRepository.getTeachers(size, page)
                .stream()
                .map(t->new UserEntityDTO(t.getFirstName(), t.getLastName(),
                        t.getEmail(), t.getUsername(), t.getPicture(), t.getUserType()))
                .collect(Collectors.toList());
    }
}
