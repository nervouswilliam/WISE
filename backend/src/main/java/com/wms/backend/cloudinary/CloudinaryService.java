package com.wms.backend.cloudinary;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.Map;

@Service
public class CloudinaryService {
    @Autowired
    private Cloudinary cloudinary;

    public String uploadImage(File file) {
        try {
            // Read file bytes properly
            byte[] fileBytes = Files.readAllBytes(file.toPath());

            // Upload to Cloudinary
            Map uploadResult = cloudinary.uploader().upload(fileBytes, ObjectUtils.emptyMap());

            // Delete temporary file after upload
            file.delete();

            return uploadResult.get("secure_url").toString(); // Returns the image URL
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image", e);
        }
    }

    public String deleteImage(String publicId) {
        try {
            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            return result.get("result").toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete image", e);
        }
    }
}
