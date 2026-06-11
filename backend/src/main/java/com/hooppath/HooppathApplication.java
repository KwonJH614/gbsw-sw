package com.hooppath;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class HooppathApplication {

	public static void main(String[] args) {
		SpringApplication.run(HooppathApplication.class, args);
	}

}
