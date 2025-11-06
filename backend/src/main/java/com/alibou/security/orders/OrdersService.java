package com.alibou.security.orders;

import com.alibou.security.employee.Employee;
import com.alibou.security.employee.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor // Эта аннотация автоматически создает конструктор
public class OrdersService {

    private final OrdersRepository ordersRepository;
    private final EmployeeRepository employeeRepository;

    public Optional<Orders> getOrderById(Long id) {
        return ordersRepository.findById(id); // Нестатический вызов
    }

    public Orders saveUnit(Orders orders) {
        return ordersRepository.save(orders); // Нестатический вызов
    }

    public List<Orders> getAllOrders() {
        return ordersRepository.findAll(Sort.by(Sort.Direction.ASC, "name")); // Нестатический вызов
    }

    public Orders createOrder(OrdersRequest request) {
        // ВАЖНО: проверяем что managerId не null
        if (request.getManagerId() == null) {
            throw new IllegalArgumentException("Manager ID is required");
        }

        // Находим менеджера по ID
        Employee manager = employeeRepository.findById(request.getManagerId())
                .orElseThrow(() -> new RuntimeException("Manager not found with id: " + request.getManagerId()));

        // Создаем заказ с ВСЕМИ полями
        Orders order = Orders.builder()
                .name(request.getName())
                .customer(request.getCustomer())
                .quest(request.getQuest())
                .employee(manager)
                .status("pending")
                .build();

        return ordersRepository.save(order);
    }
    public List<Orders> getOrdersByUserId(Long userId) {
        return ordersRepository.findByUserId(userId);
    }
    public Orders updateOrderStatus(Long orderId, String status) {
        Orders order = ordersRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        order.setStatus(status);
        return ordersRepository.save(order);
    }
    public void deleteOrder(Long id) {
        Orders order = ordersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        ordersRepository.delete(order);
    }

}