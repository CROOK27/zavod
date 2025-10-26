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

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final PositionRepository positionRepository;

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


        // Создаем нового сотрудника
        Employee employee = Employee.builder()
                .birthDate(LocalDate.parse(request.getBirthDate()))
                .gender(request.getGender())
                .hireDate(LocalDate.parse(request.getHireDate()))
                .rate(request.getRate())
                .user(user)
                .position(position)
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
    // Получить сотрудника по ID пользователя или выбросить исключение
    public Employee getEmployeeByUserIdOrThrow(Long userId) {
        return employeeRepository.findByUserIdWithDetails(userId)
                .orElseThrow(() -> new RuntimeException("Employee not found for user id: " + userId));
    }
}