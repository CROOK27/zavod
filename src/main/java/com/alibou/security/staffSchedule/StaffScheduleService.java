package com.alibou.security.staffSchedule;


import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class StaffScheduleService {

    private final StaffScheduleRepository staffScheduleRepository;

    public StaffScheduleService(StaffScheduleRepository staffScheduleRepository) {
        this.staffScheduleRepository = staffScheduleRepository;
    }

    // c. Отделы с несколькими единицами
    public List<Object[]> getDepartmentsWithMultipleUnits() {
        return staffScheduleRepository.findDepartmentsWithMultipleUnits();
    }

    // d. Сумма штатных единиц по отделам
    public List<Object[]> getTotalStaffUnitsByUnit() {
        return staffScheduleRepository.findTotalStaffUnitsByUnit();
    }

    // g. Штатные единицы по отделам за период
    public List<Object[]> getStaffUnitsByDepartmentAndDateRange(LocalDate startDate, LocalDate endDate) {
        return staffScheduleRepository.findStaffUnitsByDepartmentAndDateRange(startDate, endDate);
    }

    public List<StaffSchedule> getAllStaffSchedules() {
        return staffScheduleRepository.findAll();
    }

    public List<StaffSchedule> getStaffSchedulesByDepartment(String departmentName) {
        return staffScheduleRepository.findByUnitDepartmentName(departmentName);
    }

    public StaffSchedule saveStaffSchedule(StaffSchedule staffSchedule) {
        return staffScheduleRepository.save(staffSchedule);
    }
}
