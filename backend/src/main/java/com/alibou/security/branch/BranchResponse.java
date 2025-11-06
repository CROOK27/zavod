package com.alibou.security.branch;

import com.alibou.security.employee.Employee;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BranchResponse {
    private Long id;
    private String nameBranch;
    private EmployeeInfo employee;
    private List<DepartmentInfo> departments;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EmployeeInfo {
        private Long id;
        private String firstname;
        private String lastname;
        private String position;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DepartmentInfo {
        private Long id;
        private String name;
        private String description;
    }

    public static BranchResponse fromBranch(Branch branch) {
        if (branch == null) return null;

        BranchResponseBuilder builder = BranchResponse.builder()
                .id(branch.getId())
                .nameBranch(branch.getNameBranch());

        // Информация о сотруднике
        if (branch.getEmployee() != null) {
            Employee employee = branch.getEmployee();
            builder.employee(EmployeeInfo.builder()
                    .id(employee.getId())
                    .firstname(employee.getUser() != null ? employee.getUser().getFirstname() : null)
                    .lastname(employee.getUser() != null ? employee.getUser().getLastname() : null)
                    .position(employee.getPosition() != null ? employee.getPosition().getName() : null)
                    .build());
        }

        // Информация об отделах
        if (branch.getDepartments() != null && !branch.getDepartments().isEmpty()) {
            List<DepartmentInfo> departmentInfos = branch.getDepartments().stream()
                    .map(dept -> DepartmentInfo.builder()
                            .id(dept.getId())
                            .name(dept.getName())
                            .description(dept.getName())
                            .build())
                    .collect(Collectors.toList());
            builder.departments(departmentInfos);
        }

        return builder.build();
    }
}