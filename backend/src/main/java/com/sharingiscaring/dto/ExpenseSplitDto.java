package com.sharingiscaring.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ExpenseSplitDto {
    private Long id;
    private Long userId;
    private String username;
    private String fullName;
    private BigDecimal amount;
    private BigDecimal percentage;
}



