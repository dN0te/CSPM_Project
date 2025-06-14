package com.stackshield.model;

public class Issue {
    private String description;
    private String fileName;
    private int lineNumber;

    public Issue(String description, String fileName, int lineNumber) {
        this.description = description;
        this.fileName = fileName;
        this.lineNumber = lineNumber;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public int getLineNumber() {
        return lineNumber;
    }

    public void setLineNumber(int lineNumber) {
        this.lineNumber = lineNumber;
    }
}
