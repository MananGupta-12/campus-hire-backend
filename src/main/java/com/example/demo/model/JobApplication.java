package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "applications")
public class JobApplication {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long vacancyId;

    // For simplicity in this project, saving the student details directly in the application
    private String studentName;
    private String studentRollNumber;
    private String studentEmail;

    private String status = "Pending"; // Pending, Accepted, or Rejected
    private LocalDate appliedDate = LocalDate.now();
}