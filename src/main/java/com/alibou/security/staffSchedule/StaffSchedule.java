package com.alibou.security.staffSchedule;

import com.alibou.security.branch.Branch;
import com.alibou.security.orders.Orders;
import com.alibou.security.position.Position;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "staffSchedule")
public class StaffSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_branch", nullable = false)
    private Branch branch;

    @ManyToMany
    @JoinTable(
            name = "order_positions",
            joinColumns = @JoinColumn(name = "order_id"),
            inverseJoinColumns = @JoinColumn(name = "position_id")
    )
    private List<Position> positions;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_orders", nullable = false)
    private Orders orders;

    @Column(name = "staff_units", nullable = false)
    private Integer staffUnits = 1;

    @Column(name = "introduction_date", nullable = false)
    private LocalDate introductionDate = LocalDate.now();

    @Column(name = "end_date")
    private LocalDate endDate;
    // Конструкторы, геттеры, сеттеры
    public StaffSchedule() {
    }

    public StaffSchedule(Branch branch, List<Position> position, Orders orders, Integer staffUnits, LocalDate introductionDate) {
        this.branch = branch;
        this.positions = position;
        this.orders = orders;
        this.staffUnits = staffUnits;
        this.introductionDate = introductionDate;
    }

    // Геттеры и сеттеры...

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Branch getBranch() {
        return branch;
    }

    public void setBranch(Branch branch) {
        this.branch = branch;
    }

    public List<Position> getPosition() {
        return positions;
    }

    public void setPosition(List<Position> position) {
        this.positions = position;
    }

    public Orders getOrders() {
        return orders;
    }

    public void setOrders(Orders orders) {
        this.orders = orders;
    }

    public Integer getStaffUnits() {
        return staffUnits;
    }

    public void setStaffUnits(Integer staffUnits) {
        this.staffUnits = staffUnits;
    }

    public LocalDate getIntroductionDate() {
        return introductionDate;
    }

    public void setIntroductionDate(LocalDate introductionDate) {
        this.introductionDate = introductionDate;
    }
}