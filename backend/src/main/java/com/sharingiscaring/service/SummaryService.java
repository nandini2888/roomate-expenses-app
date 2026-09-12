package com.sharingiscaring.service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sharingiscaring.dto.MemberBalanceDto;
import com.sharingiscaring.dto.SettlementDto;
import com.sharingiscaring.dto.SummaryDto;
import com.sharingiscaring.model.Expense;
import com.sharingiscaring.model.ExpenseSplit;
import com.sharingiscaring.model.Room;
import com.sharingiscaring.model.RoomMember;
import com.sharingiscaring.repository.ExpenseRepository;
import com.sharingiscaring.repository.RoomMemberRepository;
import com.sharingiscaring.repository.RoomRepository;

@Service
public class SummaryService {
    
    @Autowired
    private RoomRepository roomRepository;
    
    @Autowired
    private ExpenseRepository expenseRepository;
    
    @Autowired
    private RoomMemberRepository roomMemberRepository;
    
    public SummaryDto getSummary(Long roomId, int year, int month) {
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        
        List<Expense> expenses = expenseRepository.findByRoomIdAndMonth(roomId, year, month);
        List<RoomMember> members = roomMemberRepository.findByRoomId(roomId);
        
        // Calculate totals
        BigDecimal totalExpenses = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        int memberCount = members.size();
        BigDecimal perPersonShare = memberCount > 0 
                ? totalExpenses.divide(BigDecimal.valueOf(memberCount), 2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;
        
        // Calculate member balances
        Map<Long, BigDecimal> totalSpent = new HashMap<>();
        Map<Long, BigDecimal> totalShare = new HashMap<>();
        
        // Initialize maps
        for (RoomMember member : members) {
            totalSpent.put(member.getUser().getId(), BigDecimal.ZERO);
            totalShare.put(member.getUser().getId(), BigDecimal.ZERO);
        }
        
        // Calculate spent (from expenses paid)
        for (Expense expense : expenses) {
            Long paidById = expense.getPaidBy().getId();
            totalSpent.put(paidById, totalSpent.get(paidById).add(expense.getAmount()));
        }
        
        // Calculate share (from splits)
        for (Expense expense : expenses) {
            for (ExpenseSplit split : expense.getSplits()) {
                Long userId = split.getUser().getId();
                totalShare.put(userId, totalShare.get(userId).add(split.getAmount()));
            }
        }
        
        // Create member balances
        List<MemberBalanceDto> memberBalances = members.stream()
                .map(member -> {
                    MemberBalanceDto balance = new MemberBalanceDto();
                    balance.setUserId(member.getUser().getId());
                    balance.setUsername(member.getUser().getUsername());
                    balance.setFullName(member.getUser().getFullName());
                    balance.setTotalSpent(totalSpent.get(member.getUser().getId()));
                    balance.setShare(totalShare.get(member.getUser().getId()));
                    balance.setBalance(totalSpent.get(member.getUser().getId())
                            .subtract(totalShare.get(member.getUser().getId())));
                    return balance;
                })
                .collect(Collectors.toList());
        
        // Calculate expenses by category
        Map<String, BigDecimal> expensesByCategory = expenses.stream()
                .collect(Collectors.groupingBy(
                        e -> e.getCategory() != null ? e.getCategory().getName() : "Uncategorized",
                        Collectors.reducing(BigDecimal.ZERO, Expense::getAmount, BigDecimal::add)
                ));
        
        // Calculate expenses by member (who paid)
        Map<String, BigDecimal> expensesByMember = expenses.stream()
                .collect(Collectors.groupingBy(
                        e -> e.getPaidBy().getFullName(),
                        Collectors.reducing(BigDecimal.ZERO, Expense::getAmount, BigDecimal::add)
                ));
        
        // Calculate settlements
        List<SettlementDto> settlements = calculateSettlements(memberBalances);
        
        SummaryDto summary = new SummaryDto();
        summary.setRoomId(room.getId());
        summary.setRoomName(room.getName());
        summary.setMonth(String.format("%04d-%02d", year, month));
        summary.setTotalExpenses(totalExpenses);
        summary.setTotalMembers(memberCount);
        summary.setPerPersonShare(perPersonShare);
        summary.setMemberBalances(memberBalances);
        summary.setSettlements(settlements);
        summary.setExpensesByCategory(expensesByCategory);
        summary.setExpensesByMember(expensesByMember);
        
        return summary;
    }
    
    private List<SettlementDto> calculateSettlements(List<MemberBalanceDto> balances) {
        List<SettlementDto> settlements = new ArrayList<>();
        
        // Separate debtors (negative balance) and creditors (positive balance)
        List<MemberBalanceDto> debtors = balances.stream()
                .filter(b -> b.getBalance().compareTo(BigDecimal.ZERO) < 0)
                .sorted(Comparator.comparing(MemberBalanceDto::getBalance))
                .collect(Collectors.toList());
        
        List<MemberBalanceDto> creditors = balances.stream()
                .filter(b -> b.getBalance().compareTo(BigDecimal.ZERO) > 0)
                .sorted(Comparator.comparing(MemberBalanceDto::getBalance).reversed())
                .collect(Collectors.toList());
        
        int debtorIndex = 0;
        int creditorIndex = 0;
        
        while (debtorIndex < debtors.size() && creditorIndex < creditors.size()) {
            MemberBalanceDto debtor = debtors.get(debtorIndex);
            MemberBalanceDto creditor = creditors.get(creditorIndex);
            
            BigDecimal debt = debtor.getBalance().abs();
            BigDecimal credit = creditor.getBalance();
            
            BigDecimal settlementAmount = debt.min(credit);
            
            SettlementDto settlement = new SettlementDto();
            settlement.setFromUserId(debtor.getUserId());
            settlement.setFromUsername(debtor.getUsername());
            settlement.setFromFullName(debtor.getFullName());
            settlement.setToUserId(creditor.getUserId());
            settlement.setToUsername(creditor.getUsername());
            settlement.setToFullName(creditor.getFullName());
            settlement.setAmount(settlementAmount);
            
            settlements.add(settlement);
            
            // Update balances
            debtor.setBalance(debtor.getBalance().add(settlementAmount));
            creditor.setBalance(creditor.getBalance().subtract(settlementAmount));
            
            if (debtor.getBalance().compareTo(BigDecimal.ZERO) == 0) {
                debtorIndex++;
            }
            if (creditor.getBalance().compareTo(BigDecimal.ZERO) == 0) {
                creditorIndex++;
            }
        }
        
        return settlements;
    }
}

