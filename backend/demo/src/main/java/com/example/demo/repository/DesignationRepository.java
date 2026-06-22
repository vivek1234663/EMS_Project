package com.example.demo.repository;

import com.example.demo.entity.Designation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DesignationRepository extends JpaRepository<Designation, Long> {

    Optional<Designation> findByTitle(String title);
}