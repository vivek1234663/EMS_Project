package com.example.demo.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "designations")
public class Designation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String department;

    private String level;

    public Designation() {
    }

    public Designation(Long id, String title, String department, String level) {
        this.id = id;
        this.title = title;
        this.department = department;
        this.level = level;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDepartment() {
        return department;
    }

    public String getLevel() {
        return level;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public void setLevel(String level) {
        this.level = level;
    }
}