package com.alibou.security.position;

import com.alibou.security.unit.UnitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/position")
public class PositionController {
    private final PositionService positionService;

    @Autowired
    public PositionController(PositionService positionService) {
        this.positionService = positionService;
    }

    @PostMapping
    public Position createPosition(@RequestBody Position position){
        return positionService.savePosition(position);
    }
    @GetMapping
    public List<Position> getAllPositions() {return positionService.getAllPositions();}
}
