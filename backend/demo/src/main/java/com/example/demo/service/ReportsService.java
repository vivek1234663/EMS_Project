package com.example.demo.service;

import com.example.demo.entity.Employee;
import com.example.demo.entity.Attendance;
import com.example.demo.entity.Salary;
import com.example.demo.entity.Performance;

import com.example.demo.repository.EmployeeRepository;
import com.example.demo.repository.AttendanceRepository;
import com.example.demo.repository.SalaryRepository;
import com.example.demo.repository.PerformanceRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReportsService {

    private final EmployeeRepository employeeRepository;
    private final AttendanceRepository attendanceRepository;
    private final SalaryRepository salaryRepository;
    private final PerformanceRepository performanceRepository;

    public ReportsService(
            EmployeeRepository employeeRepository,
            AttendanceRepository attendanceRepository,
            SalaryRepository salaryRepository,
            PerformanceRepository performanceRepository
    ) {
        this.employeeRepository = employeeRepository;
        this.attendanceRepository = attendanceRepository;
        this.salaryRepository = salaryRepository;
        this.performanceRepository = performanceRepository;
    }

    public List<Employee> getEmployeeReport() {
        return employeeRepository.findAll();
    }

    public List<Attendance> getAttendanceReport() {
        return attendanceRepository.findAll();
    }

    public List<Salary> getSalaryReport() {
        return salaryRepository.findAll();
    }

    public List<Performance> getPerformanceReport() {
        return performanceRepository.findAll();
    }
}