package com.alibou.security.position;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PositionService {
    private final PositionRepository positionRepository;

    public PositionService(PositionRepository positionRepository) {
        this.positionRepository = positionRepository;
    }

    public Position createPosition(PositionRequest request) {
        // Проверяем, существует ли должность с таким названием
        if (positionRepository.findByName(request.getName()).isPresent()) {
            throw new RuntimeException("Должность с названием '" + request.getName() + "' уже существует");
        }

        Position position = new Position();
        position.setName(request.getName());
        position.setSalary(request.getSalary());
        position.setGrade(request.getGrade());

        return positionRepository.save(position);
    }

    public Position updatePosition(Long id, PositionRequest request) {
        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Должность не найдена"));

        // Проверяем, не используется ли название другой должностью
        Optional<Position> existingPosition = positionRepository.findByName(request.getName());
        if (existingPosition.isPresent() && !existingPosition.get().getId().equals(id)) {
            throw new RuntimeException("Должность с названием '" + request.getName() + "' уже существует");
        }

        position.setName(request.getName());
        position.setSalary(request.getSalary());
        position.setGrade(request.getGrade());

        return positionRepository.save(position);
    }

    public void deletePosition(Long id) {
        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Должность не найдена"));

        // Можно добавить проверку, используется ли должность сотрудниками
        // перед удалением

        positionRepository.delete(position);
    }

    public List<Position> getAllPositions() {
        return positionRepository.findAll();
    }

    public Optional<Position> getPositionById(Long id) {
        return positionRepository.findById(id);
    }

    // Специальные запросы
    public List<Object[]> getSalarySumByPosition() {
        return positionRepository.findSalarySumByPosition();
    }

    public List<Object[]> getAverageSalaryByPositionWithCondition() {
        return positionRepository.findAverageSalaryByPositionWithCondition();
    }

    public List<Object[]> getMinMaxSalary() {
        return positionRepository.findMinMaxSalary();
    }

    public List<Position> findByGrade(Integer grade) {
        return positionRepository.findByGrade(grade);
    }

    public List<Position> findBySalaryBetween(Double minSalary, Double maxSalary) {
        return positionRepository.findBySalaryBetween(minSalary, maxSalary);
    }
}