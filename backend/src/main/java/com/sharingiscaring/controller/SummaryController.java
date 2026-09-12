package com.sharingiscaring.controller;

import com.sharingiscaring.dto.SummaryDto;
import com.sharingiscaring.service.SummaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/summary")
@CrossOrigin(origins = "*")
public class SummaryController {
    
    @Autowired
    private SummaryService summaryService;
    
    @GetMapping("/{roomId}")
    public ResponseEntity<SummaryDto> getSummary(
            @PathVariable Long roomId,
            @RequestParam int year,
            @RequestParam int month) {
        SummaryDto summary = summaryService.getSummary(roomId, year, month);
        return ResponseEntity.ok(summary);
    }
}



