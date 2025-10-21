package com.alibou.security.orders;


import com.alibou.security.department.Department;
import com.alibou.security.employee.Employee;
import com.alibou.security.user.User;
import jakarta.persistence.*;

@Entity
@Table(name = "orders")
public class Orders
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name_order", nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_manager", nullable = false)
    private Employee manager;

    private String customer;
    private String quest;


    // Конструкторы, геттеры, сеттеры

    public Orders(String name, Employee manager) {
        this.name = name;
        this.manager = manager;
    }

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

    public Employee getmanager() {
        return manager;
    }

    public void setmanager(Employee manager) {
        this.manager = manager;
    }
}