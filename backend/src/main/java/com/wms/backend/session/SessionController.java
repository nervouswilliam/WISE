package com.wms.backend.session;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.sql.SQLException;

@RestController
@RequestMapping("auth")
public class SessionController {
    @Autowired
    private SessionServiceImpl sessionService;

    @GetMapping(value = "session-info/{sessionId}", produces = "application/json")
    private ResponseEntity<Object> getSessionInfo(@PathVariable String sessionId) throws JsonProcessingException, SQLException {
        return sessionService.getSessionInfo(sessionId);
    }
}
