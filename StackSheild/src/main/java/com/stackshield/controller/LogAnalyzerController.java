package com.stackshield.controller;


import com.stackshield.model.Alert;
import com.stackshield.model.AnalyzedLog;
import com.stackshield.service.LogAnalyzerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/logs")

public class LogAnalyzerController {

    @Autowired
    private LogAnalyzerService logAnalyzerService;

//    @PostMapping("/analyzeFile")
//    public ResponseEntity<List<Alert>> analyzeLogFile(@RequestParam("file") MultipartFile file) throws IOException {
//        List<Alert> alerts = logAnalyzerService.analyzeLogs(file);
//        return ResponseEntity.ok(alerts);
//    }

//    @PostMapping("/api/logs/analyzeFile")
//    public ResponseEntity<?> analyzeFile(@RequestParam("file") MultipartFile file) throws IOException {
//        List<Alert> alerts = logAnalyzerService.analyzeLogs(file);
//        // logic to read and analyze the file
//        return ResponseEntity.ok(alerts);
//    }

    public LogAnalyzerController(LogAnalyzerService logAnalyzerService) {
        this.logAnalyzerService = logAnalyzerService;
    }

    @PostMapping("/analyzeFile")
    public ResponseEntity<List<AnalyzedLog>> analyzeLogs(@RequestParam("file") MultipartFile file) throws IOException {
        List<AnalyzedLog> alerts = logAnalyzerService.analyzeLogs(file);
        return ResponseEntity.ok(alerts);
    }
}
