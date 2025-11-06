package com.alibou.security.branch;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {

    // Найти филиалы по имени (поиск)
    List<Branch> findByNameBranchContainingIgnoreCase(String name);

    // Найти филиалы по сотруднику
    Optional<Branch> findByEmployeeId(Long employeeId);

    // Получить все филиалы с отделами
    @Query("SELECT b FROM Branch b LEFT JOIN FETCH b.departments")
    List<Branch> findAllWithDepartments();

    // Получить все филиалы с сотрудниками
    @Query("SELECT b FROM Branch b LEFT JOIN FETCH b.employee")
    List<Branch> findAllWithEmployee();

    // Получить филиал по ID с сотрудником и отделами - ЭТОТ МЕТОД ДОЛЖЕН БЫТЬ!
    @Query("SELECT b FROM Branch b LEFT JOIN FETCH b.employee LEFT JOIN FETCH b.departments WHERE b.id = :id")
    Optional<Branch> findByIdWithDetails(@Param("id") Long id);
}
