package com.pm.chatservice.service;

import com.pm.chatservice.repository.DialogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DialogService {
    private DialogRepository dialogRepository;
}
