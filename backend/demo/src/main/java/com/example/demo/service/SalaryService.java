package com.example.demo.service;

import com.example.demo.entity.Salary;
import com.example.demo.repository.SalaryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SalaryService {

    private final SalaryRepository salaryRepository;

    public List<Salary> getAllSalary() {
        return salaryRepository.findAll();
    }

    public Salary getSalaryById(Long id) {
        return salaryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Salary record not found with id: " + id));
    }

    public Salary addSalary(Salary salary) {
        calculateNetSalary(salary);
        return salaryRepository.save(salary);
    }

    public Salary updateSalary(Long id, Salary updatedSalary) {

        Salary salary = getSalaryById(id);

        salary.setEmployeeId(updatedSalary.getEmployeeId());
        salary.setEmployeeName(updatedSalary.getEmployeeName());
        salary.setMonth(updatedSalary.getMonth());
        salary.setBasicSalary(updatedSalary.getBasicSalary());
        salary.setWorkingDays(updatedSalary.getWorkingDays());
        salary.setPresentDays(updatedSalary.getPresentDays());
        salary.setDeductions(updatedSalary.getDeductions());
        salary.setPaymentStatus(updatedSalary.getPaymentStatus());

        calculateNetSalary(salary);

        return salaryRepository.save(salary);
    }

    public void deleteSalary(Long id) {
        Salary salary = getSalaryById(id);
        salaryRepository.delete(salary);
    }

    public List<Salary> getByEmployeeId(Long employeeId) {
        return salaryRepository.findByEmployeeId(employeeId);
    }

    public List<Salary> getByMonth(String month) {
        return salaryRepository.findByMonth(month);
    }

    public List<Salary> getByPaymentStatus(String status) {
        return salaryRepository.findByPaymentStatus(status);
    }

    private void calculateNetSalary(Salary salary) {

        Double basicSalary = salary.getBasicSalary() == null ? 0.0 : salary.getBasicSalary();
        Integer workingDays = salary.getWorkingDays() == null || salary.getWorkingDays() == 0 ? 1 : salary.getWorkingDays();
        Integer presentDays = salary.getPresentDays() == null ? 0 : salary.getPresentDays();
        Double deductions = salary.getDeductions() == null ? 0.0 : salary.getDeductions();

        double perDaySalary = basicSalary / workingDays;
        double netSalary = (perDaySalary * presentDays) - deductions;

        salary.setNetSalary(netSalary);

        if (salary.getPaymentStatus() == null || salary.getPaymentStatus().isBlank()) {
            salary.setPaymentStatus("Pending");
        }
    }
}