package com.alibou.security.employee;

import com.alibou.security.department.Department;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

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

    @PostMapping
    public ResponseEntity<?> createEmployee(@RequestBody Employee employee){
        try {
            Employee createdEmployee = employeeService.saveEmployee(employee);
            return ResponseEntity.created(URI.create("/api/employee/" + createdEmployee.getId()))
                    .body(createdEmployee);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> putEmployeeById(@PathVariable Long id, @RequestBody Department department) {
        Optional<Employee> employee = employeeService.getEmployeeById(id);

        if (employee.isPresent()) {
            Employee existingEmployee = employee.get();

            existingEmployee.setBirthDate(employee.get().getBirthDate());
            existingEmployee.getUser().setPhone(employee.get().getUser().getPhone());
            existingEmployee.setGender(employee.get().getGender());
            existingEmployee.getUser().setFirstname((employee.get().getUser().getFirstname()));
            existingEmployee.getUser().setLastname((employee.get().getUser().getLastname()));

            Employee updatedEmployee = employeeService.saveEmployee(existingEmployee);
            return ResponseEntity.ok(updatedEmployee);
        } else {
            return ResponseEntity.notFound().build();
        }

    }

//    @DeleteMapping("/{id}")
//    public ResponseEntity<?> deleteDepartmentById(@PathVariable Long id) {
//        Optional<Department> department = employeeService.getEmployeeById(id);
//
//        if (department.isPresent()) {
//            employeeService.delete(id);
//            return ResponseEntity.noContent().build();
//        } else {
//            return ResponseEntity.notFound().build();
//        }
//    }
}
