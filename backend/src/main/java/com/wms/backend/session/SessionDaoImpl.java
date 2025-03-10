package com.wms.backend.session;

import com.wms.backend.database.GenericDB;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.UUID;

@Repository
public class SessionDaoImpl {
    @Autowired
    private GenericDB genericDB;
    private final JdbcTemplate jdbcTemplate;
    private final Logger logger = LogManager.getLogger();

    public SessionDaoImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public SessionModel getSession(String sessionId) throws SQLException {
        String sql = "select * from \"session\" where sessionid = ?";
        logger.info("SQL:"+sql);
        return jdbcTemplate.queryForObject(sql, new SessionMapper(), sessionId);
    }

    public boolean checkUserSession(String username) throws SQLException{
        String sql = "select exists (select * from \"session\" s where s.username = ? limit 1)";
        logger.info("SQL: "+sql);
        return Boolean.TRUE.equals(jdbcTemplate.queryForObject(sql, boolean.class, username));
    }

    public String generateSession(String username, String role, String token, long createdTime, long expiredTime){
        String sql = "INSERT INTO \"session\" " +
                "(sessionid, \"token\", username, \"role\", created_time, expired_time)" +
                "VALUES(?,?,?,?,?,?)";
        logger.info("SQL: "+sql);
        String sessionId = String.valueOf(UUID.randomUUID());
        jdbcTemplate.update(sql, sessionId, token, username, role, createdTime, expiredTime);
        return sessionId;
    }

    public void updateSession(String username, String role, String token, long createdTime, long expiredTime){
        try{
            HashMap<String, Object> map = new HashMap<>();
            map.put("username", username);
            map.put("role", role);
            map.put("token", token);
            map.put("created_time", createdTime);
            map.put("expired_time", expiredTime);
            String whereClause = "username = '"+username+"'";
            genericDB.update("session", map, whereClause);
        } catch (Exception e){
            e.printStackTrace();
        }
    }

    public void deleteSession(String sessionId) {
        try{
            String whereClause = "sessionid = '"+sessionId+"'";
            genericDB.delete("session", whereClause);
        } catch (Exception e){
            e.printStackTrace();
        }
    }
}
