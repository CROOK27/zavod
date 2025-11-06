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


    // d. Сумма штатных единиц по отделам
    public List<Object[]> getTotalStaffUnitsByUnit() {
        return staffScheduleRepository.findTotalStaffUnitsByBranch();
    }

    // g. Штатные единицы по отделам за период
    public List<StaffSchedule> getStaffByDateRange(LocalDate startDate, LocalDate endDate) {
        return staffScheduleRepository.findByDateRange(startDate, endDate);
    }

    public List<StaffSchedule> getAllStaffSchedules() {
        return staffScheduleRepository.findAll();
    }

    //public List<StaffSchedule> getStaffSchedulesByDepartment(String departmentName) {
    //    return staffScheduleRepository.findByDepartmentName(departmentName);
    //}

    public StaffSchedule saveStaffSchedule(StaffSchedule staffSchedule) {
        return staffScheduleRepository.save(staffSchedule);
    }
}
