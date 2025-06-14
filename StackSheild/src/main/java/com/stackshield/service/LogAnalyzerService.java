package com.stackshield.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stackshield.model.Alert;
import com.stackshield.model.AnalyzedLog;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
public class LogAnalyzerService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    // Alert template map: eventID -> Alert (host fields blank here)
    private static final Map<String, Alert> alertTemplates = new HashMap<>();

    static {
        // Critical Alerts
        alertTemplates.put("s3-critical-full-control", createAlert("S3-001", "S3", "Bucket: public-bucket",
                "Bucket grants FULL_CONTROL to all users", "Critical", "Restrict bucket ACL to avoid public FULL_CONTROL."));
        alertTemplates.put("iam-critical-root-access", createAlert("IAM-001", "IAM", "Root User",
                "Root access key created", "Critical", "Avoid using root user access keys."));
        alertTemplates.put("trail-critical-deleted", createAlert("CT-001", "CloudTrail", "Trail: CriticalTrail",
                "Critical CloudTrail trail was deleted", "Critical", "Ensure critical trails are protected from deletion."));
        alertTemplates.put("config-critical-disabled", createAlert("Config-001", "Config", "Configuration Recorder: default",
                "Configuration Recorder is stopped", "Critical", "Keep configuration recorder enabled for audit logs."));
        alertTemplates.put("sns-critical-wildcard", createAlert("SNS-001", "SNS", "Topic with wildcard policy",
                "SNS topic allows publishing from any principal (*)", "Critical", "Restrict SNS topic policies to specific principals."));
        alertTemplates.put("cw-critical-no-root", createAlert("CW-001", "CloudWatch", "Metric Filter",
                "Metric filter excludes root user", "Critical", "Ensure root user activity is monitored."));

        // High Alerts
        alertTemplates.put("iam-high-pwd-reuse", createAlert("IAM-002", "IAM", "Password Policy",
                "Password reuse prevention is disabled (set to 0)", "High", "Enable password reuse prevention."));
        alertTemplates.put("config-high-global-off", createAlert("Config-002", "Config", "Recording Group",
                "Global resource types are excluded from recording", "High", "Include global resource types for complete auditing."));
        alertTemplates.put("trail-high-single-region", createAlert("CT-002", "CloudTrail", "Trail",
                "Trail is single-region, not multi-region", "High", "Enable multi-region trails for broader coverage."));
        alertTemplates.put("cw-high-no-sg-alarm", createAlert("CW-002", "CloudWatch", "Metric Filter",
                "No alarm set for security group authorizations", "High", "Set alarms to monitor security group changes."));
        alertTemplates.put("sns-high-no-policy", createAlert("SNS-002", "SNS", "Topic: NoPolicyTopic",
                "SNS topic created without policy", "High", "Add appropriate policies to SNS topics."));
        alertTemplates.put("s3-high-no-encryption", createAlert("S3-002", "S3", "Bucket: unencrypted-bucket",
                "Bucket has no server-side encryption configured", "High", "Enable server-side encryption on buckets."));

        // Medium Alerts
        alertTemplates.put("iam-medium-no-mfa", createAlert("IAM-003", "IAM", "User: UserNoMFA",
                "User created without MFA enabled", "Medium", "Enforce MFA for IAM users."));
        alertTemplates.put("config-medium-unencrypted-bucket", createAlert("Config-003", "Config", "Delivery Channel Bucket",
                "Delivery channel uses unencrypted S3 bucket", "Medium", "Use encrypted buckets for delivery channel."));
        alertTemplates.put("trail-medium-unencrypted-s3", createAlert("CT-003", "CloudTrail", "Trail Logs",
                "Trail logs stored in unencrypted S3 bucket", "Medium", "Encrypt S3 buckets for CloudTrail logs."));
        alertTemplates.put("cw-medium-zero-threshold", createAlert("CW-003", "CloudWatch", "Metric Alarm: FailedLoginAlarm",
                "Alarm threshold set to zero", "Medium", "Set proper thresholds for metric alarms."));
        alertTemplates.put("sns-medium-cross-sub", createAlert("SNS-003", "SNS", "Subscription",
                "SNS topic subscribed by external SQS queue", "Medium", "Review cross-account SNS subscriptions."));
        alertTemplates.put("s3-medium-no-logging", createAlert("S3-003", "S3", "Bucket: my-bucket",
                "Bucket logging is not enabled", "Medium", "Enable logging for S3 buckets."));

        // Low Alerts
        alertTemplates.put("iam-low-empty-group", createAlert("IAM-004", "IAM", "Group: EmptyGroup",
                "IAM group created but has no users", "Low", "Remove or populate empty groups."));
        alertTemplates.put("config-low-old-role", createAlert("Config-004", "Config", "Configuration Recorder Role",
                "Old role ARN configured for configuration recorder", "Low", "Update configuration recorder role ARN."));
        alertTemplates.put("trail-low-no-logs", createAlert("CT-004", "CloudTrail", "Trail",
                "Trail created without CloudWatch Logs integration", "Low", "Enable CloudWatch Logs for trail monitoring."));
        alertTemplates.put("cw-low-short-retention", createAlert("CW-004", "CloudWatch", "Log Group: /aws/app/logs",
                "Log retention set to 1 day", "Low", "Increase log retention period."));
        alertTemplates.put("sns-low-sensitive-name", createAlert("SNS-004", "SNS", "Topic: internal-alerts-sensitive",
                "SNS topic name contains sensitive words", "Low", "Avoid sensitive terms in topic names."));
        alertTemplates.put("s3-low-wildcard", createAlert("S3-004", "S3", "Bucket: example-bucket",
                "Bucket policy uses wildcard permissions", "Low", "Avoid wildcard permissions in bucket policies."));
    }

    public List<AnalyzedLog> analyzeLogs(MultipartFile file) throws IOException {
        List<AnalyzedLog> result = new ArrayList<>();
        // Read the raw list of CloudTrail-style logs
        List<Map<String, Object>> logs = objectMapper.readValue(
                file.getInputStream(),
                new TypeReference<List<Map<String, Object>>>() {}
        );

        for (Map<String, Object> log : logs) {
            String eventID = (String) log.get("eventID");
            if (eventID == null) {
                eventID = (String) log.get("eventName");
            }

            // Lookup template (host fields empty), then clone & set host info
            Alert template = alertTemplates.get(eventID);
            Alert alertWithHost = null;
            if (template != null) {
                String hostIp   = (String) log.getOrDefault("sourceIPAddress", null);
                String hostName = (String) log.getOrDefault("hostName", null);

                // Use 8-arg constructor: (code, service, resource, description, severity, recommendation, hostIp, hostName)
                alertWithHost = new Alert(
                        template.getCode(),
                        template.getService(),
                        template.getResource(),
                        template.getDescription(),
                        template.getSeverity(),
                        template.getRecommendation(),
                        hostIp,
                        hostName
                );
            }

            result.add(new AnalyzedLog(log, alertWithHost));
        }

        return result;
    }

    private static Alert createAlert(
            String id, String service, String resource,
            String message, String severity, String recommendation
    ) {
        // hostIp/hostName left null here
        return new Alert(id, service, resource, message, severity, recommendation, null, null);
    }
}
