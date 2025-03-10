package com.wms.backend.session;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.wms.backend.response.ResponseHelper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.sql.SQLException;

@Service
public class SessionServiceImpl {
    @Autowired
    private SessionDaoImpl sessionDao;
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
}
