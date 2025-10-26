package com.coffeehub.coffee_hub_backend.controller;

import com.coffeehub.coffee_hub_backend.model.User;
import com.coffeehub.coffee_hub_backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173") // Adjust port if your frontend runs on different port
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String password = request.get("password");
            String role = request.get("role");

            System.out.println("Register request - Username: " + username + ", Role: " + role);

            // Create User object
            User user = new User();
            user.setUsername(username);
            user.setPassword(password);
            user.setRole(role != null ? role : "CUSTOMER");

            // Register the user
            User registeredUser = userService.registerUser(user);

            System.out.println("User registered successfully with role: " + registeredUser.getRole());

            return ResponseEntity.ok(registeredUser);
        } catch (Exception e) {
            System.err.println("Registration error: " + e.getMessage());
            return ResponseEntity.badRequest().body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String username = request.get("username");
            String password = request.get("password");

            System.out.println("Login request for username: " + username);

            User user = userService.loginUser(username, password);

            if (user != null) {
                System.out.println("Login successful - Username: " + user.getUsername() + ", Role: " + user.getRole());
                return ResponseEntity.ok(user);
            } else {
                System.out.println("Login failed - Invalid credentials");
                return ResponseEntity.badRequest().body("Invalid username or password");
            }
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            return ResponseEntity.badRequest().body("Login failed: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        try {
            List<User> users = userService.getAllUsers();
            System.out.println("Fetched " + users.size() + " users");
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            System.err.println("Error fetching users: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            System.out.println("Deleting user with ID: " + id);
            userService.deleteUser(id);
            return ResponseEntity.ok("User deleted successfully");
        } catch (Exception e) {
            System.err.println("Error deleting user: " + e.getMessage());
            return ResponseEntity.badRequest().body("Failed to delete user: " + e.getMessage());
        }
    }
}