package com.example.demo.controller;

import com.example.demo.model.Recruiter;
import com.example.demo.repository.RecruiterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recruiters")
@CrossOrigin(origins = "*")
public class RecruiterController {

    @Autowired
    private RecruiterRepository recruiterRepository;

    @PostMapping("/register")
    public Recruiter registerRecruiter(@RequestBody Recruiter recruiter) {
        return recruiterRepository.save(recruiter);
    }
}