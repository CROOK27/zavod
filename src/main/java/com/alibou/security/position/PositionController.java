package com.alibou.security.position;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/positions")
public class PositionController {
    private final PositionService positionService;

    @Autowired
    public PositionController(PositionService positionService) {
        this.positionService = positionService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createPosition(@RequestBody PositionRequest request) {
        try {
            Position position = positionService.createPosition(request);
            return ResponseEntity.ok(position);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public List<Position> getAllPositions() {
        return positionService.getAllPositions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Position> getPositionById(@PathVariable Long id) {
        return positionService.getPositionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updatePosition(@PathVariable Long id, @RequestBody PositionRequest request) {
        try {
            Position updatedPosition = positionService.updatePosition(id, request);
            return ResponseEntity.ok(updatedPosition);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deletePosition(@PathVariable Long id) {
        try {
            positionService.deletePosition(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Специальные запросы
    @GetMapping("/salary-sum")
    public List<Object[]> getSalarySumByPosition() {
        return positionService.getSalarySumByPosition();
    }

    @GetMapping("/average-salary")
    public List<Object[]> getAverageSalaryByPositionWithCondition() {
        return positionService.getAverageSalaryByPositionWithCondition();
    }

    @GetMapping("/min-max-salary")
    public List<Object[]> getMinMaxSalary() {
        return positionService.getMinMaxSalary();
    }
}