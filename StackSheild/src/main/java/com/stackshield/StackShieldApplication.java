package com.stackshield;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.stackshield")
public class StackShieldApplication {

	public static void main(String[] args) {

		SpringApplication.run(StackShieldApplication.class, args);
	}

}
