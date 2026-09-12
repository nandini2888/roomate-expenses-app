package com.sharingiscaring.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ExpenseSplitRequest {
    
    @NotNull
    private Long userId;
    
    @NotNull
    @DecimalMin(value = "0.01")
    private BigDecimal amount;
    
    private BigDecimal percentage;
}



