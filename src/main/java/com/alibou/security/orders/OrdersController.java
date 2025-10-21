package com.alibou.security.orders;

import com.alibou.security.position.Position;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/orders")
public class OrdersController {
    private final OrdersService ordersService;

    public OrdersController(OrdersService ordersService) {
        this.ordersService = ordersService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Orders> getOrderById(@PathVariable Long id){
        Optional<Orders> unit = ordersService.getOrderById(id);
        return unit.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @GetMapping
    public List<Orders> getAllOrders() {return ordersService.getAllOrders();}
    @PostMapping
    public Orders createOrders (@RequestBody Orders orders){
        return ordersService.saveUnit(orders);
    }

}
