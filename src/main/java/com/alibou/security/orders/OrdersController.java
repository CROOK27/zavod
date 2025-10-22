package com.alibou.security.orders;

import com.alibou.security.position.Position;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/orders")
public class OrdersController {
    private final OrdersService ordersService;

    public OrdersController(OrdersService ordersService) {
        this.ordersService = ordersService;
    }

    @PostMapping
    public ResponseEntity<OrdersResponse> createOrder(@RequestBody OrdersRequest request) {
        try {
            Orders savedOrder = ordersService.createOrder(request);
            OrdersResponse response = new OrdersResponse(savedOrder);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrdersResponse> getOrderById(@PathVariable Long id) {
        Optional<Orders> order = ordersService.getOrderById(id);
        return order.map(o -> ResponseEntity.ok(new OrdersResponse(o)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<OrdersResponse> getAllOrders() {
        return ordersService.getAllOrders().stream()
                .map(OrdersResponse::new)
                .collect(Collectors.toList());
    }

}
