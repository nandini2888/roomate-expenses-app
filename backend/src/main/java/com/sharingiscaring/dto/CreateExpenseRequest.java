package com.sharingiscaring.dto;

import com.sharingiscaring.model.Expense;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class CreateExpenseRequest {
    
    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal amount;
    
    @NotBlank
    private String description;
    
    @NotNull
    private LocalDate expenseDate;
    
    @NotNull
    private Long roomId;
    
    @NotNull
    private Long paidById;
    
    private Long categoryId;
    
    private Expense.SplitType splitType = Expense.SplitType.EQUAL;
    
    private List<ExpenseSplitRequest> splits;
}



