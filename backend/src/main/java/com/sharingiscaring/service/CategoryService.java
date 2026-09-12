package com.sharingiscaring.service;

import com.sharingiscaring.model.Category;
import com.sharingiscaring.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.List;

@Service
public class CategoryService {
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
    
    @PostConstruct
    public void initializeCategories() {
        if (categoryRepository.count() == 0) {
            categoryRepository.save(new Category("Rent"));
            categoryRepository.save(new Category("Groceries"));
            categoryRepository.save(new Category("Utilities"));
            categoryRepository.save(new Category("Internet"));
            categoryRepository.save(new Category("Maintenance"));
            categoryRepository.save(new Category("Cleaning"));
            categoryRepository.save(new Category("Other"));
        }
    }
}

