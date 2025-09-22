package com.alibou.security.position;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface PositionRepository extends JpaRepository<Position, Long> {

    // d. SUM с группировкой
    @Query("SELECT p.name, SUM(p.salary) FROM Position p GROUP BY p.name")
    List<Object[]> findSalarySumByPosition();

    // h. AVG с условием
    @Query("SELECT p.name, AVG(p.salary) FROM Position p WHERE p.grade >= 4 GROUP BY p.name")
    List<Object[]> findAverageSalaryByPositionWithCondition();

    // l. MIN и MAX
    @Query("SELECT MIN(p.salary), MAX(p.salary) FROM Position p")
    List<Object[]> findMinMaxSalary();
}
