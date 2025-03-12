package com.wms.backend.features.user;

import com.wms.backend.response.ResponseHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.SQLException;

@RestController
@RequestMapping("user")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping(value = "sign-up", produces = "application/json")
    public ResponseEntity<Object> signup(@RequestBody UserModel user) throws SQLException{
        try{
            return userService.insertUser(user.getName(), user.getPassword(), user.getRole(), user.getEmail());
        } catch (Exception e){
            e.printStackTrace();
            return ResponseHelper.generateResponse("E002", null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
