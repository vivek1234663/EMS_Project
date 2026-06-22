package com.example.demo.repository;

import com.example.demo.entity.Performance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PerformanceRepository extends JpaRepository<Performance, Long> {

    List<Performance> findByEmployeeId(Long employeeId);

    List<Performance> findByDepartment(String department);

    List<Performance> findByPerformanceStatus(String performanceStatus);
}