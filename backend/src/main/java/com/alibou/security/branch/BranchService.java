package com.alibou.security.branch;

import com.alibou.security.department.Department;
import com.alibou.security.department.DepartmentRepository;
import com.alibou.security.department.DepartmentRequest;
import com.alibou.security.employee.Employee;
import com.alibou.security.employee.EmployeeRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class BranchService {

    private final BranchRepository branchRepository;
    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;

    // Получить все филиалы
    public List<Branch> getAllBranches() {
        return branchRepository.findAll();
    }

    // Получить все филиалы с деталями
    public List<Branch> getAllBranchesWithDetails() {
        return branchRepository.findAllWithEmployee();
    }

    // Получить филиал по ID
    public Optional<Branch> getBranchById(Long id) {
        return branchRepository.findById(id);
    }

    // Получить филиал по ID с деталями - ОДИН МЕТОД!
    public Optional<Branch> getBranchByIdWithDetails(Long id) {
        return branchRepository.findByIdWithDetails(id); // Используем правильный метод репозитория
    }

    // Создать филиал - ИСПРАВЛЕННАЯ ВЕРСИЯ
    public Branch createBranch(BranchRequest request) {
        // Находим сотрудника (руководителя филиала)
        Employee branchChief = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + request.getEmployeeId()));

        // Создаем филиал
        Branch branch = new Branch();
        branch.setNameBranch(request.getNameBranch());
        branch.setEmployee(branchChief);

        // Сохраняем филиал сначала
        Branch savedBranch = branchRepository.save(branch);

        // Создаем отделы если они указаны
        if (request.getDepartments() != null && !request.getDepartments().isEmpty()) {
            List<Department> departments = new ArrayList<>();

            for (DepartmentRequest deptRequest : request.getDepartments()) {
                // Находим руководителя отдела
                Employee departmentChief = employeeRepository.findById(deptRequest.getChiefId())
                        .orElseThrow(() -> new RuntimeException("Department chief not found with id: " + deptRequest.getChiefId()));

                Department department = new Department();
                department.setName(deptRequest.getName());
                department.setBranch(savedBranch);
                department.setChief(departmentChief); // Устанавливаем руководителя отдела
                departments.add(department);
            }

            // Сохраняем отделы
            List<Department> savedDepartments = departmentRepository.saveAll(departments);
            savedBranch.setDepartments(savedDepartments);
            branchRepository.save(savedBranch);
        }

        return branchRepository.findByIdWithDetails(savedBranch.getId())
                .orElseThrow(() -> new RuntimeException("Failed to load branch with departments"));
    }

    // Обновить филиал
    public Branch updateBranch(Long id, BranchRequest request) {
        Branch existingBranch = branchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Branch not found with id: " + id));

        // Обновляем основные поля
        existingBranch.setNameBranch(request.getNameBranch());

        // Обновляем сотрудника если указан
        if (request.getEmployeeId() != null) {
            Employee employee = employeeRepository.findById(request.getEmployeeId())
                    .orElseThrow(() -> new RuntimeException("Employee not found with id: " + request.getEmployeeId()));
            existingBranch.setEmployee(employee);
        }

        return branchRepository.save(existingBranch);
    }

    // Удалить филиал
    public void deleteBranch(Long id) {
        if (!branchRepository.existsById(id)) {
            throw new RuntimeException("Branch not found with id: " + id);
        }
        branchRepository.deleteById(id);
    }

    // Поиск филиалов по имени
    public List<Branch> searchBranches(String name) {
        return branchRepository.findByNameBranchContainingIgnoreCase(name);
    }
}