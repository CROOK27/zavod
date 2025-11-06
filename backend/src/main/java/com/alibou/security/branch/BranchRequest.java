package com.alibou.security.branch;

import com.alibou.security.department.DepartmentRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BranchRequest {
    private String nameBranch;
    private Long employeeId; // ID сотрудника (руководителя филиала)

    // Если нужно создавать отделы сразу
    private List<DepartmentRequest> departments;
}

