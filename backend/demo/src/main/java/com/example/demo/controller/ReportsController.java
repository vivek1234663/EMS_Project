package com.example.demo.controller;

import com.example.demo.entity.Employee;
import com.example.demo.entity.Attendance;
import com.example.demo.entity.Salary;
import com.example.demo.entity.Performance;

import com.example.demo.service.ReportsService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:5173")
public class ReportsController {

    private final ReportsService reportsService;

    public ReportsController(ReportsService reportsService) {
        this.reportsService = reportsService;
    }

    @GetMapping("/employees")
    public List<Employee> getEmployeeReport() {
        return reportsService.getEmployeeReport();
    }

    @GetMapping("/attendance")
    public List<Attendance> getAttendanceReport() {
        return reportsService.getAttendanceReport();
    }

    @GetMapping("/salary")
    public List<Salary> getSalaryReport() {
        return reportsService.getSalaryReport();
    }

    @GetMapping("/performance")
    public List<Performance> getPerformanceReport() {
        return reportsService.getPerformanceReport();
    }
}