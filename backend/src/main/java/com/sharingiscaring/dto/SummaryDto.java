package com.sharingiscaring.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
public class SummaryDto {
    private Long roomId;
    private String roomName;
    private String month;
    private BigDecimal totalExpenses;
    private Integer totalMembers;
    private BigDecimal perPersonShare;
    private List<MemberBalanceDto> memberBalances;
    private List<SettlementDto> settlements;
    private Map<String, BigDecimal> expensesByCategory;
    private Map<String, BigDecimal> expensesByMember;
}



