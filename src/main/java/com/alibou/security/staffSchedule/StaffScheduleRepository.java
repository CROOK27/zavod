package com.alibou.security.staffSchedule;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface StaffScheduleRepository extends JpaRepository<StaffSchedule, Long> {

    // c. GROUP BY с HAVING
    @Query("SELECT s.unit.department.name AS departmentName, COUNT(s) AS unitCount " +
            "FROM StaffSchedule s " +
            "GROUP BY s.unit.department.name " +
            "HAVING COUNT(s) > 1")
    List<Object[]> findDepartmentsWithMultipleUnits();

    // d. SUM с группировкой
    @Query("SELECT s.unit.name, SUM(s.staffUnits) " +
            "FROM StaffSchedule s " +
            "GROUP BY s.unit.name")
    List<Object[]> findTotalStaffUnitsByUnit();

    // g. SUM с BETWEEN
    @Query("SELECT s.unit.department.name, SUM(s.staffUnits) " +
            "FROM StaffSchedule s " +
            "WHERE s.introductionDate BETWEEN :startDate AND :endDate " +
            "GROUP BY s.unit.department.name")
    List<Object[]> findStaffUnitsByDepartmentAndDateRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    List<StaffSchedule> findByUnitDepartmentName(String departmentName);
    List<StaffSchedule> findByIntroductionDateBetween(LocalDate startDate, LocalDate endDate);
    List<StaffSchedule> findByStaffUnitsGreaterThan(Integer minUnits);
}