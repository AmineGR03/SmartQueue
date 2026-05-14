package com.smartqueue.service.impl;

import com.smartqueue.dto.UserDTO;
import com.smartqueue.entity.User;
import com.smartqueue.exception.ResourceNotFoundException;
import com.smartqueue.repository.UserRepository;
import com.smartqueue.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDTO::fromEntity)
                .toList();
    }

    @Override
    public UserDTO getUserById(Long id) {
        return userRepository.findById(id)
                .map(UserDTO::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }

    @Override
    @Transactional
    public UserDTO updateUser(Long id, UserDTO updates) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (updates.getFirstName() != null && !updates.getFirstName().isEmpty()) {
            user.setFirstName(updates.getFirstName());
        }
        if (updates.getLastName() != null && !updates.getLastName().isEmpty()) {
            user.setLastName(updates.getLastName());
        }
        if (updates.getPhone() != null) {
            user.setPhone(updates.getPhone());
        }

        User updated = userRepository.save(user);
        return UserDTO.fromEntity(updated);
    }
}
