package com.wms.backend.session;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.wms.backend.general.JWTUtils;
import com.wms.backend.response.ResponseHelper;
import com.wms.backend.features.user.UserDaoImpl;
import com.wms.backend.features.user.UserModel;
import io.jsonwebtoken.Claims;
import jakarta.servlet.ServletRequest;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

@Service
public class SessionServiceImpl {
    @Autowired
    private SessionDaoImpl sessionDao;
    @Autowired
    private UserDaoImpl userDao;
    @Autowired
    private JWTUtils jwtUtils;
    private final Logger logger = LogManager.getLogger();

    public ResponseEntity<Object> getSessionInfo(String sessionId) throws JsonProcessingException, SQLException {
        SessionModel sessionModel = sessionDao.getSession(sessionId);
//        logger.info("model: {}", sessionModel.getSessionId());
        try{
            if(sessionId == null){
                return ResponseHelper.generateResponse("E003", null, HttpStatus.UNPROCESSABLE_ENTITY);
            }
            if(sessionModel == null){
                return ResponseHelper.generateResponse("E005", null, HttpStatus.NOT_FOUND);
            }
            return ResponseHelper.generateResponse("S001", sessionModel, HttpStatus.OK);
        } catch (Exception e){
            e.printStackTrace();
            return ResponseHelper.generateResponse("E002", null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<Object> login(String username, String password) throws SQLException {
        UserModel user = userDao.getUserInfo(username);
        try{
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
            String token = "";
            if(user.getPassword() != null && encoder.matches(password, user.getPassword())){
                Map<String, Object> claims = new HashMap<>();
                claims.put("username", user.getName());
                claims.put("role", user.getRole());
                claims.put("email", user.getEmail());
                token = jwtUtils.generateToken(claims);
            } else {
                return ResponseHelper.generateResponse("E006", null, HttpStatus.UNAUTHORIZED);
            }
            long createdTime = System.currentTimeMillis();
            long expiredTime = createdTime + (15*60*1000);
            if(sessionDao.checkUserSession(username)){
                String sessionId = sessionDao.getSessionIdByUsername(username);
                sessionDao.deleteSession(sessionId);
            }
            String sessionId = sessionDao.generateSession(username, user.getRole(), token, createdTime, expiredTime);
            if(sessionId == null){
                return ResponseHelper.generateResponse("E002", null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
            HashMap<String, Object> map = new HashMap<>();
            map.put("session-id", sessionId);
            return ResponseHelper.generateResponse("S001", map, HttpStatus.OK);
        } catch (Exception e){
            e.printStackTrace();
            return ResponseHelper.generateResponse("E002", null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public ResponseEntity<Object> whoAmI(String sessionId, ServletRequest request){
        SessionModel model = new SessionModel();
        try {
            logger.info("sessionId: {}", sessionId);
            SessionModel session = sessionDao.getSession(sessionId);
            Claims claims = jwtUtils.parseJWT(session.getToken());
            model.setSessionId(sessionId);
            model.setUsername(claims.get("username").toString());
            model.setRole(claims.get("role").toString());
            request.setAttribute("username",model.getUsername());
            request.setAttribute("role", model.getRole());
            request.setAttribute("email", claims.get("email").toString());
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        return ResponseHelper.generateResponse("S001", model, HttpStatus.OK);
    }

    public boolean validateToken(String sessionId) {
        try{
            logger.info("sessionId Validate Token: {}", sessionId);
            SessionModel model = sessionDao.getSession(sessionId);
            long expiredTime = model.getExpiredTime();
            long refreshTime = expiredTime - (5*60*1000);
            long currentTime = System.currentTimeMillis();
            if(currentTime > refreshTime){
                //refresh token
                Claims claims = jwtUtils.parseJWT(model.getToken());
                String newToken = jwtUtils.generateToken(claims);
                long newExpiredTime = currentTime + (15*60*1000);
                sessionDao.updateSession(claims.get("username").toString(), claims.get("role").toString(), newToken, currentTime, newExpiredTime);
            }
            else if(currentTime > expiredTime){
                //delete session
                sessionDao.deleteSession(sessionId);
                return false;
            }
            return true;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public ResponseEntity<Object> logout(String sessionId) {
        try{
            sessionDao.deleteSession(sessionId);
        } catch (Exception e){
            e.printStackTrace();
        }
        return ResponseHelper.generateResponse("S001", null, HttpStatus.OK);
    }
}
