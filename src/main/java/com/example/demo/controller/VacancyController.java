package com.example.demo.controller;

import com.example.demo.model.Vacancy;
import com.example.demo.repository.VacancyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vacancies")
@CrossOrigin(origins = "*")
public class VacancyController {

    @Autowired
    private VacancyRepository vacancyRepository;

    @PostMapping("/create")
    public Vacancy createVacancy(@RequestBody Vacancy vacancy) {
        return vacancyRepository.save(vacancy);
    }

    @GetMapping("/all")
    public List<Vacancy> getAllVacancies() {
        return vacancyRepository.findAll();
    }
}
