package com.example.demo.repository;

import com.example.demo.model.JobApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<JobApplication, Long> {

    // For the recruiter to see applicants for a specific job
    List<JobApplication> findByVacancyId(Long vacancyId);

    // For the student to see all jobs they applied to
    List<JobApplication> findByStudentEmail(String studentEmail);
}