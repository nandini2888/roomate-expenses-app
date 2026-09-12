package com.sharingiscaring.controller;

import com.sharingiscaring.model.Bill;
import com.sharingiscaring.service.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "*")
public class BillController {
    
    @Autowired
    private BillService billService;
    
    @PostMapping("/upload")
    public ResponseEntity<Bill> uploadBill(@RequestParam("expenseId") Long expenseId,
                                          @RequestParam("file") MultipartFile file) throws IOException {
        Bill bill = billService.uploadBill(expenseId, file);
        return ResponseEntity.ok(bill);
    }
    
    @GetMapping("/{expenseId}")
    public ResponseEntity<byte[]> getBillImage(@PathVariable Long expenseId) throws IOException {
        byte[] imageBytes = billService.getBillImage(expenseId);
        Bill bill = billService.getBill(expenseId);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(bill.getContentType()));
        headers.setContentLength(imageBytes.length);
        headers.setContentDispositionFormData("inline", bill.getFileName());
        
        return new ResponseEntity<>(imageBytes, headers, HttpStatus.OK);
    }
    
    @DeleteMapping("/{expenseId}")
    public ResponseEntity<Void> deleteBill(@PathVariable Long expenseId) throws IOException {
        billService.deleteBill(expenseId);
        return ResponseEntity.noContent().build();
    }
}



