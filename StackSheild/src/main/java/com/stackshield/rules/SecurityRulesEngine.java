//package com.stackshield.rules;
//
//import com.fasterxml.jackson.databind.JsonNode;
//import com.stackshield.model.Issue;
//
//import java.util.ArrayList;
//import java.util.List;
//import java.util.UUID;
//
//public class SecurityRulesEngine {
//
//    public static List<Issue> evaluate(List<JsonNode> parsedData) {
//        List<Issue> issues = new ArrayList<>();
//
//        for (JsonNode node : parsedData) {
//            if (node.toString().contains("\"Action\": \"*\"") || node.toString().contains("\"Resource\": \"*\"")) {
//                issues.add(new Issue(
//                        UUID.randomUUID().toString(),
//                        "Overly permissive IAM Policy detected ('*' action or resource)",
//                        "HIGH",
//                        "IAM Policy"
//                ));
//            }
//        }
//        return issues;
//    }
//}
