package com.wms.backend.cloudinary;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;

@Service
public class CloudinaryService {
    @Autowired
    private Cloudinary cloudinary;

    @Transactional
    public HashMap<String, String> uploadImage(File file) {
        try {
            // Read file bytes properly
            byte[] fileBytes = Files.readAllBytes(file.toPath());

            // Upload to Cloudinary
            Map uploadResult = cloudinary.uploader().upload(fileBytes, ObjectUtils.emptyMap());

            String publicId = uploadResult.get("public_id").toString();
            String url = uploadResult.get("secure_url").toString();

            // Delete temporary file after upload
            file.delete();

            HashMap<String, String> map = new HashMap<>();
            map.put("imageUrl", url);
            map.put("publicId", publicId);

            return map; // Returns the image URL
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image", e);
        }
    }

    @Transactional
    public String deleteImage(String publicId) {
        try {
            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            return result.get("result").toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete image", e);
        }
    }

    String detectImageFormat(String base64Image) {
        if (base64Image.startsWith("/9j/")) return ".jpg";  // JPEG
        if (base64Image.startsWith("iVBOR")) return ".png"; // PNG
        if (base64Image.startsWith("R0lG")) return ".gif";  // GIF
        if (base64Image.startsWith("UklGR")) return ".webp"; // WEBP
        return ".jpg"; // Default to JPG
    }
}
