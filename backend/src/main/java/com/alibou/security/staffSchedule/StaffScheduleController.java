package com.alibou.security.staffSchedule;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/staff_schedule")
public class StaffScheduleController {

    private final StaffScheduleService staffScheduleService;

    public StaffScheduleController(StaffScheduleService staffScheduleService) {
        this.staffScheduleService = staffScheduleService;
    }


    @GetMapping("/total-staff_units")
    public List<Object[]> getTotalStaffUnitsByUnit() {
        return staffScheduleService.getTotalStaffUnitsByUnit();
    }

    @GetMapping("/by_date_range")
    public List<StaffSchedule> getStaffByPositionAndDateRange(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        return staffScheduleService.getStaffByDateRange(startDate, endDate);
    }

    //@GetMapping("/by-department/{departmentName}")
    //public List<StaffSchedule> getStaffSchedulesByDepartment(@PathVariable String departmentName) {
    //    return staffScheduleService.getStaffSchedulesByDepartment(departmentName);
    //}

    @GetMapping
    public List<StaffSchedule> getAllStaffSchedules() {
        return staffScheduleService.getAllStaffSchedules();
    }

    @PostMapping
    public StaffSchedule createStaffSchedule(@RequestBody StaffSchedule staffSchedule) {
        return staffScheduleService.saveStaffSchedule(staffSchedule);
    }
}