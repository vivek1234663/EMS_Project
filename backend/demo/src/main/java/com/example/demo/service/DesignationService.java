package com.example.demo.service;

import com.example.demo.entity.Designation;
import com.example.demo.repository.DesignationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DesignationService {

    private final DesignationRepository designationRepository;

    public List<Designation> getAllDesignations() {
        return designationRepository.findAll();
    }

    public Designation getDesignationById(Long id) {
        return designationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Designation not found with id: " + id));
    }

    public Designation addDesignation(Designation designation) {

        if (designationRepository.findByTitle(designation.getTitle()).isPresent()) {
            throw new RuntimeException("Designation title already exists");
        }

        return designationRepository.save(designation);
    }

    public Designation updateDesignation(Long id, Designation updatedDesignation) {

        Designation designation = getDesignationById(id);

        designation.setTitle(updatedDesignation.getTitle());
        designation.setDepartment(updatedDesignation.getDepartment());
        designation.setLevel(updatedDesignation.getLevel());

        return designationRepository.save(designation);
    }

    public void deleteDesignation(Long id) {
        Designation designation = getDesignationById(id);
        designationRepository.delete(designation);
    }
}