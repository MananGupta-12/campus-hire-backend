package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "students")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String email;
    private String password;
    private String rollNumber;
    private String branch;

    // --- NEW FIELDS FOR THE PROFILE PAGE ---
    private String phone;
    private Double cgpa;

    @Column(length = 1000) // Extra space for a long list of skills
    private String skills;
}