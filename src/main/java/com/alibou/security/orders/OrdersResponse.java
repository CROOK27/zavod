package com.alibou.security.orders;

import lombok.Data;

@Data
public class OrdersResponse {
    private Long id;
    private String name;
    private String customer;
    private String quest;
    private Long managerId;
    private String managerName;

    public OrdersResponse(Orders order) {
        this.id = order.getId();
        this.name = order.getName();
        this.customer = order.getCustomer();
        this.quest = order.getQuest();
        if (order.getEmployee() != null) {
            this.managerId = order.getEmployee().getId();
            this.managerName = order.getEmployee().getFullName(); // если есть такой метод
        }
    }
}