package com.stackshield.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.Map;
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class AnalyzedLog {
    private Map<String, Object> log;
    private Alert alert;

    public AnalyzedLog(Map<String, Object> log, Alert alert) {
        this.log = log;
        this.alert = alert;
    }

    // getters & setters
}
