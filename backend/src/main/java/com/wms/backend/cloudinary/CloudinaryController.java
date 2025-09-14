package com.wms.backend.cloudinary;

import com.wms.backend.general.CommonUtils;
import com.wms.backend.response.ResponseHelper;
import org.apache.commons.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import java.io.File;
import java.io.FileOutputStream;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

@RestController
@RequestMapping("api")
public class CloudinaryController {
    @Autowired
    private CloudinaryService cloudinaryService;

    @PostMapping(value = "upload-image", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> uploadImage(@RequestBody Map<String, String> requestBody) {
        try {
            String base64Image = requestBody.get("image");
            if (base64Image == null || base64Image.isEmpty()) {
                return ResponseEntity.badRequest().body("No image provided.");
            }

            String fileFormat = cloudinaryService.detectImageFormat(base64Image);
            // Convert Base64 to File
            byte[] imageBytes = Base64.decodeBase64(base64Image);
            File tempFile = File.createTempFile("upload_", fileFormat);
            try (FileOutputStream fos = new FileOutputStream(tempFile)) {
                fos.write(imageBytes);
            }

            // Upload to Cloudinary
            HashMap<String, String> map = cloudinaryService.uploadImage(tempFile);
            if(tempFile.exists()) {
                Files.delete(tempFile.toPath()); // Clean up temp file
            }
            return ResponseHelper.generateResponse("S001", map, HttpStatus.OK);
        } catch (Exception e) {
            CommonUtils.printErrorLog("CONTROLLER", this.getClass(), e);
            return ResponseHelper.generateResponse("E002", null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(value = "update-image", produces = "application/json")
    public ResponseEntity<Object> updateImage(@RequestBody Map<String, String> requestBody){
        try{
            String base64Image = requestBody.get("image");
            if (base64Image == null || base64Image.isEmpty()) {
                return ResponseEntity.badRequest().body("No image provided.");
            }

            String fileFormat = cloudinaryService.detectImageFormat(base64Image);
            // Convert Base64 to File
            byte[] imageBytes = Base64.decodeBase64(base64Image);
            File tempFile = File.createTempFile("upload_", fileFormat);
            try (FileOutputStream fos = new FileOutputStream(tempFile)) {
                fos.write(imageBytes);
            }

            // Upload to Cloudinary
            HashMap<String, String> map = cloudinaryService.uploadImage(tempFile);
            if(tempFile.exists()) {
                Files.delete(tempFile.toPath()); // Clean up temp file
            }

            String publicId = requestBody.get("public_id");
            String result = cloudinaryService.deleteImage(publicId);
            System.out.println("result: "+result);
            if("ok".equals(result) || "not found".equals(result)){
                return ResponseHelper.generateResponse("S001", map, HttpStatus.OK);
            } else {
                return ResponseHelper.generateResponse("E002", null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e){
            CommonUtils.printErrorLog("CONTROLLER", this.getClass(), e);
            return ResponseHelper.generateResponse("E002", null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping(value = "delete-image", produces = "application/json")
    public ResponseEntity<Object> deleteImage(@RequestBody Map<String, String> requestBody){
        try{
            String publicId = requestBody.get("publicId");
            String result = cloudinaryService.deleteImage(publicId);
            if("ok".equals(result)){
                return ResponseHelper.generateResponse("S001", null, HttpStatus.OK);
            } else {
                return ResponseHelper.generateResponse("E002", null, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        } catch (Exception e){
            CommonUtils.printErrorLog("CONTROLLER", this.getClass(), e);
            return ResponseHelper.generateResponse("E002", null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
