package com.example.demo.service;

import com.example.demo.entity.Department;
import com.example.demo.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));
    }

    public Department addDepartment(Department department) {

        if (departmentRepository.findByName(department.getName()).isPresent()) {
            throw new RuntimeException("Department name already exists");
        }

        return departmentRepository.save(department);
    }

    public Department updateDepartment(Long id, Department updatedDepartment) {

        Department department = getDepartmentById(id);

        department.setName(updatedDepartment.getName());
        department.setDescription(updatedDepartment.getDescription());
        department.setDepartmentHead(updatedDepartment.getDepartmentHead());
        department.setTotalEmployees(updatedDepartment.getTotalEmployees());

        return departmentRepository.save(department);
    }

    public void deleteDepartment(Long id) {
        Department department = getDepartmentById(id);
        departmentRepository.delete(department);
    }
}