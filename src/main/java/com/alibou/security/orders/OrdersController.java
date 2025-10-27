package com.alibou.security.orders;

import com.alibou.security.position.Position;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/orders")
public class OrdersController {
    private final OrdersService ordersService;

    public OrdersController(OrdersService ordersService) {
        this.ordersService = ordersService;
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        try {
            ordersService.deleteOrder(id);
            return ResponseEntity.ok().body(
                    Map.of("success", true, "message", "Order deleted successfully")
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    Map.of("success", false, "error", e.getMessage())
            );
        }
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
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getOrdersByUser(@PathVariable Long userId) {
        try {
            List<Orders> orders = ordersService.getOrdersByUserId(userId);

            List<OrdersResponse> response = orders.stream()
                    .map(OrdersResponse::new) // Используем конструктор с Orders
                    .toList();

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Ошибка при получении заказов пользователя: " + e.getMessage());
        }
    }

    private OrdersResponse convertToResponse(Orders order) {
        return OrdersResponse.builder()
                .id(order.getId())
                .name(order.getName())
                .customer(order.getCustomer())
                .quest(order.getQuest())
                .status(order.getStatus())
                .managerName(String.valueOf(order.getEmployee())) // или другой способ получения менеджера
                .build();
    }
    @PutMapping("/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestBody OrdersRequest request) {
        try {
            if (request.getStatus() == null) {
                return ResponseEntity.badRequest()
                        .body("Status field is required");
            }

            Orders updatedOrder = ordersService.updateOrderStatus(orderId, request.getStatus());

            // Используем конструктор с Orders
            OrdersResponse response = new OrdersResponse(updatedOrder);

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body("Ошибка при обновлении статуса заказа: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body("Внутренняя ошибка сервера");
        }
    }
}
