package com.alibou.security.employee;

import com.alibou.security.department.Department;
import com.alibou.security.position.Position;
import com.alibou.security.position.PositionRepository;
import com.alibou.security.user.User;
import com.alibou.security.user.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/employees")
public class EmployeeController {

    private final EmployeeService employeeService;
    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final PositionRepository positionRepository;
    public EmployeeController(EmployeeService employeeService, EmployeeRepository employeeRepository, UserRepository userRepository, PositionRepository positionRepository) {
        this.employeeService = employeeService;
        this.employeeRepository = employeeRepository;
        this.userRepository = userRepository;
        this.positionRepository = positionRepository;
    }

    @GetMapping("/by-user-with-details/{userId}")
    public ResponseEntity<EmployeeResponseDTO> getEmployeeByUserIdWithDetails(@PathVariable Long userId) {
        Optional<Employee> employee = Optional.ofNullable(employeeService.getEmployeeByUserIdOrThrow(userId));

        if (employee.isPresent()) {
            EmployeeResponseDTO response = EmployeeResponseDTO.fromEmployee(employee.get());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
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
    public List<EmployeeResponseDTO> getEmployeesSortedByHireDate() {
        List<Employee> employees = employeeService.getEmployeesSortedByHireDate();
        return employees.stream()
                .map(EmployeeResponseDTO::fromEmployee)
                .collect(Collectors.toList());
    }

    @GetMapping("/search")
    public List<EmployeeResponseDTO> searchEmployees(@RequestParam String name) {
        List<Employee> employees = employeeService.searchEmployeesByName(name);
        return employees.stream()
                .map(EmployeeResponseDTO::fromEmployee)
                .collect(Collectors.toList());
    }

    @GetMapping("/complex-condition")
    public List<EmployeeResponseDTO> getEmployeesByComplexCondition() {
        List<Employee> employees = employeeService.getEmployeesByComplexCondition();
        return employees.stream()
                .map(EmployeeResponseDTO::fromEmployee)
                .collect(Collectors.toList());
    }

    @GetMapping
    public List<EmployeeResponseDTO> getAllEmployees() {
        List<Employee> employees = employeeService.getAllEmployees();
        return employees.stream()
                .map(EmployeeResponseDTO::fromEmployee)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmployeeResponseDTO> getEmployeeById(@PathVariable Long id) {
        Optional<Employee> employee = employeeService.getEmployeeById(id);
        return employee.map(emp -> ResponseEntity.ok(EmployeeResponseDTO.fromEmployee(emp)))
                .orElse(ResponseEntity.notFound().build());
    }
    @PostMapping
    public Employee createEmployee(@RequestBody EmployeeRequest request) {
        try {
            System.out.println("=== RECEIVED REQUEST ===");
            System.out.println(request);
            System.out.println("BirthDate: " + request.getBirthDate());
            System.out.println("Gender: " + request.getGender());
            System.out.println("HireDate: " + request.getHireDate());
            System.out.println("Rate: " + request.getRate());
            System.out.println("User ID: " + request.getUserId());
            System.out.println("Position ID: " + request.getPositionId());
            System.out.println("=========================");

            // Используем стандартный findById (не статический!)
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + request.getUserId()));

            Position position = positionRepository.findById(request.getPositionId())
                    .orElseThrow(() -> new RuntimeException("Position not found with id: " + request.getPositionId()));

            Employee employee = Employee.builder()
                    .birthDate(LocalDate.parse(request.getBirthDate()))
                    .gender(request.getGender())
                    .hireDate(LocalDate.parse(request.getHireDate()))
                    .rate(request.getRate())
                    .user(user)
                    .position(position)
                    .orders(null)
                    .build();

            Employee savedEmployee = employeeRepository.save(employee);

            return savedEmployee;

        } catch (Exception e) {
            throw e;
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<EmployeeResponseDTO> putEmployeeById(@PathVariable Long id, @RequestBody EmployeeRequest request) {
        Optional<Employee> employee = employeeService.getEmployeeById(id);

        if (employee.isPresent()) {
            // Обновляем данные сотрудника
            Employee existingEmployee = employee.get();

            // Здесь должна быть логика обновления полей из request
            // Например:
            // existingEmployee.setBirthDate(request.getBirthDate());
            // existingEmployee.setGender(request.getGender());
            // и т.д.

            Employee updatedEmployee = employeeService.saveEmployee(existingEmployee);
            EmployeeResponseDTO responseDTO = EmployeeResponseDTO.fromEmployee(updatedEmployee);
            return ResponseEntity.ok(responseDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEmployeeById(@PathVariable Long id) {
        Optional<Employee> employee = employeeService.getEmployeeById(id);

        if (employee.isPresent()) {
            employeeService.deleteEmployeeById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}