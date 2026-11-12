package com.example.demo.controller;

import com.example.demo.model.Student;
import com.example.demo.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    @Autowired
    private StudentRepository studentRepository;

    @PostMapping("/register")
    public Student registerStudent(@RequestBody Student student) {
        return studentRepository.save(student);
    }

    @GetMapping("/all")
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // --- NEW ENDPOINT TO HANDLE PROFILE UPDATES ---
    @PutMapping("/update")
    public Student updateStudentProfile(@RequestBody Student updatedData) {
        // 1. Find the existing student using their email
        Student existingStudent = studentRepository.findByEmail(updatedData.getEmail());

        if (existingStudent != null) {
            // 2. Update only the new fields submitted from the profile page
            existingStudent.setPhone(updatedData.getPhone());
            existingStudent.setCgpa(updatedData.getCgpa());
            existingStudent.setSkills(updatedData.getSkills());

            // 3. Save the updated profile back to MySQL
            return studentRepository.save(existingStudent);
        }

        return null;
    }
}