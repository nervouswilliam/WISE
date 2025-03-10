package com.wms.backend.session;

import lombok.Data;

@Data
public class SessionModel {
    public String sessionId;
    private String token;
    private String username;
    private String role;
    private int createdTime;
    private int expiredTime;
}
