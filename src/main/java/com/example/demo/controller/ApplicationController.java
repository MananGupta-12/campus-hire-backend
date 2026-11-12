package com.example.demo.controller;

import com.example.demo.model.JobApplication;
import com.example.demo.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @PostMapping("/apply")
    public JobApplication applyForJob(@RequestBody JobApplication application) {
        return applicationRepository.save(application);
    }

    @GetMapping("/job/{vacancyId}")
    public List<JobApplication> getApplicantsForJob(@PathVariable Long vacancyId) {
        return applicationRepository.findByVacancyId(vacancyId);
    }

    // --- NEW ENDPOINT ADDED BELOW ---
    // This allows applications.js to fetch jobs for a specific logged-in student
    @GetMapping("/student/{email}")
    public List<JobApplication> getApplicationsByStudent(@PathVariable String email) {
        return applicationRepository.findByStudentEmail(email);
    }
}