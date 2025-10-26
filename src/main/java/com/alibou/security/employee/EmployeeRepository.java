package com.alibou.security.employee;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // a. Выбор всех данных по двум полям таблицы
    @Query("SELECT e.user.firstname, e.user.lastname, e.user.phone FROM Employee e WHERE e.user IS NOT NULL")
    List<Object[]> findAllNamesAndPhones();

    // b. Все неповторяющиеся должности
    @Query("SELECT DISTINCT e.position.name FROM Employee e")
    List<String> findDistinctPositionNames();

    // e. Несколько полей с сортировкой по убыванию
    List<Employee> findByOrderByHireDateDesc();

    // j. Поиск по шаблону LIKE
    @Query("SELECT e FROM Employee e WHERE e.user.firstname LIKE %:pattern% OR e.user.lastname LIKE %:pattern%")
    List<Employee> findByFullNameLike(String pattern);

    // m. Сложное условие с AND, OR
    @Query("SELECT e FROM Employee e WHERE " +
            "(e.gender = 'М' AND YEAR(e.birthDate) < 1990) " +
            "OR (e.gender = 'Ж' AND YEAR(e.birthDate) > 1990) " +
            "ORDER BY e.birthDate ASC")
    List<Employee> findEmployeesByComplexCondition();
    @Query("SELECT e FROM Employee e JOIN FETCH e.user u JOIN FETCH e.position p LEFT JOIN FETCH e.orders o WHERE u.id = :userId")
    Optional<Employee> findByUserIdWithDetails(@Param("userId") Long userId);
    // Дополнительные методы
    Optional<Employee> findById(Long id);
    List<Employee> findByGender(String gender);
    List<Employee> findByBirthDateAfter(LocalDate date);
    List<Employee> findByBirthDateBefore(LocalDate date);
    Optional<Employee> deleteEmployeeById(Long id);
}