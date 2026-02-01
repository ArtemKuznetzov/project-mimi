package com.pm;

import com.pm.mediaservice.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@RequiredArgsConstructor
public class MediaServiceApplication implements CommandLineRunner {
    private final FileStorageService fileStorageService;

    public static void main(String[] args) {
        SpringApplication.run(MediaServiceApplication.class, args);
    }

    @Override
    public void run(String... args) {
        fileStorageService.initializeBucket();
    }
}