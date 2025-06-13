package com.prigione;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class PrigioneRecordsApplication {

    public static void main(String[] args) {
        SpringApplication.run(PrigioneRecordsApplication.class, args);
    }
}