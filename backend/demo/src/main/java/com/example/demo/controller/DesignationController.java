package com.example.demo.controller;

import com.example.demo.entity.Designation;
import com.example.demo.service.DesignationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/designations")
@RequiredArgsConstructor
@CrossOrigin("*")
public class DesignationController {

    private final DesignationService designationService;

    @GetMapping
    public List<Designation> getDesignations() {
        return designationService.getAllDesignations();
    }

    @GetMapping("/{id}")
    public Designation getDesignation(@PathVariable Long id) {
        return designationService.getDesignationById(id);
    }

    @PostMapping
    public Designation addDesignation(@RequestBody Designation designation) {
        return designationService.addDesignation(designation);
    }

    @PutMapping("/{id}")
    public Designation updateDesignation(
            @PathVariable Long id,
            @RequestBody Designation designation
    ) {
        return designationService.updateDesignation(id, designation);
    }

    @DeleteMapping("/{id}")
    public String deleteDesignation(@PathVariable Long id) {
        designationService.deleteDesignation(id);
        return "Designation deleted successfully";
    }
}