package com.alibou.security.department;

import com.alibou.security.employee.EmployeeService;
import com.alibou.security.position.Position;
import com.alibou.security.position.PositionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/department")
public class DepartmentController {
    private final DepartmentService departmentService;

    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @PostMapping
    public ResponseEntity<?> createDepartment(@RequestBody Department department){
        try {
            Department createdDepartment = departmentService.saveDepartment(department);
            return ResponseEntity.created(URI.create("/api/department/" + createdDepartment.getId()))
                    .body(createdDepartment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping
    public List<Department> getAllDepartment() {return departmentService.getAllDepartment();}
}
