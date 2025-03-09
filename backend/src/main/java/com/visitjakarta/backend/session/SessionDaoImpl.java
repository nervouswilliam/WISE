package com.visitjakarta.backend.session;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.SQLException;

@Repository
public class SessionDaoImpl {
    private final JdbcTemplate jdbcTemplate;
    private final Logger logger = LogManager.getLogger();

    public SessionDaoImpl(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public SessionModel getSession(String sessionId) throws SQLException {
        String sql = "select * from \"session\" where sessionId = ?";
        logger.info("SQL:"+sql);
        return jdbcTemplate.queryForObject(sql, new SessionMapper(), sessionId);

//        return jdbcTemplate.queryForObject(sql, new Object[]{sessionId}, (rs, rowNum) ->
//                new SessionModel(
//                        rs.getString("sessionId"),
//                        rs.getString("token"),
//                        rs.getString("username"),
//                        rs.getString("role"),
//                        rs.getInt("created_time"),
//                        rs.getInt("expired_time")
//                )
//        );
    }
}
