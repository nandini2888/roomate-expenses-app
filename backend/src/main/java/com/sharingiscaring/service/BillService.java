package com.sharingiscaring.service;

import com.sharingiscaring.model.Bill;
import com.sharingiscaring.model.Expense;
import com.sharingiscaring.repository.BillRepository;
import com.sharingiscaring.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class BillService {
    
    @Value("${file.upload-dir}")
    private String uploadDir;
    
    @Autowired
    private BillRepository billRepository;
    
    @Autowired
    private ExpenseRepository expenseRepository;
    
    @Transactional
    public Bill uploadBill(Long expenseId, MultipartFile file) throws IOException {
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        
        // Check if bill already exists
        Bill existingBill = billRepository.findByExpenseId(expenseId).orElse(null);
        
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String filename = UUID.randomUUID().toString() + extension;
        Path filePath = uploadPath.resolve(filename);
        
        // Save file
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        // Save bill record
        Bill bill = existingBill != null ? existingBill : new Bill();
        bill.setExpense(expense);
        bill.setFileName(originalFilename);
        bill.setFilePath(filePath.toString());
        bill.setContentType(file.getContentType());
        bill.setFileSize(file.getSize());
        
        return billRepository.save(bill);
    }
    
    public Bill getBill(Long expenseId) {
        return billRepository.findByExpenseId(expenseId)
                .orElseThrow(() -> new RuntimeException("Bill not found"));
    }
    
    public byte[] getBillImage(Long expenseId) throws IOException {
        Bill bill = getBill(expenseId);
        Path filePath = Paths.get(bill.getFilePath());
        return Files.readAllBytes(filePath);
    }
    
    @Transactional
    public void deleteBill(Long expenseId) throws IOException {
        Bill bill = billRepository.findByExpenseId(expenseId)
                .orElseThrow(() -> new RuntimeException("Bill not found"));
        
        // Delete file
        Path filePath = Paths.get(bill.getFilePath());
        Files.deleteIfExists(filePath);
        
        // Delete record
        billRepository.delete(bill);
    }
}



