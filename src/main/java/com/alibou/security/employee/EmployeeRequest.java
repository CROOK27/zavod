package com.alibou.security.employee;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeRequest {
    private String birthDate;
    private String gender;
    private String hireDate;
    private BigDecimal rate;
    private Long userId;
    private Long positionId;
}