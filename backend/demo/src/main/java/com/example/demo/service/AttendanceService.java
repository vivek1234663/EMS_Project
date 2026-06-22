package com.example.demo.service;

import com.example.demo.entity.Attendance;
import com.example.demo.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    public Attendance getAttendanceById(Long id) {
        return attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance not found with id: " + id));
    }

    public Attendance addAttendance(Attendance attendance) {
        return attendanceRepository.save(attendance);
    }

    public Attendance updateAttendance(Long id, Attendance updatedAttendance) {

        Attendance attendance = getAttendanceById(id);

        attendance.setEmployeeId(updatedAttendance.getEmployeeId());
        attendance.setEmployeeName(updatedAttendance.getEmployeeName());
        attendance.setDate(updatedAttendance.getDate());
        attendance.setCheckIn(updatedAttendance.getCheckIn());
        attendance.setCheckOut(updatedAttendance.getCheckOut());
        attendance.setStatus(updatedAttendance.getStatus());

        return attendanceRepository.save(attendance);
    }

    public void deleteAttendance(Long id) {
        Attendance attendance = getAttendanceById(id);
        attendanceRepository.delete(attendance);
    }

    public List<Attendance> getByEmployeeId(Long employeeId) {
        return attendanceRepository.findByEmployeeId(employeeId);
    }

    public List<Attendance> getByStatus(String status) {
        return attendanceRepository.findByStatus(status);
    }
}