package com.wms.backend.features.user;

import com.wms.backend.database.GenericDB;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.SQLException;
import java.util.HashMap;

@Repository
public class UserDaoImpl {
    private final JdbcTemplate jdbcTemplate;
    private final Logger logger = LogManager.getLogger();

    @Autowired
    private GenericDB genericDB;

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
            return user;
        });
    }

    public String getUserImageUrl(String username) {
        String sql = "select image from users where name = ?";
        logger.info("SQL SELECT: {}", sql);
        return jdbcTemplate.queryForObject(sql, String.class, username);
    }

    public void insertUser(String username, String password, String role, String email) throws SQLException{
        try {
            HashMap<String, Object> data = new HashMap<>();
            data.put("name", username);
            data.put("password", password);
            data.put("role", role);
            data.put("email", email);
            genericDB.insert("users", data);
        } catch (Exception e){
            e.printStackTrace();
        }
    }
}
