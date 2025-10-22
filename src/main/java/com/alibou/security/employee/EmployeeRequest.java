package com.alibou.security.employee;

import java.math.BigDecimal;
import java.time.LocalDate;

public class EmployeeRequest {
    private LocalDate birthDate;
    private String gender;
    private LocalDate hireDate;
    private BigDecimal rate;
    private Long userId;
    private Long positionId;
    private Long ordersId;

    // Конструкторы
    public EmployeeRequest() {}

    // Геттеры и сеттеры
    public LocalDate getBirthDate() { return birthDate; }
    public void setBirthDate(LocalDate birthDate) { this.birthDate = birthDate; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public LocalDate getHireDate() { return hireDate; }
    public void setHireDate(LocalDate hireDate) { this.hireDate = hireDate; }

    public BigDecimal getRate() { return rate; }
    public void setRate(BigDecimal rate) { this.rate = rate; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getPositionId() { return positionId; }
    public void setPositionId(Long positionId) { this.positionId = positionId; }

    public Long getOrdersId() { return ordersId; }
    public void setOrdersId(Long ordersId) { this.ordersId = ordersId; }
}