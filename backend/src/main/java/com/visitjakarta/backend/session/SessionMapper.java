package com.visitjakarta.backend.session;

import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class SessionMapper implements RowMapper<SessionModel> {
    @Override
    public SessionModel mapRow(ResultSet rs, int rowNum) throws SQLException {
        SessionModel model = new SessionModel();
        model.setSessionId(rs.getString("sessionId"));
        model.setToken(rs.getString("token"));
        model.setUsername(rs.getString("username"));
        model.setRole(rs.getString("role"));
        model.setCreatedTime(rs.getInt("created_time"));
        model.setExpiredTime(rs.getInt("expired_time"));
        return model;
    }
}
