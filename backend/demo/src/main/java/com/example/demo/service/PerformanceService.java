package com.example.demo.service;

import com.example.demo.entity.Performance;
import com.example.demo.repository.PerformanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PerformanceService {

    private final PerformanceRepository performanceRepository;

    public List<Performance> getAllPerformance() {
        return performanceRepository.findAll();
    }

    public Performance getPerformanceById(Long id) {
        return performanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Performance record not found with id: " + id));
    }

    public Performance addPerformance(Performance performance) {
        return performanceRepository.save(performance);
    }

    public Performance updatePerformance(Long id, Performance updatedPerformance) {

        Performance performance = getPerformanceById(id);

        performance.setEmployeeId(updatedPerformance.getEmployeeId());
        performance.setEmployeeName(updatedPerformance.getEmployeeName());
        performance.setDepartment(updatedPerformance.getDepartment());
        performance.setDesignation(updatedPerformance.getDesignation());
        performance.setRating(updatedPerformance.getRating());
        performance.setPerformanceScore(updatedPerformance.getPerformanceScore());
        performance.setCompletedTasks(updatedPerformance.getCompletedTasks());
        performance.setPendingTasks(updatedPerformance.getPendingTasks());
        performance.setPerformanceStatus(updatedPerformance.getPerformanceStatus());
        performance.setReviewDate(updatedPerformance.getReviewDate());

        return performanceRepository.save(performance);
    }

    public void deletePerformance(Long id) {
        Performance performance = getPerformanceById(id);
        performanceRepository.delete(performance);
    }

    public List<Performance> getByEmployeeId(Long employeeId) {
        return performanceRepository.findByEmployeeId(employeeId);
    }

    public List<Performance> getByDepartment(String department) {
        return performanceRepository.findByDepartment(department);
    }

    public List<Performance> getByStatus(String status) {
        return performanceRepository.findByPerformanceStatus(status);
    }
}