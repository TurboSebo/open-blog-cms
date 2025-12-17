package com.github.openblogcms.controller;

import com.github.openblogcms.model.Image;
import com.github.openblogcms.repository.ImageRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/images")
public class ImageApiController {

    private final ImageRepository imageRepository;

    public ImageApiController(ImageRepository imageRepository) {
        this.imageRepository = imageRepository;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadImage(@RequestParam("file") MultipartFile file) {
        try {
            Image img = new Image(
                    file.getOriginalFilename(),
                    file.getContentType(),
                    file.getBytes()
            );
            Image saved = imageRepository.save(img);

            String imageUrl = "/api/images/" + saved.getId();
            Map<String, String> body = Collections.singletonMap("url", imageUrl);
            return ResponseEntity.ok(body);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable Long id) {
        return imageRepository.findById(id)
                .map(img -> ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_TYPE, img.getType())
                        .body(img.getData()))
                .orElse(ResponseEntity.notFound().build());
    }
}

