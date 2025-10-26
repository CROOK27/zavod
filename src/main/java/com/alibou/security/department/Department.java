package com.alibou.security.department;

import com.alibou.security.branch.Branch;
import com.alibou.security.employee.Employee;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@AllArgsConstructor
@Table(name = "department")
public class Department {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "department_id")
    private Long id;

    @Column(name = "name_department", nullable = false)
    private String name;

    @Column(name = "phone", unique = true)
    private String phone;

    @OneToOne
    @JoinColumn(name = "chief_id",nullable = false)
    private Employee chief;

    public Department() {
    }

    public Department(String name, String phone, Employee chief) {
        this.name = name;
        this.phone = phone;
        this.chief = chief;
    }

    // геттеры и сеттеры
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Employee getChief() {
        return chief;
    }

    public void setChief(Employee chief) {
        this.chief = chief;
    }

    public void setBranch(Branch savedBranch) {
    }
}