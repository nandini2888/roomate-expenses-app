package com.sharingiscaring.dto;

import com.sharingiscaring.model.Expense;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ExpenseDto {
    private Long id;
    private BigDecimal amount;
    private String description;
    private LocalDate expenseDate;
    private Long roomId;
    private String roomName;
    private Long paidById;
    private String paidByUsername;
    private String paidByFullName;
    private Long categoryId;
    private String categoryName;
    private Expense.SplitType splitType;
    private List<ExpenseSplitDto> splits;
    private Boolean hasBill;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}



