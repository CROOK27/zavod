package com.alibou.security.position;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@Builder
@AllArgsConstructor
@Table(name = "position")
public class Position {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_position")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "salary", nullable = false, precision = 10, scale = 2)
    private BigDecimal salary;

    @Column(name = "grade", nullable = false)
    private Integer grade;

    // Конструкторы, геттеры, сеттеры
    public Position() {}

    public Position(String name, BigDecimal salary, Integer grade) {
        this.name = name;
        this.salary = salary;
        this.grade = grade;
    }

    // Геттеры и сеттеры...

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getSalary() {
        return salary;
    }

    public void setSalary(BigDecimal salary) {
        this.salary = salary;
    }

    public Integer getGrade() {
        return grade;
    }

    public void setGrade(Integer grade) {
        this.grade = grade;
    }
}
