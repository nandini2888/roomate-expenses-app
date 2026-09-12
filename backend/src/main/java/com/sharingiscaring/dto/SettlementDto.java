package com.sharingiscaring.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SettlementDto {
    private Long fromUserId;
    private String fromUsername;
    private String fromFullName;
    private Long toUserId;
    private String toUsername;
    private String toFullName;
    private BigDecimal amount;
}



