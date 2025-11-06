package com.alibou.security.branch;

import com.alibou.security.department.Department;
import com.alibou.security.employee.Employee;
import com.alibou.security.orders.Orders;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "branch")
public class Branch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_branch")
    private Long id;

    @Column(name = "name_branch")
    private String nameBranch;

    @OneToMany(fetch = FetchType.LAZY)
    private List<Department> departments = new ArrayList<>();

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_employee", nullable = false, unique=true)
    private Employee employee;

    public Branch() {}

    public Branch(Long id, String nameBranch, List<Department> departments, Employee employee) {
        this.id = id;
        this.nameBranch = nameBranch;
        this.departments = departments;
        this.employee = employee;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNameBranch() {
        return nameBranch;
    }

    public void setNameBranch(String nameBranch) {
        this.nameBranch = nameBranch;
    }

    public List<Department> getDepartments() {
        return departments;
    }

    public void setDepartments(List<Department> departments) {
        this.departments = departments;
    }

    public Employee getEmployee() {
        return employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }

}
