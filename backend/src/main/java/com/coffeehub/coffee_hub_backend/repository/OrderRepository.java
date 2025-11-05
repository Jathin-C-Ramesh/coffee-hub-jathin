package com.coffeehub.coffee_hub_backend.repository;

import com.coffeehub.coffee_hub_backend.model.Order;
import com.coffeehub.coffee_hub_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    List<Order> findByStatus(String status);
    List<Order> findByUserOrderByOrderTimeDesc(User user);
    List<Order> findAllByOrderByOrderTimeDesc();
}