package com.coffeehub.coffee_hub_backend.service;

import com.coffeehub.coffee_hub_backend.model.Order;
import com.coffeehub.coffee_hub_backend.model.OrderItem;
import com.coffeehub.coffee_hub_backend.model.MenuItem;
import com.coffeehub.coffee_hub_backend.model.User;
import com.coffeehub.coffee_hub_backend.repository.OrderRepository;
import com.coffeehub.coffee_hub_backend.repository.MenuItemRepository;
import com.coffeehub.coffee_hub_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByOrderTimeDesc();
    }

    public List<Order> getOrdersByUser(Long userId) {
        Optional<User> user = userRepository.findById(userId);
        return user.map(value -> orderRepository.findByUserOrderByOrderTimeDesc(value))
                .orElse(List.of());
    }

    public List<Order> getOrdersByStatus(String status) {
        return orderRepository.findByStatus(status);
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    @Transactional
    public Order createOrder(Order order, Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        order.setUser(user.get());
        order.setOrderTime(LocalDateTime.now());
        order.setStatus("PENDING");

        double totalPrice = 0.0;
        for (OrderItem item : order.getOrderItems()) {
            Optional<MenuItem> menuItem = menuItemRepository.findById(item.getMenuItem().getId());
            if (menuItem.isEmpty()) {
                throw new RuntimeException("Menu item not found");
            }
            item.setMenuItem(menuItem.get());
            item.setPrice(menuItem.get().getPrice());
            item.setOrder(order);
            totalPrice += item.getPrice() * item.getQuantity();
        }

        order.setTotalPrice(totalPrice);
        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, String status) {
        Optional<Order> existingOrder = orderRepository.findById(orderId);
        if (existingOrder.isPresent()) {
            Order order = existingOrder.get();
            order.setStatus(status);

            if ("COMPLETED".equals(status) || "CANCELLED".equals(status)) {
                order.setCompletedTime(LocalDateTime.now());
            }

            return orderRepository.save(order);
        }
        throw new RuntimeException("Order not found");
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}