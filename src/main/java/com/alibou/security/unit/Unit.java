package com.alibou.security.unit;


import com.alibou.security.department.Department;
import com.alibou.security.staffSchedule.StaffSchedule;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "_unit")
public class Unit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "manager", nullable = false)
    private String manager;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_department", nullable = false)
    private Department department;


    // Конструкторы, геттеры, сеттеры

    public Unit(String name, String manager, Department department) {
        this.name = name;
        this.manager = manager;
        this.department = department;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getManager() {
        return manager;
    }

    public void setManager(String manager) {
        this.manager = manager;
    }
}