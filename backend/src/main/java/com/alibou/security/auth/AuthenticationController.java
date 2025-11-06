package com.alibou.security.auth;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

  private final AuthenticationService service; // ваша реализация

  @PostMapping("/register")
  public ResponseEntity<?> register(
          @Valid @RequestBody RegisterRequest request,
          BindingResult bindingResult
  ) {
    if (bindingResult.hasErrors()) {
      Map<String, String> errors = new HashMap<>();
      bindingResult.getFieldErrors().forEach(error ->
              errors.put(error.getField(), error.getDefaultMessage())
      );
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    try {
      AuthenticationResponse response = service.register(request);
      return ResponseEntity.ok(response);
    } catch (RuntimeException e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("error", e.getMessage());
      return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    } catch (Exception e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("error", "Registration failed");
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
  }

  @PostMapping("/authenticate")
  public ResponseEntity<?> authenticate(
          @RequestBody AuthenticationRequest request
  ) {
    try {
      AuthenticationResponse response = service.authenticate(request);
      return ResponseEntity.ok(response);
    } catch (Exception e) {
      Map<String, String> errorResponse = new HashMap<>();
      errorResponse.put("error", "Invalid email or password");
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }
  }

  @PostMapping("/refresh-token")
  public void refreshToken(
          HttpServletRequest request,
          HttpServletResponse response
  ) throws IOException {
    service.refreshToken(request, response);
  }
}
