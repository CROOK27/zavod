package com.alibou.security.config;

import com.alibou.security.token.TokenRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

  private final JwtService jwtService;
  private final UserDetailsService userDetailsService;
  private final TokenRepository tokenRepository;

  @Override
  protected void doFilterInternal(
          @NonNull HttpServletRequest request,
          @NonNull HttpServletResponse response,
          @NonNull FilterChain filterChain
  ) throws ServletException, IOException {
    // Пропускаем аутентификацию для публичных endpoints
    if (request.getServletPath().contains("/api/v1/auth")) {
      filterChain.doFilter(request, response);
      return;
    }

    final String authHeader = request.getHeader("Authorization");
    final String jwt;
    final String userEmail;

    if (authHeader == null || !authHeader.startsWith("Bearer ")) {
      filterChain.doFilter(request, response);
      return;
    }

    jwt = authHeader.substring(7);

    try {
      userEmail = jwtService.extractUsername(jwt);

      if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
        try {
          UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

          // Проверяем валидность токена в базе данных
          var isTokenValid = tokenRepository.findByToken(jwt)
                  .map(t -> !t.isExpired() && !t.isRevoked())
                  .orElse(false);

          if (jwtService.isTokenValid(jwt, userDetails) && isTokenValid) {
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities()
            );
            authToken.setDetails(
                    new WebAuthenticationDetailsSource().buildDetails(request)
            );
            SecurityContextHolder.getContext().setAuthentication(authToken);
          } else {
            // Токен невалиден - отправляем 401
            sendUnauthorizedResponse(response, "Invalid or expired token");
            return;
          }
        } catch (UsernameNotFoundException e) {
          // Пользователь не найден - отправляем 401
          logger.warn("User not found for email: " + userEmail);
          sendUnauthorizedResponse(response, "User not found");
          return;
        }
      }
    } catch (Exception e) {
      // Ошибка при обработке JWT токена
      logger.error("JWT processing error: " + e.getMessage());
      sendUnauthorizedResponse(response, "Invalid token");
      return;
    }

    filterChain.doFilter(request, response);
  }

  private void sendUnauthorizedResponse(HttpServletResponse response, String message) throws IOException {
    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    response.setContentType("application/json");
    response.setCharacterEncoding("UTF-8");
    response.getWriter().write("{\"error\": \"" + message + "\"}");
    response.getWriter().flush();
  }
}