package com.alibou.security.department;


import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DepartmentService {
    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }
    public List<Department> getAllDepartment() {
        return departmentRepository.findAll();
    }

    public Department saveDepartment(Department department){
        return departmentRepository.save(department);
    }
    public Optional<Department> getDepartmentById(Long id) {
        return departmentRepository.findById(id);
    }
    public void deleteDepartmentById(Long id) { departmentRepository.deleteById(id);}
}
