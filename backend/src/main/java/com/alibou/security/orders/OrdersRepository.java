package com.alibou.security.orders;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrdersRepository extends JpaRepository<Orders, Long> {

    Optional<Orders> findById(Long id);
    @Query("SELECT o FROM Orders o WHERE o.employee.user.id = :userId")
    List<Orders> findByUserId(@Param("userId") Long userId);
}
