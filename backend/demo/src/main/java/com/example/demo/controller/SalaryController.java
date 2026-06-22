package com.example.demo.controller;

import com.example.demo.entity.Salary;
import com.example.demo.service.SalaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/salary")
@RequiredArgsConstructor
@CrossOrigin("*")
public class SalaryController {

    private final SalaryService salaryService;

    @GetMapping
    public List<Salary> getAllSalary() {
        return salaryService.getAllSalary();
    }

    @GetMapping("/{id}")
    public Salary getSalary(@PathVariable Long id) {
        return salaryService.getSalaryById(id);
    }

    @PostMapping
    public Salary addSalary(@RequestBody Salary salary) {
        return salaryService.addSalary(salary);
    }

    @PutMapping("/{id}")
    public Salary updateSalary(
            @PathVariable Long id,
            @RequestBody Salary salary
    ) {
        return salaryService.updateSalary(id, salary);
    }

    @DeleteMapping("/{id}")
    public String deleteSalary(@PathVariable Long id) {
        salaryService.deleteSalary(id);
        return "Salary deleted successfully";
    }

    @GetMapping("/employee/{employeeId}")
    public List<Salary> getByEmployeeId(@PathVariable Long employeeId) {
        return salaryService.getByEmployeeId(employeeId);
    }

    @GetMapping("/month/{month}")
    public List<Salary> getByMonth(@PathVariable String month) {
        return salaryService.getByMonth(month);
    }

    @GetMapping("/status/{status}")
    public List<Salary> getByPaymentStatus(@PathVariable String status) {
        return salaryService.getByPaymentStatus(status);
    }
}