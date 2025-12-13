package com.pm.service;

import com.pm.model.User;
import com.pm.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    public Optional<User> findByEmail(String email) {
         return userRepository.findByEmail(email);
    }
}
