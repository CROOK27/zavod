package com.alibou.security.staffSchedule;

import com.alibou.security.position.Position;
import com.alibou.security.unit.Unit;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "_staffSchedule")
public class StaffSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_unit", nullable = false)
    private Unit unit;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_position", nullable = false)
    private Position position;

    @Column(name = "staffUnits", nullable = false)
    private Integer staffUnits = 1;

    @Column(name = "introductionDate", nullable = false)
    private LocalDate introductionDate = LocalDate.now();

    // Конструкторы, геттеры, сеттеры
    public StaffSchedule() {}

    public StaffSchedule(Unit unit, Position position, Integer staffUnits, LocalDate introductionDate) {
        this.unit = unit;
        this.position = position;
        this.staffUnits = staffUnits;
        this.introductionDate = introductionDate;
    }

    // Геттеры и сеттеры...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Unit getUnit() { return unit; }
    public void setUnit(Unit unit) { this.unit = unit; }

    public Position getPosition() { return position; }
    public void setPosition(Position position) { this.position = position; }

    public Integer getStaffUnits() { return staffUnits; }
    public void setStaffUnits(Integer staffUnits) { this.staffUnits = staffUnits; }

    public LocalDate getIntroductionDate() { return introductionDate; }
    public void setIntroductionDate(LocalDate introductionDate) { this.introductionDate = introductionDate; }
}