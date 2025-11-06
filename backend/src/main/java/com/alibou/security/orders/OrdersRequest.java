package com.alibou.security.orders;

import java.time.LocalDate;

public class OrdersRequest {
    private String name;
    private String customer;
    private String quest;
    private Long managerId;
    private String status = "pending";

    // Конструктор по умолчанию
    public OrdersRequest() {}

    // Геттеры и сеттеры
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCustomer() { return customer; }
    public void setCustomer(String customer) { this.customer = customer; }

    public String getQuest() { return quest; }
    public void setQuest(String quest) { this.quest = quest; }

    public Long getManagerId() { return managerId; }
    public void setManagerId(Long managerId) { this.managerId = managerId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}