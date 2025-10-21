package com.alibou.security.orders;

import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class OrdersService {

    private final OrdersRepository ordersRepository;

    public OrdersService(OrdersRepository ordersRepository) {
        this.ordersRepository = ordersRepository;
    }
    public Optional<Orders> getUserById(Long id) {
        return ordersRepository.findById(id);
    }
    public Orders saveUnit(Orders orders) {
        return ordersRepository.save(orders);
    }
}
