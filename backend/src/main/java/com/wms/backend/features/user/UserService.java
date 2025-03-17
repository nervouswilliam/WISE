package com.wms.backend.features.user;

import com.wms.backend.general.CommonUtils;
import com.wms.backend.response.ResponseHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.sql.SQLException;
import java.util.HashMap;

@Service
public class UserService {
    @Autowired
    private UserDaoImpl userDao;

    public ResponseEntity<Object> insertUser(String username, String password, String role, String email, String imageUrl) throws SQLException{
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        try{
            String hashedPassword = encoder.encode(password);
            userDao.insertUser(username, hashedPassword, role, email, imageUrl);
            return ResponseHelper.generateResponse("S001", null, HttpStatus.OK);
        } catch (Exception e){
            e.printStackTrace();
            return ResponseHelper.generateResponse("E002", null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<Object> checkUserExist(String name){
        try{
            HashMap<String, Object> map = new HashMap<>();
            map.put("exist", userDao.checkUserExist(name));
            return ResponseHelper.generateResponse("S001", map, HttpStatus.OK);
        } catch (Exception e){
            CommonUtils.printErrorLog("SERVICE", this.getClass(), e);
            return ResponseHelper.generateResponse("E002", null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
