package com.wms.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.wms.backend.general.JWTUtils;
import com.wms.backend.response.ResponseHelper;
import com.wms.backend.session.SessionServiceImpl;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Component
public class AuthFilter implements Filter {

    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private SessionServiceImpl sessionService;

    private final ObjectMapper objectMapper = new ObjectMapper();
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String authHeader = httpRequest.getHeader("Authorization");
        String requestURI = httpRequest.getRequestURI();

        List<String> excludedPaths = List.of("/auth/login", "/user/sign-up", "/auth/logout", "/auth/session-info", "/user/check-exist", "/api/upload-image");

        // Skip filtering for excluded paths
        if (excludedPaths.contains(requestURI)) {
            chain.doFilter(request, response);
            return;
        }

        if (authHeader == null) {
            Map<String, Object> jsonResponse = (Map<String, Object>) ResponseHelper
                    .generateResponse("E006", null, HttpStatus.UNAUTHORIZED)
                    .getBody();

            // Send the response manually
            sendJsonResponse(httpResponse, jsonResponse, HttpStatus.UNAUTHORIZED);
            return;
        }

        if(sessionService.validateToken(authHeader)){
            chain.doFilter(request, response);
        } else {
            // frontend lakukan logic logout saat dapet error code E006
            Map<String, Object> jsonResponse = (Map<String, Object>) ResponseHelper
                    .generateResponse("E006", null, HttpStatus.UNAUTHORIZED)
                    .getBody();

            // Send the response manually
            sendJsonResponse(httpResponse, jsonResponse, HttpStatus.UNAUTHORIZED);
        }

    }

    private void sendJsonResponse(HttpServletResponse response, Map<String, Object> responseBody, HttpStatus status)
            throws IOException {
        response.setContentType("application/json");
        response.setStatus(status.value());

        // Convert to JSON
        String jsonResponse = objectMapper.writeValueAsString(responseBody);

        // Write JSON response
        response.getWriter().write(jsonResponse);
        response.getWriter().flush();
    }
}
