package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "vacancies")
public class Vacancy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;
    private String jobTitle;
    private String location;

    // New fields matching your updated HTML UI
    private Double packageLpa;
    private Double cgpa;

    @Column(length = 1000) // Gives extra room for a long list of skills
    private String skills;

    private LocalDate deadline;
}