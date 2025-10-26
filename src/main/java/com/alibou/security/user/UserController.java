package com.alibou.security.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;
    private final  UserRepository repository;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(Principal principal) {
        try {
            if (principal == null) {
                return ResponseEntity.status(401).build();
            }

            String userEmail = principal.getName();
            Optional<User> user = repository.findByEmail(userEmail);

            if (user.isPresent()) {
                return ResponseEntity.ok(UserResponse.fromUser(user.get()));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @GetMapping("/email/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        try {
            Optional<User> userOptional = repository.findByEmail(email);

            if (userOptional.isPresent()) {
                User user = userOptional.get();

                // Создаем DTO или возвращаем только необходимые поля
                UserResponse userResponse = new UserResponse();
                userResponse.setId(Math.toIntExact(user.getId()));
                userResponse.setEmail(user.getEmail());
                userResponse.setFirstname(user.getFirstname());
                userResponse.setLastname(user.getLastname());
                userResponse.setPhone(user.getPhone());
                userResponse.setRole(user.getRole());
                return ResponseEntity.ok(userResponse);

            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "User not found"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error fetching user: " + e.getMessage()));
        }
    }
    @GetMapping("/by-token")
    public ResponseEntity<UserResponse> getUserByToken(@RequestHeader("Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            String token = authHeader.substring(7); // Убираем "Bearer "
            User user = service.getUserByToken(token);

            if (user != null) {
                return ResponseEntity.ok(UserResponse.fromUser(user));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    @PatchMapping
    public ResponseEntity<?> changePassword(
          @RequestBody ChangePasswordRequest request,
          Principal connectedUser
    ) {
        service.changePassword(request, connectedUser);
        return ResponseEntity.ok().build();
    }
}
