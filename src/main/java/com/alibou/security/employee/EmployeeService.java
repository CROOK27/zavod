package com.alibou.security.employee;

import com.alibou.security.user.User;
import com.alibou.security.user.UserRepository;
import com.alibou.security.position.Position;
import com.alibou.security.position.PositionRepository;
import com.alibou.security.orders.Orders;
import com.alibou.security.orders.OrdersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final PositionRepository positionRepository;
    private final OrdersRepository ordersRepository;

    // Метод для создания сотрудника из DTO
    public Employee createEmployee(EmployeeRequest request) {
        // Валидация обязательных полей
        if (request.getUserId() == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (request.getPositionId() == null) {
            throw new IllegalArgumentException("Position ID cannot be null");
        }

        // Находим связанные сущности
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getUserId()));

        Position position = positionRepository.findById(request.getPositionId())
                .orElseThrow(() -> new RuntimeException("Position not found with id: " + request.getPositionId()));

        Orders orders = null;
        if (request.getOrdersId() != null) {
            orders = ordersRepository.findById(request.getOrdersId())
                    .orElse(null); // orders может быть optional
        }

        // Создаем нового сотрудника
        Employee employee = Employee.builder()
                .birthDate(request.getBirthDate())
                .gender(request.getGender())
                .hireDate(request.getHireDate())
                .rate(request.getRate())
                .user(user)
                .position(position)
                .orders(orders)
                .build();

        return employeeRepository.save(employee);
    }

    // Существующие методы остаются без изменений
    public List<Object[]> getAllNamesAndPhones() {
        return employeeRepository.findAllNamesAndPhones();
    }

    public List<String> getDistinctPositionNames() {
        return employeeRepository.findDistinctPositionNames();
    }

    public List<Employee> getEmployeesSortedByHireDate() {
        return employeeRepository.findByOrderByHireDateDesc();
    }

    public List<Employee> searchEmployeesByName(String pattern) {
        return employeeRepository.findByFullNameLike(pattern);
    }

    public List<Employee> getEmployeesByComplexCondition() {
        return employeeRepository.findEmployeesByComplexCondition();
    }

    public Employee saveEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }

    public void deleteEmployeeById(Long id) {
        employeeRepository.deleteById(id);
    }
}