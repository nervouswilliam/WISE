package com.wms.backend.session;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.wms.backend.features.user.UserModel;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;

@RestController
@RequestMapping("auth")
public class SessionController {
    @Autowired
    private SessionServiceImpl sessionService;

    @GetMapping(value = "session-info/{sessionId}", produces = "application/json")
    public ResponseEntity<Object> getSessionInfo(@PathVariable String sessionId) throws JsonProcessingException, SQLException {
        return sessionService.getSessionInfo(sessionId);
    }

    @PostMapping(value = "login", produces = "application/json")
    public ResponseEntity<Object> login(@RequestBody UserModel user) throws SQLException {
        return sessionService.login(user.getName(), user.getPassword());
    }

    @GetMapping(value = "who-am-i", produces = "application/json")
    public ResponseEntity<Object> whoAmI(ServletRequest request) {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String authHeader = httpRequest.getHeader("Authorization");
        return sessionService.whoAmI(authHeader, request);
    }

    @DeleteMapping(value = "logout", produces = "application/json")
    public ResponseEntity<Object> logout(ServletRequest request) {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String authHeader = httpRequest.getHeader("Authorization");
        return sessionService.logout(authHeader);
    }

}
