package com.alibou.security.unit;

import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UnitService {

    private final UnitRepository unitRepository;

    public UnitService (UnitRepository unitRepository) {
        this.unitRepository = unitRepository;
    }
    public Optional<Unit> getUserById(Long id) {
        return unitRepository.findById(id);
    }
}
