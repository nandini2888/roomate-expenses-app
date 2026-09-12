package com.sharingiscaring.controller;

import com.sharingiscaring.dto.CreateExpenseRequest;
import com.sharingiscaring.dto.ExpenseDto;
import com.sharingiscaring.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "*")
public class ExpenseController {
    
    @Autowired
    private ExpenseService expenseService;
    
    @PostMapping
    public ResponseEntity<ExpenseDto> createExpense(@Valid @RequestBody CreateExpenseRequest request) {
        ExpenseDto expense = expenseService.createExpense(request);
        return ResponseEntity.ok(expense);
    }
    
    @GetMapping
    public ResponseEntity<Page<ExpenseDto>> getExpenses(
            @RequestParam Long roomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "expenseDate") String sortBy,
            @RequestParam(defaultValue = "DESC") Sort.Direction direction) {
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<ExpenseDto> expenses = expenseService.getExpenses(roomId, pageable);
        return ResponseEntity.ok(expenses);
    }
    
    @GetMapping("/month")
    public ResponseEntity<List<ExpenseDto>> getExpensesByMonth(
            @RequestParam Long roomId,
            @RequestParam int year,
            @RequestParam int month) {
        List<ExpenseDto> expenses = expenseService.getExpensesByMonth(roomId, year, month);
        return ResponseEntity.ok(expenses);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ExpenseDto> getExpense(@PathVariable Long id) {
        ExpenseDto expense = expenseService.getExpenseById(id);
        return ResponseEntity.ok(expense);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ExpenseDto> updateExpense(@PathVariable Long id,
                                                    @Valid @RequestBody CreateExpenseRequest request) {
        ExpenseDto expense = expenseService.updateExpense(id, request);
        return ResponseEntity.ok(expense);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }
}

