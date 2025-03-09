package com.visitjakarta.backend.session;


public class SessionModel {
    public String sessionId;
    private String token;
    private String username;
    private String role;
    private int createdTime;
    private int expiredTime;

    public String getSessionId() {
        return sessionId;
    }

    public String getToken() {
        return token;
    }

    public String getUsername() {
        return username;
    }

    public String getRole() {
        return role;
    }

    public int getCreatedTime() {
        return createdTime;
    }

    public int getExpiredTime() {
        return expiredTime;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public void setCreatedTime(int createdTime) {
        this.createdTime = createdTime;
    }

    public void setExpiredTime(int expiredTime) {
        this.expiredTime = expiredTime;
    }

    public SessionModel () {}
}
