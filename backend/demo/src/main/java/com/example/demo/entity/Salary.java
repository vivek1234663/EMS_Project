package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "salary")
public class Salary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long employeeId;
    private String employeeName;
    private String department;
    private String designation;
    private String month;

    private Double basicSalary;
    private Integer workingDays;
    private Integer presentDays;

    private Double hra;
    private Double medicalAllowance;
    private Double travelAllowance;
    private Double bonus;

    private Double pf;
    private Double healthInsurance;
    private Double professionalTax;
    private Double deductions;

    private Double grossSalary;
    private Double totalDeduction;
    private Double netSalary;

    private String paymentStatus;

    public Salary() {
    }

    public Long getId() {
        return id;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public String getDepartment() {
        return department;
    }

    public String getDesignation() {
        return designation;
    }

    public String getMonth() {
        return month;
    }

    public Double getBasicSalary() {
        return basicSalary;
    }

    public Integer getWorkingDays() {
        return workingDays;
    }

    public Integer getPresentDays() {
        return presentDays;
    }

    public Double getHra() {
        return hra;
    }

    public Double getMedicalAllowance() {
        return medicalAllowance;
    }

    public Double getTravelAllowance() {
        return travelAllowance;
    }

    public Double getBonus() {
        return bonus;
    }

    public Double getPf() {
        return pf;
    }

    public Double getHealthInsurance() {
        return healthInsurance;
    }

    public Double getProfessionalTax() {
        return professionalTax;
    }

    public Double getDeductions() {
        return deductions;
    }

    public Double getGrossSalary() {
        return grossSalary;
    }

    public Double getTotalDeduction() {
        return totalDeduction;
    }

    public Double getNetSalary() {
        return netSalary;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public void setDesignation(String designation) {
        this.designation = designation;
    }

    public void setMonth(String month) {
        this.month = month;
    }

    public void setBasicSalary(Double basicSalary) {
        this.basicSalary = basicSalary;
    }

    public void setWorkingDays(Integer workingDays) {
        this.workingDays = workingDays;
    }

    public void setPresentDays(Integer presentDays) {
        this.presentDays = presentDays;
    }

    public void setHra(Double hra) {
        this.hra = hra;
    }

    public void setMedicalAllowance(Double medicalAllowance) {
        this.medicalAllowance = medicalAllowance;
    }

    public void setTravelAllowance(Double travelAllowance) {
        this.travelAllowance = travelAllowance;
    }

    public void setBonus(Double bonus) {
        this.bonus = bonus;
    }

    public void setPf(Double pf) {
        this.pf = pf;
    }

    public void setHealthInsurance(Double healthInsurance) {
        this.healthInsurance = healthInsurance;
    }

    public void setProfessionalTax(Double professionalTax) {
        this.professionalTax = professionalTax;
    }

    public void setDeductions(Double deductions) {
        this.deductions = deductions;
    }

    public void setGrossSalary(Double grossSalary) {
        this.grossSalary = grossSalary;
    }

    public void setTotalDeduction(Double totalDeduction) {
        this.totalDeduction = totalDeduction;
    }

    public void setNetSalary(Double netSalary) {
        this.netSalary = netSalary;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }
}