package com.sharingiscaring.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class MemberBalanceDto {
    private Long userId;
    private String username;
    private String fullName;
    private BigDecimal totalSpent;
    private BigDecimal share;
    private BigDecimal balance; // positive = gets money, negative = owes money
}



