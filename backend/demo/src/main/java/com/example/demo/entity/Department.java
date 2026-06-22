package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "departments")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    private String departmentHead;

    private Integer totalEmployees;

    public Department() {
    }

    public Department(Long id, String name, String description, String departmentHead, Integer totalEmployees) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.departmentHead = departmentHead;
        this.totalEmployees = totalEmployees;
    }

    @PrePersist
    public void setDefaultValues() {
        if (totalEmployees == null) {
            totalEmployees = 0;
        }
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getDepartmentHead() {
        return departmentHead;
    }

    public Integer getTotalEmployees() {
        return totalEmployees;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDepartmentHead(String departmentHead) {
        this.departmentHead = departmentHead;
    }

    public void setTotalEmployees(Integer totalEmployees) {
        this.totalEmployees = totalEmployees;
    }
}