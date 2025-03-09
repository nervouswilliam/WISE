package com.visitjakarta.backend.response;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class ResponseHelper {
    public static String loadErrorCodes(String flag){
        try{
            ObjectMapper objectMapper = new ObjectMapper();
            Map<String, String> errorMap = objectMapper.readValue(
                    new ClassPathResource("error-codes.json").getFile(),
                    Map.class
            );
            return errorMap.get(flag);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
    public static ResponseEntity<Object> generateResponse(String flag, Object data ,HttpStatus status) {
        Map<String, String> errorSchema = new HashMap<>();
        Map<String, Object> response = new HashMap<>();
        errorSchema.put("error_code", flag);
        errorSchema.put("error_message", loadErrorCodes(flag));
        response.put("error_schema", errorSchema);
        response.put("output_schema", data);
        return new ResponseEntity<Object>(response, status);
    }


}
