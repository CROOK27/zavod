package com.alibou.security.department;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/department")
@PreAuthorize("hasRole('ADMIN')")
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

    @GetMapping("/{id}")
    public ResponseEntity<Department> getDepartmentById(@PathVariable Long id){
        Optional<Department> department = departmentService.getDepartmentById(id);
        return department.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    @PutMapping("/{id}")
    public ResponseEntity<Department> putDepartmentById(@PathVariable Long id, @RequestBody Department department) {
        Optional<Department> departmentNew = departmentService.getDepartmentById(id);

        if (departmentNew.isPresent()) {
            Department existingDepartment = departmentNew.get();

            existingDepartment.setName(department.getName());
            existingDepartment.setPhone(department.getPhone());
            existingDepartment.setChief(department.getChief());

            Department updatedDepartment = departmentService.saveDepartment(existingDepartment);
            return ResponseEntity.ok(updatedDepartment);
        } else {
            return ResponseEntity.notFound().build();
        }

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDepartmentById(@PathVariable Long id) {
        Optional<Department> department = departmentService.getDepartmentById(id);

        if (department.isPresent()) {
            departmentService.deleteDepartmentById(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
