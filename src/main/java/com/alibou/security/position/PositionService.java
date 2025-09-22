package com.alibou.security.position;


import com.alibou.security.staffSchedule.StaffSchedule;
import com.alibou.security.unit.UnitRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PositionService {
    private final PositionRepository positionRepository;

    public PositionService (PositionRepository positionRepository) {
        this.positionRepository = positionRepository;
    }

    public List<Position> getAllPositions() {
        return positionRepository.findAll();
    }

    public Position savePosition(Position position){
        return positionRepository.save(position);
    }
}
