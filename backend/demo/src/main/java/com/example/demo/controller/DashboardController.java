package com.example.demo.controller;

import com.example.demo.dto.DashboardStats;
import com.example.demo.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin("*")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public DashboardStats getStats() {
        return dashboardService.getStats();
    }
}