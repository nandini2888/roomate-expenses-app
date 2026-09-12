package com.sharingiscaring.service;

import com.sharingiscaring.dto.CreateExpenseRequest;
import com.sharingiscaring.dto.ExpenseDto;
import com.sharingiscaring.dto.ExpenseSplitDto;
import com.sharingiscaring.model.*;
import com.sharingiscaring.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExpenseService {
    
    @Autowired
    private ExpenseRepository expenseRepository;
    
    @Autowired
    private RoomRepository roomRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;
    
    @Autowired
    private ExpenseSplitRepository expenseSplitRepository;
    
    @Autowired
    private RoomMemberRepository roomMemberRepository;
    
    @Transactional
    public ExpenseDto createExpense(CreateExpenseRequest request) {
        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));
        
        User paidBy = userRepository.findById(request.getPaidById())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Verify user is a member of the room
        if (!roomMemberRepository.existsByRoomIdAndUserId(room.getId(), paidBy.getId())) {
            throw new RuntimeException("User is not a member of this room");
        }
        
        Expense expense = new Expense();
        expense.setAmount(request.getAmount());
        expense.setDescription(request.getDescription());
        expense.setExpenseDate(request.getExpenseDate());
        expense.setRoom(room);
        expense.setPaidBy(paidBy);
        expense.setSplitType(request.getSplitType());
        
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElse(null);
            expense.setCategory(category);
        }
        
        expense = expenseRepository.save(expense);
        
        // Create splits
        if (request.getSplitType() == Expense.SplitType.EQUAL) {
            createEqualSplits(expense, room);
        } else if (request.getSplitType() == Expense.SplitType.CUSTOM && request.getSplits() != null) {
            createCustomSplits(expense, request.getSplits());
        }
        
        return toDto(expense);
    }
    
    private void createEqualSplits(Expense expense, Room room) {
        List<RoomMember> members = roomMemberRepository.findByRoomId(room.getId());
        int memberCount = members.size();
        
        if (memberCount == 0) {
            throw new RuntimeException("Room has no members");
        }
        
        BigDecimal amountPerPerson = expense.getAmount().divide(
                BigDecimal.valueOf(memberCount), 2, RoundingMode.HALF_UP);
        
        for (RoomMember member : members) {
            ExpenseSplit split = new ExpenseSplit();
            split.setExpense(expense);
            split.setUser(member.getUser());
            split.setAmount(amountPerPerson);
            expenseSplitRepository.save(split);
        }
    }
    
    private void createCustomSplits(Expense expense, List<com.sharingiscaring.dto.ExpenseSplitRequest> splitRequests) {
        BigDecimal total = splitRequests.stream()
                .map(com.sharingiscaring.dto.ExpenseSplitRequest::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        if (total.compareTo(expense.getAmount()) != 0) {
            throw new RuntimeException("Split amounts must equal the expense amount");
        }
        
        for (com.sharingiscaring.dto.ExpenseSplitRequest splitRequest : splitRequests) {
            User user = userRepository.findById(splitRequest.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found: " + splitRequest.getUserId()));
            
            ExpenseSplit split = new ExpenseSplit();
            split.setExpense(expense);
            split.setUser(user);
            split.setAmount(splitRequest.getAmount());
            split.setPercentage(splitRequest.getPercentage());
            expenseSplitRepository.save(split);
        }
    }
    
    public Page<ExpenseDto> getExpenses(Long roomId, Pageable pageable) {
        return expenseRepository.findByRoomId(roomId, pageable)
                .map(this::toDto);
    }
    
    public List<ExpenseDto> getExpensesByMonth(Long roomId, int year, int month) {
        List<Expense> expenses = expenseRepository.findByRoomIdAndMonth(roomId, year, month);
        return expenses.stream().map(this::toDto).collect(Collectors.toList());
    }
    
    public ExpenseDto getExpenseById(Long expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        return toDto(expense);
    }
    
    @Transactional
    public ExpenseDto updateExpense(Long expenseId, CreateExpenseRequest request) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        
        // Delete existing splits
        expenseSplitRepository.deleteAll(expense.getSplits());
        
        expense.setAmount(request.getAmount());
        expense.setDescription(request.getDescription());
        expense.setExpenseDate(request.getExpenseDate());
        
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElse(null);
            expense.setCategory(category);
        }
        
        expense.setSplitType(request.getSplitType());
        
        expense = expenseRepository.save(expense);
        
        // Recreate splits
        Room room = expense.getRoom();
        if (request.getSplitType() == Expense.SplitType.EQUAL) {
            createEqualSplits(expense, room);
        } else if (request.getSplitType() == Expense.SplitType.CUSTOM && request.getSplits() != null) {
            createCustomSplits(expense, request.getSplits());
        }
        
        return toDto(expense);
    }
    
    @Transactional
    public void deleteExpense(Long expenseId) {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        expenseRepository.delete(expense);
    }
    
    private ExpenseDto toDto(Expense expense) {
        ExpenseDto dto = new ExpenseDto();
        dto.setId(expense.getId());
        dto.setAmount(expense.getAmount());
        dto.setDescription(expense.getDescription());
        dto.setExpenseDate(expense.getExpenseDate());
        dto.setRoomId(expense.getRoom().getId());
        dto.setRoomName(expense.getRoom().getName());
        dto.setPaidById(expense.getPaidBy().getId());
        dto.setPaidByUsername(expense.getPaidBy().getUsername());
        dto.setPaidByFullName(expense.getPaidBy().getFullName());
        dto.setSplitType(expense.getSplitType());
        dto.setCreatedAt(expense.getCreatedAt());
        dto.setUpdatedAt(expense.getUpdatedAt());
        dto.setHasBill(expense.getBill() != null);
        
        if (expense.getCategory() != null) {
            dto.setCategoryId(expense.getCategory().getId());
            dto.setCategoryName(expense.getCategory().getName());
        }
        
        List<ExpenseSplitDto> splits = expense.getSplits().stream()
                .map(split -> {
                    ExpenseSplitDto splitDto = new ExpenseSplitDto();
                    splitDto.setId(split.getId());
                    splitDto.setUserId(split.getUser().getId());
                    splitDto.setUsername(split.getUser().getUsername());
                    splitDto.setFullName(split.getUser().getFullName());
                    splitDto.setAmount(split.getAmount());
                    splitDto.setPercentage(split.getPercentage());
                    return splitDto;
                })
                .collect(Collectors.toList());
        dto.setSplits(splits);
        
        return dto;
    }
}

