package com.stackshield.model;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Alert {
    private String code;
    private String service;
    private String resource;
    private String description;
    private String severity;
    private String recommendation;
    private String hostIp;
    private String hostName;

    public Alert() {}

    public Alert(
            String code,
            String service,
            String resource,
            String description,
            String severity,
            String recommendation,
            String hostIp,
            String hostName
    ) {
        this.code = code;
        this.service = service;
        this.resource = resource;
        this.description = description;
        this.severity = severity;
        this.recommendation = recommendation;
        this.hostIp = hostIp;
        this.hostName = hostName;
    }

    /** serialized as “id” */
    @JsonProperty("id")
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getService() { return service; }
    public void setService(String service) { this.service = service; }

    public String getResource() { return resource; }
    public void setResource(String resource) { this.resource = resource; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }

    public String getRecommendation() { return recommendation; }
    public void setRecommendation(String recommendation) { this.recommendation = recommendation; }

    /** host IP address of the alert origin */
    @JsonProperty("hostIp")
    public String getHostIp() { return hostIp; }
    public void setHostIp(String hostIp) { this.hostIp = hostIp; }

    /** host name of the alert origin */
    @JsonProperty("hostName")
    public String getHostName() { return hostName; }
    public void setHostName(String hostName) { this.hostName = hostName; }
}
