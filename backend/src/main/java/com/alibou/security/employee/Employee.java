package com.alibou.security.employee;
import com.alibou.security.position.Position;
import com.alibou.security.orders.Orders;
import com.alibou.security.user.User;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@Entity
@Table(name = "employee")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_employee")
    private Long id;

    @Column(name = "birth_date", nullable = false)
    private LocalDate birthDate;

    @Column(name = "gender", length = 1)
    private String gender;

    @Column(name = "hire_date", nullable = false)
    private LocalDate hireDate;

    @Column(name = "rate", precision = 3, scale = 2)
    private BigDecimal rate = BigDecimal.ONE;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonBackReference
    private List<Orders> orders = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_position")
    private Position position;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_user")
    @JsonBackReference
    private User user;

    public Employee(Long id, LocalDate birthDate, String gender,
                    LocalDate hireDate, BigDecimal rate, List<Orders> orders,
                    Position position, User user) {
        this.id = id;
        this.birthDate = birthDate;
        this.gender = gender;
        this.hireDate = hireDate;
        this.rate = rate;
        this.orders = orders;
        this.position = position;
        this.user = user;
    }

    // Геттеры и сеттеры...

    public Long getId() {
        return id;
    }
    public String getFullName() {
        return user != null ?
                user.getFullName():
                "Неизвестно";
    }

    public void setId(Long id) {
        this.id = id;
    }

    public BigDecimal getRate() {
        return rate;
    }

    public void setRate(BigDecimal rate) {
        this.rate = rate;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public LocalDate getHireDate() {
        return hireDate;
    }

    public void setHireDate(LocalDate hireDate) {
        this.hireDate = hireDate;
    }

    public void setUnit(Orders unit) {
        this.orders = orders;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Position getPosition() {
        return position;
    }

    public void setPosition(Position position) {
        this.position = position;
    }

    public List<Orders> getOrders() {
        return orders;
    }

    public void setOrders(List<Orders> orders) {
        this.orders = orders;
    }
}
