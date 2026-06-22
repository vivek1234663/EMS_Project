package com.example.demo.repository;

import com.example.demo.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    // Search by employee name
    List<Employee> findByNameContainingIgnoreCase(String keyword);

    // Find employee by email
    Optional<Employee> findByEmail(String email);

    // Filter by department
    List<Employee> findByDepartment(String department);

    // Filter by status
    List<Employee> findByStatus(String status);

    // Search by name and department
    List<Employee> findByNameContainingIgnoreCaseAndDepartment(
            String keyword,
            String department
    );
}