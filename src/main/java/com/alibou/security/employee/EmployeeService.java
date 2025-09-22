package com.alibou.security.employee;


import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;

    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    // a. Все имена и телефоны
    public List<Object[]> getAllNamesAndPhones() {
        return employeeRepository.findAllNamesAndPhones();
    }

    // b. Уникальные должности
    public List<String> getDistinctPositionNames() {
        return employeeRepository.findDistinctPositionNames();
    }

    // e. Сортировка по дате приема
    public List<Employee> getEmployeesSortedByHireDate() {
        return employeeRepository.findByOrderByHireDateDesc();
    }

    // j. Поиск по шаблону
    public List<Employee> searchEmployeesByName(String pattern) {
        return employeeRepository.findByFullNameLike(pattern);
    }

    // m. Сложный запрос
    public List<Employee> getEmployeesByComplexCondition() {
        return employeeRepository.findEmployeesByComplexCondition();
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }
}
