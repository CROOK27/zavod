package com.alibou.security.orders;

import com.alibou.security.employee.Employee;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Builder
@NoArgsConstructor
@AllArgsConstructor // ← ДОБАВЬТЕ ЭТУ АННОТАЦИЮ
@Entity
@Table(name = "orders")
public class Orders {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name_order", nullable = false)
    private String name;

    @Column(name = "customer", length = 500)
    private String customer;

    @Column(name = "quest", length = 1000)
    private String quest;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @Column(columnDefinition = "VARCHAR(50) DEFAULT 'pending'", nullable = false)
    private String status;

    // Конструктор для создания новых заказов
    public Orders(String name, String customer, String quest, Employee employee) {
        this.name = name;
        this.customer = customer;
        this.quest = quest;
        this.employee = employee;
        this.status = "pending";
    }

    // Геттеры и сеттеры
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCustomer() { return customer; }
    public void setCustomer(String customer) { this.customer = customer; }

    public String getQuest() { return quest; }
    public void setQuest(String quest) { this.quest = quest; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}