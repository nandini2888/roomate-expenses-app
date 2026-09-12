package com.sharingiscaring.repository;

import com.sharingiscaring.model.ExpenseSplit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ExpenseSplitRepository extends JpaRepository<ExpenseSplit, Long> {
    List<ExpenseSplit> findByExpenseId(Long expenseId);
    
    @Query("SELECT COALESCE(SUM(es.amount), 0) FROM ExpenseSplit es " +
           "WHERE es.expense.id = :expenseId")
    BigDecimal getTotalSplitAmount(@Param("expenseId") Long expenseId);
}



