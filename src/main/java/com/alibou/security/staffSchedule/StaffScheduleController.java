package com.alibou.security.staffSchedule;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/staff-schedule")
public class StaffScheduleController {

    private final StaffScheduleService staffScheduleService;

    public StaffScheduleController(StaffScheduleService staffScheduleService) {
        this.staffScheduleService = staffScheduleService;
    }

    @GetMapping("/departments-multiple-units")
    public List<Object[]> getDepartmentsWithMultipleUnits() {
        return staffScheduleService.getDepartmentsWithMultipleUnits();
    }

    @GetMapping("/total-staff-units")
    public List<Object[]> getTotalStaffUnitsByUnit() {
        return staffScheduleService.getTotalStaffUnitsByUnit();
    }

    @GetMapping("/by-date-range")
    public List<Object[]> getStaffUnitsByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return staffScheduleService.getStaffUnitsByDepartmentAndDateRange(startDate, endDate);
    }

    @GetMapping("/by-department/{departmentName}")
    public List<StaffSchedule> getStaffSchedulesByDepartment(@PathVariable String departmentName) {
        return staffScheduleService.getStaffSchedulesByDepartment(departmentName);
    }

    @GetMapping
    public List<StaffSchedule> getAllStaffSchedules() {
        return staffScheduleService.getAllStaffSchedules();
    }

    @PostMapping
    public StaffSchedule createStaffSchedule(@RequestBody StaffSchedule staffSchedule) {
        return staffScheduleService.saveStaffSchedule(staffSchedule);
    }
}