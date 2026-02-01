package com.pm.controller;

import com.pm.dto.UserPublicDTO;
import com.pm.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<UserPublicDTO> getUser(@PathVariable Long id) {
        return userService.findById(id)
                .map(user -> new UserPublicDTO(
                        user.getId(),
                        user.getDisplayName(),
                        user.getAvatarId()
                ))
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}