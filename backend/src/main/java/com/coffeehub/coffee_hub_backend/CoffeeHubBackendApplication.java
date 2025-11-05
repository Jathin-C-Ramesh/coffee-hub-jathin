package com.coffeehub.coffee_hub_backend;

import com.coffeehub.coffee_hub_backend.service.MenuService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class CoffeeHubBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(CoffeeHubBackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(MenuService menuService) {
        return args -> {
            // Initialize default menu items on startup
            menuService.initializeDefaultMenu();
            System.out.println("Default menu items initialized");
        };
    }
}