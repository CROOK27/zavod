package com.alibou.security.employee;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping("/names-phones")
    public List<Object[]> getNamesAndPhones() {
        return employeeService.getAllNamesAndPhones();
    }

    @GetMapping("/distinct-positions")
    public List<String> getDistinctPositions() {
        return employeeService.getDistinctPositionNames();
    }

    @GetMapping("/sorted-by-hire-date")
    public List<Employee> getEmployeesSortedByHireDate() {
        return employeeService.getEmployeesSortedByHireDate();
    }

    @GetMapping("/search")
    public List<Employee> searchEmployees(@RequestParam String name) {
        return employeeService.searchEmployeesByName(name);
    }

    @GetMapping("/complex-condition")
    public List<Employee> getEmployeesByComplexCondition() {
        return employeeService.getEmployeesByComplexCondition();
    }

    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployees();
    }
}
