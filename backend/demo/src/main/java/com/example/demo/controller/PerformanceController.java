package com.example.demo.controller;

import com.example.demo.entity.Performance;
import com.example.demo.service.PerformanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/performance")
@RequiredArgsConstructor
@CrossOrigin("*")
public class PerformanceController {

    private final PerformanceService performanceService;

    @GetMapping
    public List<Performance> getAllPerformance() {
        return performanceService.getAllPerformance();
    }

    @GetMapping("/{id}")
    public Performance getPerformance(@PathVariable Long id) {
        return performanceService.getPerformanceById(id);
    }

    @PostMapping
    public Performance addPerformance(@RequestBody Performance performance) {
        return performanceService.addPerformance(performance);
    }

    @PutMapping("/{id}")
    public Performance updatePerformance(
            @PathVariable Long id,
            @RequestBody Performance performance
    ) {
        return performanceService.updatePerformance(id, performance);
    }

    @DeleteMapping("/{id}")
    public String deletePerformance(@PathVariable Long id) {
        performanceService.deletePerformance(id);
        return "Performance deleted successfully";
    }

    @GetMapping("/employee/{employeeId}")
    public List<Performance> getByEmployeeId(@PathVariable Long employeeId) {
        return performanceService.getByEmployeeId(employeeId);
    }

    @GetMapping("/department/{department}")
    public List<Performance> getByDepartment(@PathVariable String department) {
        return performanceService.getByDepartment(department);
    }

    @GetMapping("/status/{status}")
    public List<Performance> getByStatus(@PathVariable String status) {
        return performanceService.getByStatus(status);
    }
}