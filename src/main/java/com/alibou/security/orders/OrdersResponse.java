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
        if (order.getmanager() != null) {
            this.managerId = order.getmanager().getId();
            this.managerName = order.getmanager().getFullName(); // если есть такой метод
        }
    }
}