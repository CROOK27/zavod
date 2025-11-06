package com.alibou.security.employee;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeResponseDTO {
    private Long id;
    private LocalDate birthDate;
    private String gender;
    private LocalDate hireDate;
    private BigDecimal rate;

    // Информация о пользователе (без циклических ссылок)
    private UserInfo user;
    private PositionInfo position;
    private OrdersInfo orders;

    // Вложенные DTO для связанных сущностей
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserInfo {
        private Long id;
        private String email;
        private String firstname;
        private String lastname;
        private String phone;
        private String role;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PositionInfo {
        private Long id;
        private String name;
        private String description;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrdersInfo {
        private Long id;
        private String orderNumber;
        private LocalDate orderDate;
    }

    // Метод для преобразования Entity в DTO
    public static EmployeeResponseDTO fromEmployee(Employee employee) {
        if (employee == null) {
            return null;
        }

        EmployeeResponseDTOBuilder builder = EmployeeResponseDTO.builder()
                .id(employee.getId())
                .birthDate(employee.getBirthDate())
                .gender(employee.getGender())
                .hireDate(employee.getHireDate())
                .rate(employee.getRate());

        // Преобразование User
        if (employee.getUser() != null) {
            builder.user(UserInfo.builder()
                    .id(employee.getUser().getId())
                    .email(employee.getUser().getEmail())
                    .firstname(employee.getUser().getFirstname())
                    .lastname(employee.getUser().getLastname())
                    .phone(employee.getUser().getPhone())
                    .role(String.valueOf(employee.getUser().getRole()))
                    .build());
        }

        // Преобразование Position
        if (employee.getPosition() != null) {
            builder.position(PositionInfo.builder()
                    .id(employee.getPosition().getId())
                    .name(employee.getPosition().getName())
                    .build());
        }

        return builder.build();
    }
}