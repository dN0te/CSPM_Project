package com.stackshield.parser;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.List;

public class IamPolicyParser {

    public static List<JsonNode> parse(String jsonContent) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(jsonContent);
            return List.of(root);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse IAM Policy JSON", e);
        }
    }
}
