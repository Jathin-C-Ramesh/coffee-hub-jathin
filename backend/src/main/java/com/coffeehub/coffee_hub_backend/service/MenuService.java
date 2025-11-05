package com.coffeehub.coffee_hub_backend.service;

import com.coffeehub.coffee_hub_backend.model.MenuItem;
import com.coffeehub.coffee_hub_backend.repository.MenuItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MenuService {

    @Autowired
    private MenuItemRepository menuItemRepository;

    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    public List<MenuItem> getAvailableMenuItems() {
        return menuItemRepository.findByAvailable(true);
    }

    public List<MenuItem> getMenuItemsByCategory(String category) {
        return menuItemRepository.findByCategory(category);
    }

    public Optional<MenuItem> getMenuItemById(Long id) {
        return menuItemRepository.findById(id);
    }

    public MenuItem createMenuItem(MenuItem menuItem) {
        return menuItemRepository.save(menuItem);
    }

    public MenuItem updateMenuItem(Long id, MenuItem updatedMenuItem) {
        Optional<MenuItem> existing = menuItemRepository.findById(id);
        if (existing.isPresent()) {
            MenuItem menuItem = existing.get();
            menuItem.setName(updatedMenuItem.getName());
            menuItem.setCategory(updatedMenuItem.getCategory());
            menuItem.setPrice(updatedMenuItem.getPrice());
            menuItem.setDescription(updatedMenuItem.getDescription());
            menuItem.setEmoji(updatedMenuItem.getEmoji());
            menuItem.setAvailable(updatedMenuItem.getAvailable());
            return menuItemRepository.save(menuItem);
        }
        throw new RuntimeException("Menu item not found");
    }

    public void deleteMenuItem(Long id) {
        menuItemRepository.deleteById(id);
    }

    public void initializeDefaultMenu() {
        if (menuItemRepository.count() == 0) {
            // Coffee items
            MenuItem espresso = new MenuItem();
            espresso.setName("Espresso");
            espresso.setCategory("Coffee");
            espresso.setPrice(2.50);
            espresso.setDescription("Strong and bold coffee shot");
            espresso.setEmoji("☕");
            espresso.setAvailable(true);

            MenuItem cappuccino = new MenuItem();
            cappuccino.setName("Cappuccino");
            cappuccino.setCategory("Coffee");
            cappuccino.setPrice(3.50);
            cappuccino.setDescription("Espresso with steamed milk foam");
            cappuccino.setEmoji("☕");
            cappuccino.setAvailable(true);

            MenuItem latte = new MenuItem();
            latte.setName("Latte");
            latte.setCategory("Coffee");
            latte.setPrice(4.00);
            latte.setDescription("Smooth espresso with steamed milk");
            latte.setEmoji("🥛");
            latte.setAvailable(true);

            MenuItem americano = new MenuItem();
            americano.setName("Americano");
            americano.setCategory("Coffee");
            americano.setPrice(2.75);
            americano.setDescription("Espresso with hot water");
            americano.setEmoji("☕");
            americano.setAvailable(true);

            MenuItem mocha = new MenuItem();
            mocha.setName("Mocha");
            mocha.setCategory("Coffee");
            mocha.setPrice(4.50);
            mocha.setDescription("Espresso with chocolate and milk");
            mocha.setEmoji("🍫");
            mocha.setAvailable(true);

            MenuItem coldBrew = new MenuItem();
            coldBrew.setName("Cold Brew");
            coldBrew.setCategory("Coffee");
            coldBrew.setPrice(3.75);
            coldBrew.setDescription("Smooth cold-steeped coffee");
            coldBrew.setEmoji("🧊");
            coldBrew.setAvailable(true);

            // Food items
            MenuItem croissant = new MenuItem();
            croissant.setName("Croissant");
            croissant.setCategory("Food");
            croissant.setPrice(3.00);
            croissant.setDescription("Buttery, flaky pastry");
            croissant.setEmoji("🥐");
            croissant.setAvailable(true);

            MenuItem sandwich = new MenuItem();
            sandwich.setName("Sandwich");
            sandwich.setCategory("Food");
            sandwich.setPrice(6.50);
            sandwich.setDescription("Fresh deli sandwich");
            sandwich.setEmoji("🥪");
            sandwich.setAvailable(true);

            MenuItem bagel = new MenuItem();
            bagel.setName("Bagel");
            bagel.setCategory("Food");
            bagel.setPrice(2.50);
            bagel.setDescription("Toasted bagel with cream cheese");
            bagel.setEmoji("🥯");
            bagel.setAvailable(true);

            // Desserts
            MenuItem chocolateCake = new MenuItem();
            chocolateCake.setName("Chocolate Cake");
            chocolateCake.setCategory("Dessert");
            chocolateCake.setPrice(5.00);
            chocolateCake.setDescription("Rich chocolate layer cake");
            chocolateCake.setEmoji("🍰");
            chocolateCake.setAvailable(true);

            MenuItem cheesecake = new MenuItem();
            cheesecake.setName("Cheesecake");
            cheesecake.setCategory("Dessert");
            cheesecake.setPrice(5.50);
            cheesecake.setDescription("Creamy New York style");
            cheesecake.setEmoji("🍰");
            cheesecake.setAvailable(true);

            MenuItem cookie = new MenuItem();
            cookie.setName("Cookie");
            cookie.setCategory("Dessert");
            cookie.setPrice(2.00);
            cookie.setDescription("Freshly baked chocolate chip");
            cookie.setEmoji("🍪");
            cookie.setAvailable(true);

            // Save all at once
            menuItemRepository.saveAll(List.of(
                    espresso, cappuccino, latte, americano, mocha, coldBrew,
                    croissant, sandwich, bagel, chocolateCake, cheesecake, cookie
            ));
        }
    }

}