package com.wms.backend.features.user;

import com.wms.backend.cloudinary.CloudinaryService;
import com.wms.backend.database.GenericDB;
import com.wms.backend.general.CommonUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.web.multipart.MultipartFile;

import java.sql.SQLException;
import java.util.HashMap;

@Repository
public class UserDaoImpl {
    private final JdbcTemplate jdbcTemplate;
    private final Logger logger = LogManager.getLogger();

    @Autowired
    private GenericDB genericDB;

    @Autowired
    private CloudinaryService cloudinaryService;

    public UserDaoImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public UserModel getUserInfo(String username) throws SQLException{
        String sql = "select * from \"users\" where name = ?";
        logger.info("SQL:{}", sql);
        return jdbcTemplate.queryForObject(sql, new Object[]{username}, (rs, rowNum) ->{
            UserModel user = new UserModel();
            user.setId(rs.getInt("id"));
            user.setName(rs.getString("name"));
            user.setRole(rs.getString("role"));
            user.setPassword(rs.getString("password"));
            user.setEmail(rs.getString("email"));
            user.setCountryCode(rs.getString("country_code"));
            user.setPhoneNumber(rs.getString("phone_number"));
            return user;
        });
    }

    public String getUserImageUrl(String username) {
        String sql = "select image from users where name = ?";
        logger.info("SQL SELECT: {}", sql);
        return jdbcTemplate.queryForObject(sql, String.class, username);
    }

    public void insertUser(String username, String password, String email, String imageUrl, String countryCode, String phoneNumber) throws SQLException{
        try {
            HashMap<String, Object> data = new HashMap<>();
            data.put("name", username);
            data.put("password", password);
            data.put("role", "user");
            data.put("email", email);
            data.put("image", imageUrl);
            data.put("country_code", countryCode);
            data.put("phone_number", phoneNumber);
            logger.info("image: {}", imageUrl);
            genericDB.insert("users", data);
        } catch (Exception e){
            e.printStackTrace();
        }
    }

    public Boolean checkUserExist(String name) {
        String sql =  "select exists (select * from users where name = ? limit 1)";
        logger.info("SQL SELECT: {}", sql);
        try{
            return jdbcTemplate.queryForObject(sql, Boolean.class, name);
        } catch (Exception e){
            CommonUtils.printErrorLog("DAO", this.getClass(), e);
            return null;
        }
    }
}
