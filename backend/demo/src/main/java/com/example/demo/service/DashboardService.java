package com.example.demo.service;

import com.example.demo.dto.DashboardStats;
import com.example.demo.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final EmployeeRepository employeeRepository;
    private final DepartmentRepository departmentRepository;
    private final DesignationRepository designationRepository;
    private final AttendanceRepository attendanceRepository;
    private final PerformanceRepository performanceRepository;
    private final SalaryRepository salaryRepository;

    public DashboardStats getStats() {

        DashboardStats stats = new DashboardStats();

        stats.setTotalEmployees(employeeRepository.count());
        stats.setTotalDepartments(departmentRepository.count());
        stats.setTotalDesignations(designationRepository.count());
        stats.setTotalAttendanceRecords(attendanceRepository.count());
        stats.setTotalPerformanceRecords(performanceRepository.count());
        stats.setTotalSalaryRecords(salaryRepository.count());

        return stats;
    }
}