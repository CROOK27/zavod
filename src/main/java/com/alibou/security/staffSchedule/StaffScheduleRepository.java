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

    // d. SUM с группировкой
    @Query("SELECT s.branch.nameBranch, SUM(s.staffUnits) FROM StaffSchedule s GROUP BY s.branch.nameBranch")
    List<Object[]> findTotalStaffUnitsByBranch();

    // g. SUM с BETWEEN
    @Query("SELECT s.position.name, SUM(s.staffUnits) " +
            "FROM StaffSchedule s " +
            "WHERE s.introductionDate BETWEEN :startDate AND :endDate " +
            "GROUP BY s.position.name")
    List<Object[]> findStaffUnitsByPositionAndDateRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    List<StaffSchedule> findByIntroductionDateBetween(LocalDate startDate, LocalDate endDate);
    List<StaffSchedule> findByStaffUnitsGreaterThan(Integer minUnits);
}