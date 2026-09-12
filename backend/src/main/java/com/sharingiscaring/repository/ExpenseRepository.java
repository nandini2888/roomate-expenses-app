package com.sharingiscaring.repository;

import com.sharingiscaring.model.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByRoomId(Long roomId);
    
    Page<Expense> findByRoomId(Long roomId, Pageable pageable);
    
    @Query("SELECT e FROM Expense e WHERE e.room.id = :roomId " +
           "AND YEAR(e.expenseDate) = :year AND MONTH(e.expenseDate) = :month")
    List<Expense> findByRoomIdAndMonth(@Param("roomId") Long roomId, 
                                       @Param("year") int year, 
                                       @Param("month") int month);
    
    @Query("SELECT e FROM Expense e WHERE e.room.id = :roomId " +
           "AND e.expenseDate BETWEEN :startDate AND :endDate")
    List<Expense> findByRoomIdAndDateRange(@Param("roomId") Long roomId,
                                           @Param("startDate") LocalDate startDate,
                                           @Param("endDate") LocalDate endDate);
}



