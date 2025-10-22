package com.alibou.security.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Integer id;
    private String firstname;
    private String lastname;
    private String email;
    private String phone;
    private Role role;

    // Статический метод для преобразования User в UserResponse
    public static UserResponse fromUser(User user) {
        return UserResponse.builder()
                .id(Math.toIntExact(user.getId()))
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .build();
    }
}