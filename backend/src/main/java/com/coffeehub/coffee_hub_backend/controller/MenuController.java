package com.coffeehub.coffee_hub_backend.controller;

import com.coffeehub.coffee_hub_backend.model.MenuItem;
import com.coffeehub.coffee_hub_backend.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "http://localhost:5173")
public class MenuController {

    @Autowired
    private MenuService menuService;

    @GetMapping("/all")
    public ResponseEntity<List<MenuItem>> getAllMenuItems() {
        try {
            List<MenuItem> items = menuService.getAllMenuItems();
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            System.err.println("Error fetching menu items: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/available")
    public ResponseEntity<List<MenuItem>> getAvailableMenuItems() {
        try {
            List<MenuItem> items = menuService.getAvailableMenuItems();
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            System.err.println("Error fetching available menu items: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<MenuItem>> getMenuItemsByCategory(@PathVariable String category) {
        try {
            List<MenuItem> items = menuService.getMenuItemsByCategory(category);
            return ResponseEntity.ok(items);
        } catch (Exception e) {
            System.err.println("Error fetching menu items by category: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getMenuItemById(@PathVariable Long id) {
        try {
            return menuService.getMenuItemById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            System.err.println("Error fetching menu item: " + e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/create")
    public ResponseEntity<?> createMenuItem(@RequestBody MenuItem menuItem) {
        try {
            MenuItem created = menuService.createMenuItem(menuItem);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            System.err.println("Error creating menu item: " + e.getMessage());
            return ResponseEntity.badRequest().body("Failed to create menu item: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMenuItem(@PathVariable Long id, @RequestBody MenuItem menuItem) {
        try {
            MenuItem updated = menuService.updateMenuItem(id, menuItem);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            System.err.println("Error updating menu item: " + e.getMessage());
            return ResponseEntity.badRequest().body("Failed to update menu item: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMenuItem(@PathVariable Long id) {
        try {
            menuService.deleteMenuItem(id);
            return ResponseEntity.ok("Menu item deleted successfully");
        } catch (Exception e) {
            System.err.println("Error deleting menu item: " + e.getMessage());
            return ResponseEntity.badRequest().body("Failed to delete menu item: " + e.getMessage());
        }
    }
}