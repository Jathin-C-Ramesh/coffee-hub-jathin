package com.coffeehub.coffee_hub_backend.service;

import com.coffeehub.coffee_hub_backend.model.User;
import com.coffeehub.coffee_hub_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Register a new user - UPDATED to accept role parameter
    public User registerUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Hash the password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Set role - if not provided, default to CUSTOMER
        if (user.getRole() == null || user.getRole().trim().isEmpty()) {
            user.setRole("CUSTOMER");
        }

        System.out.println("Saving user: " + user.getUsername() + " with role: " + user.getRole());

        return userRepository.save(user);
    }

    // Login user - return User object with role
    public User loginUser(String username, String rawPassword) {
        Optional<User> optionalUser = userRepository.findByUsername(username);

        if (optionalUser.isEmpty()) {
            return null;
        }

        User user = optionalUser.get();

        // Check if password matches
        if (passwordEncoder.matches(rawPassword, user.getPassword())) {
            System.out.println("Login successful for: " + username + " with role: " + user.getRole());
            return user;
        }

        return null;
    }

    // Authenticate a user (keeping for backward compatibility)
    public boolean authenticate(String username, String rawPassword) {
        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            return false;
        }

        User user = optionalUser.get();
        return passwordEncoder.matches(rawPassword, user.getPassword());
    }

    // Get user by username
    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    // Get all users (for Admin)
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Delete user by ID (for Admin)
    public void deleteUser(Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
        } else {
            throw new RuntimeException("User not found");
        }
    }
}