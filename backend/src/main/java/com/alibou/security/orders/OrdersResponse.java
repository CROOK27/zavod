package com.alibou.security.orders;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
public class OrdersResponse {
    private Long id;
    private String name;
    private String customer;
    private String quest;
    private Long managerId;
    private String managerName;
    private String status;

    // Конструктор из Orders
    public OrdersResponse(Orders order) {
        this.id = order.getId();
        this.name = order.getName();
        this.customer = order.getCustomer();
        this.quest = order.getQuest();
        if (order.getEmployee() != null) {
            this.managerId = order.getEmployee().getId();
            if (order.getEmployee().getUser() != null) {
                this.managerName = order.getEmployee().getUser().getFirstname() + " " +
                        order.getEmployee().getUser().getLastname();
            } else {
                this.managerName = "Менеджер не указан";
            }
        } else {
            this.managerId = null;
            this.managerName = "Менеджер не назначен";
        }
        this.status = order.getStatus();
    }

    // Конструктор по умолчанию
    public OrdersResponse() {
    }

    // Конструктор с 7 параметрами который ищет компилятор
    public OrdersResponse(Long id, String name, String customer, String quest,
                          Long managerId, String managerName, String status) {
        this.id = id;
        this.name = name;
        this.customer = customer;
        this.quest = quest;
        this.managerId = managerId;
        this.managerName = managerName;
        this.status = status;
    }
}