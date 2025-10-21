package com.alibou.security.orders;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrdersController {
    private final OrdersService ordersService;

    public OrdersController(OrdersService ordersService) {
        this.ordersService = ordersService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Orders> getUnitById(@PathVariable Long id){
        Optional<Orders> unit = ordersService.getUserById(id);
        return unit.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping
    public Orders createOrders (@RequestBody Orders orders){
        return ordersService.saveUnit(orders);
    }
}
