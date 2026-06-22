package com.example.demo.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "performance")
public class Performance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long employeeId;
    private String employeeName;
    private String department;
    private String designation;

    private Integer rating;
    private Double performanceScore;

    private Integer completedTasks;
    private Integer pendingTasks;

    private String performanceStatus;
    private LocalDate reviewDate;

    public Performance() {
    }

    public Performance(Long id, Long employeeId, String employeeName, String department,
                       String designation, Integer rating, Double performanceScore,
                       Integer completedTasks, Integer pendingTasks,
                       String performanceStatus, LocalDate reviewDate) {
        this.id = id;
        this.employeeId = employeeId;
        this.employeeName = employeeName;
        this.department = department;
        this.designation = designation;
        this.rating = rating;
        this.performanceScore = performanceScore;
        this.completedTasks = completedTasks;
        this.pendingTasks = pendingTasks;
        this.performanceStatus = performanceStatus;
        this.reviewDate = reviewDate;
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

    public Integer getRating() {
        return rating;
    }

    public Double getPerformanceScore() {
        return performanceScore;
    }

    public Integer getCompletedTasks() {
        return completedTasks;
    }

    public Integer getPendingTasks() {
        return pendingTasks;
    }

    public String getPerformanceStatus() {
        return performanceStatus;
    }

    public LocalDate getReviewDate() {
        return reviewDate;
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

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public void setPerformanceScore(Double performanceScore) {
        this.performanceScore = performanceScore;
    }

    public void setCompletedTasks(Integer completedTasks) {
        this.completedTasks = completedTasks;
    }

    public void setPendingTasks(Integer pendingTasks) {
        this.pendingTasks = pendingTasks;
    }

    public void setPerformanceStatus(String performanceStatus) {
        this.performanceStatus = performanceStatus;
    }

    public void setReviewDate(LocalDate reviewDate) {
        this.reviewDate = reviewDate;
    }
}