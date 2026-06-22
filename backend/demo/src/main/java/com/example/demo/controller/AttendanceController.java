package com.example.demo.controller;

import com.example.demo.entity.Attendance;
import com.example.demo.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@CrossOrigin("*")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping
    public List<Attendance> getAllAttendance() {
        return attendanceService.getAllAttendance();
    }

    @GetMapping("/{id}")
    public Attendance getAttendance(@PathVariable Long id) {
        return attendanceService.getAttendanceById(id);
    }

    @PostMapping
    public Attendance addAttendance(@RequestBody Attendance attendance) {
        return attendanceService.addAttendance(attendance);
    }

    @PutMapping("/{id}")
    public Attendance updateAttendance(
            @PathVariable Long id,
            @RequestBody Attendance attendance
    ) {
        return attendanceService.updateAttendance(id, attendance);
    }

    @DeleteMapping("/{id}")
    public String deleteAttendance(@PathVariable Long id) {
        attendanceService.deleteAttendance(id);
        return "Attendance deleted successfully";
    }

    @GetMapping("/employee/{employeeId}")
    public List<Attendance> getByEmployeeId(@PathVariable Long employeeId) {
        return attendanceService.getByEmployeeId(employeeId);
    }

    @GetMapping("/status/{status}")
    public List<Attendance> getByStatus(@PathVariable String status) {
        return attendanceService.getByStatus(status);
    }
}