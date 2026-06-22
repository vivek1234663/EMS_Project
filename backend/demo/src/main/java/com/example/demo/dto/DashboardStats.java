package com.example.demo.dto;

public class DashboardStats {

    private long totalEmployees;
    private long totalDepartments;
    private long totalDesignations;
    private long totalAttendanceRecords;
    private long totalPerformanceRecords;
    private long totalSalaryRecords;

    public DashboardStats() {
    }

    public long getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(long totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

    public long getTotalDepartments() {
        return totalDepartments;
    }

    public void setTotalDepartments(long totalDepartments) {
        this.totalDepartments = totalDepartments;
    }

    public long getTotalDesignations() {
        return totalDesignations;
    }

    public void setTotalDesignations(long totalDesignations) {
        this.totalDesignations = totalDesignations;
    }

    public long getTotalAttendanceRecords() {
        return totalAttendanceRecords;
    }

    public void setTotalAttendanceRecords(long totalAttendanceRecords) {
        this.totalAttendanceRecords = totalAttendanceRecords;
    }

    public long getTotalPerformanceRecords() {
        return totalPerformanceRecords;
    }

    public void setTotalPerformanceRecords(long totalPerformanceRecords) {
        this.totalPerformanceRecords = totalPerformanceRecords;
    }

    public long getTotalSalaryRecords() {
        return totalSalaryRecords;
    }

    public void setTotalSalaryRecords(long totalSalaryRecords) {
        this.totalSalaryRecords = totalSalaryRecords;
    }
}