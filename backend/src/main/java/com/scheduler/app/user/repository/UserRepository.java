package com.scheduler.app.user.repository;

import com.scheduler.app.user.model.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import javax.transaction.Transactional;
import java.util.Collection;
import java.util.List;


@Repository
public interface UserRepository extends JpaRepository<UserEntity, String> {
        @Modifying
        @Transactional
        @Query("update UserEntity user set user.token=:token where user.username=:username")
        void setToken(String token, String username);

        @Modifying
        @Transactional
        @Query("update UserEntity user set user.picture=:picture where user.token=:token")
        void updateProfilePic(byte[] picture, String token);

        @Modifying
        @Transactional
        @Query("update UserEntity user set user.lastName=:lastName where user.id=:id")
        void updateLastName(String lastName, String id);


        @Modifying
        @Transactional
        @Query("update UserEntity user set user.firstName=:firstName where user.id=:id")
        void updateFirstName(String firstName, String id);

        @Modifying
        @Transactional
        @Query("update UserEntity user set user.password=:newPswd where user.id=:id and user.password=:oldPswd")
        void updatePassword(String oldPswd, String newPswd, String id);

        boolean existsByEmail(String email);
        boolean existsByUsername(String username);

        UserEntity findByUsername(String username);

        UserEntity findUserEntityByToken(String token);

        @Transactional
        @Query(value = "select * "+
                " from users u where " +
                "(u.first_name ilike CONCAT(:searchCriteria,'%') " +
                "or u.last_name ilike CONCAT(:searchCriteria,'%') " +
                "or u.username ilike CONCAT(:searchCriteria,'%')) " +
                "order by u.first_name "+
                "limit :size offset :page*:size", nativeQuery = true)
        Collection<UserEntity> searchUsers(String searchCriteria, Integer page, Integer size);


        @Transactional
        @Query(value = "select * "+
                " from users u where " +
                "u.user_type = '1' " +
                "order by u.first_name "+
                "limit :size offset :page*:size ", nativeQuery = true)
        List<UserEntity> getTeachers(int page, int size);


        UserEntity findUserEntityByUsername(String username);
}
