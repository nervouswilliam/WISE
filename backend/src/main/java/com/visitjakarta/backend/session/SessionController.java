package com.visitjakarta.backend.session;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;

@RestController
@RequestMapping("auth")
public class SessionController {
    @Autowired
    private SessionService sessionService;

    @GetMapping(value = "session-info/{sessionId}", produces = "application/json")
    private ResponseEntity<Object> getSessionInfo(@PathVariable String sessionId) throws JsonProcessingException, SQLException {
        return sessionService.getSessionInfo(sessionId);
    }
}
