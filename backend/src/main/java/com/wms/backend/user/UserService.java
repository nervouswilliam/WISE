package com.wms.backend.user;

import com.wms.backend.response.ResponseHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.SQLException;

@Service
public class UserService {
    @Autowired
    private UserDaoImpl userDao;

    public ResponseEntity<Object> insertUser(String username, String password, String role, String email) throws SQLException{
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        try{
            String hashedPassword = encoder.encode(password);
            userDao.insertUser(username, hashedPassword, role, email);
            return ResponseHelper.generateResponse("S001", null, HttpStatus.OK);
        } catch (Exception e){
            e.printStackTrace();
            return ResponseHelper.generateResponse("E002", null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
