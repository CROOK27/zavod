package com.alibou.security.branch;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/branches")
@RequiredArgsConstructor
public class BranchController {

    private final BranchService branchService;

    // Получить все филиалы
    @GetMapping
    public ResponseEntity<List<BranchResponse>> getAllBranches() {
        List<Branch> branches = branchService.getAllBranchesWithDetails();
        List<BranchResponse> response = branches.stream()
                .map(BranchResponse::fromBranch)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // Получить филиал по ID
    @GetMapping("/{id}")
    public ResponseEntity<BranchResponse> getBranchById(@PathVariable Long id) {
        Optional<Branch> branch = branchService.getBranchByIdWithDetails(id);
        return branch.map(b -> ResponseEntity.ok(BranchResponse.fromBranch(b)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Создать филиал
    @PostMapping
    public ResponseEntity<BranchResponse> createBranch(@RequestBody BranchRequest request) {
        try {
            Branch createdBranch = branchService.createBranch(request);
            // Используем метод с деталями для получения полной информации
            Branch branchWithDetails = branchService.getBranchByIdWithDetails(createdBranch.getId())
                    .orElse(createdBranch);
            BranchResponse response = BranchResponse.fromBranch(branchWithDetails);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Обновить филиал
    @PutMapping("/{id}")
    public ResponseEntity<BranchResponse> updateBranch(@PathVariable Long id, @RequestBody BranchRequest request) {
        try {
            Branch updatedBranch = branchService.updateBranch(id, request);
            BranchResponse response = BranchResponse.fromBranch(updatedBranch);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Удалить филиал
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBranch(@PathVariable Long id) {
        try {
            branchService.deleteBranch(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Поиск филиалов
    @GetMapping("/search")
    public ResponseEntity<List<BranchResponse>> searchBranches(@RequestParam String name) {
        List<Branch> branches = branchService.searchBranches(name);
        List<BranchResponse> response = branches.stream()
                .map(BranchResponse::fromBranch)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }
}
